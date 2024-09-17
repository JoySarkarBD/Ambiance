import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import Post from './post.model';
import { postServices } from './post.service';

const MODEL_NAME = 'post';

// Helper function to save a single file
async function saveFile(file: UploadedFile, subFolder: string): Promise<string> {
  const fileName = `${uuidv4()}${path.extname(file.name)}`;
  const relativePath = path.join('uploads', MODEL_NAME, subFolder);
  const absolutePath = path.join(__dirname, '../../../public', relativePath);

  // Ensure the directory exists
  await fs.mkdir(absolutePath, { recursive: true });

  const filePath = path.join(absolutePath, fileName);
  await file.mv(filePath);

  // Return the path relative to the public folder
  return `/uploads/${MODEL_NAME}/${subFolder}/${fileName}`;
}

// Helper function to save multiple images
async function saveImages(images: UploadedFile | UploadedFile[] | undefined): Promise<string[]> {
  if (!images) return [];
  const imageFiles = Array.isArray(images) ? images : [images];
  const imagePaths = await Promise.all(imageFiles.map((img) => saveFile(img, 'images')));
  return imagePaths;
}

// Helper function to delete a file
async function deleteFile(filePath: string): Promise<void> {
  const absolutePath = path.join(__dirname, '../../../public', filePath);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    console.error(`Failed to delete file: ${absolutePath}`, error);
  }
}

// Helper function to handle image update
async function handleImageUpdate(
  post: any, // The existing post
  newImages: UploadedFile | UploadedFile[] | undefined,
  imagesToRemove: string[] | undefined
): Promise<string[]> {
  // Start with the existing images
  let updatedImages = [...post.images];

  // Remove specified images from the filesystem and the list
  if (imagesToRemove) {
    for (const imageToRemove of imagesToRemove) {
      // Check if the image exists in the post
      const index = updatedImages.indexOf(imageToRemove);
      if (index > -1) {
        // Remove from list
        updatedImages.splice(index, 1);
        // Delete from filesystem
        await deleteFile(imageToRemove);
      }
    }
  }

  // If there are new images, save them and update the list
  if (newImages) {
    const imageFiles = Array.isArray(newImages) ? newImages : [newImages];
    const newImagePaths = await Promise.all(imageFiles.map((img) => saveFile(img, 'images')));
    updatedImages.push(...newImagePaths);
  }

  return updatedImages;
}

/**
 * Controller function to handle the creation of a single Post.
 *
 * @param {Request} req - The request object containing post data in the body and files.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createPost = catchAsync(async (req: Request, res: Response) => {
  const { title, subtitle, description } = req.body;
  const banner = req.files?.banner as UploadedFile | undefined;
  const images = req.files?.images as UploadedFile | UploadedFile[] | undefined;

  // Validate required fields
  if (!banner) {
    throw new Error('Missing required field: banner');
  }

  // Save banner
  const bannerPath = await saveFile(banner, 'banners');

  // Save images
  const imagePaths = await saveImages(images);

  // Prepare data for service
  const postData = {
    title,
    subtitle: subtitle || '',
    description,
    banner: bannerPath,
    images: imagePaths,
    created_by: new mongoose.Types.ObjectId(req.user?._id),
  };

  // Call the service method to create a new post and get the result
  const result = await postServices.createPost(postData);

  // If there's an error to create post, then delete the saved images and throw an error
  if (!result) {
    await deleteFile(bannerPath);
    if (imagePaths.length > 0) {
      await Promise.all(imagePaths.map((path) => deleteFile(path)));
    }
    throw new Error('Failed to create post');
  }

  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Post created successfully', result);
});

/**
 * Controller function to handle the update operation for a single post.
 *
 * @param {Request} req - The request object containing the ID of the post to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the existing post by ID
  const post = await Post.findById(id);
  if (!post) {
    throw new Error('Post not found');
  }

  // Get banner and images from the request
  const banner = req.files?.banner as UploadedFile | undefined;
  const newImages = req.files?.images as UploadedFile | UploadedFile[] | undefined;
  const imagesToRemove = req.body?.imagesToRemove as string[] | undefined;

  // Handle banner update: delete the old one if a new one is provided
  let bannerPath = post.banner;
  if (banner) {
    // Delete the old banner
    await deleteFile(post.banner);
    // Save the new banner
    bannerPath = await saveFile(banner, 'banners');
  }

  // Handle image update
  const updatedImages = await handleImageUpdate(post, newImages, imagesToRemove);

  // Prepare data for update
  const updateData = {
    ...req.body,
    banner: bannerPath,
    images: updatedImages,
    created_by: new mongoose.Types.ObjectId(req.user?._id),
  };

  // Call the service method to update the post by ID and get the result
  const result = await postServices.updatePost(id, updateData);

  // If there's an error to update post, then delete the saved images and throw an error
  if (!result) {
    await deleteFile(bannerPath);
    if (updatedImages.length > 0) {
      await Promise.all(updatedImages.map((path) => deleteFile(path)));
    }
    throw new Error('Failed to update post');
  }

  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Post updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single post.
 *
 * @param {Request} req - The request object containing the ID of the post to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deletePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the post by ID to get the associated file paths
  const post = await Post.findById(id);
  if (!post) {
    throw new Error('Post not found');
  }

  // Delete the post record from the database
  const result = await postServices.deletePost(id);

  if (!result) {
    throw new Error('Failed to delete post');
  }

  // Delete the banner file
  await deleteFile(post.banner);

  // Delete all image files if images exist
  for (const imagePath of post.images) {
    await deleteFile(imagePath);
  }

  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Post deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single post by ID.
 *
 * @param {Request} req - The request object containing the ID of the post to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getPostById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the post by ID and get the result
  const result = await postServices.getPostById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Post retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple posts.
 *
 * @param {Request} req - The request object containing query parameters for filtering, if any.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getAllPost = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get all posts
  const result = await postServices.getAllPost();
  return ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});

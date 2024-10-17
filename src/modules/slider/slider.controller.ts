import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import Slider from './slider.model';
import { sliderServices } from './slider.service';

const MODEL_NAME = 'slider';

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
  slider: any, // The existing post
  newImages: UploadedFile | UploadedFile[] | undefined,
  imagesToRemove: string[] | undefined
): Promise<string[]> {
  // Start with the existing images
  let updatedImages = [...slider.images];

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
 * Controller function to handle the creation of a single Slider.
 *
 * @param {Request} req - The request object containing slider data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISlider>>} - The created slider.
 * @throws {Error} - Throws an error if the slider creation fails.
 */
export const createOrUpdateSlider = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.body;

  const images = req.files?.images as UploadedFile | UploadedFile[] | undefined;

  // Check slider exist or not
  const existingSlider = await Slider.findOne({ type });

  if (!existingSlider) {
    // Validate required fields
    if (!images) {
      throw new Error('Missing required field: image');
    }

    // Save images
    const imagePaths = await saveImages(images as UploadedFile);

    // Prepare data for service
    const galleryData = {
      type,
      images: imagePaths,
      created_by: new mongoose.Types.ObjectId(req.user?._id),
    };

    // Call the service method to create a new slider and get the result
    const result = await sliderServices.createSlider(galleryData);

    // Send a success response with the created resource data
    ServerResponse(res, true, 201, 'Slider created successfully', result);
  } else {
    const imagesToRemove = req.body?.imagesToRemove as string[] | undefined;

    // Update the image array (removing selected images and adding new ones)
    const updatedImages = await handleImageUpdate(existingSlider, images, imagesToRemove);

    // Prepare the update data
    const updateData = {
      images: updatedImages,
      updated_by: new mongoose.Types.ObjectId(req.user?._id),
    };

    // Attempt to update the slider in the database
    const result = await sliderServices.updateSlider(existingSlider._id as string, updateData);

    // Send a success response with the updated slider data
    ServerResponse(res, true, 200, 'Slider updated successfully', result);
  }
});

/**
 * Controller function to handle the retrieval of multiple slider.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<Partial<ISlider>[]>} - The retrieved slider.
 * @throws {Error} - Throws an error if the slider retrieval fails.
 */
export const getSliders = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple slider based on query parameters and get the result
  const result = await sliderServices.getSliders(req.query);
  if (!result) throw new Error('Failed to retrieve slider');
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Sliders retrieved successfully', result);
});


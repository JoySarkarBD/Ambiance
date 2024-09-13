import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import Service from './service.model';
import { serviceServices } from './service.service';

const MODEL_NAME = 'service';

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
  service: any, // The existing service
  newImages: UploadedFile | UploadedFile[] | undefined,
  imagesToRemove: string[] | undefined
): Promise<string[]> {
  // Start with the existing images
  let updatedImages = [...service.images];

  // Remove specified images from the filesystem and the list
  if (imagesToRemove) {
    for (const imageToRemove of imagesToRemove) {
      // Check if the image exists in the service
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
 * Controller function to handle the creation of a single Service.
 *
 * @param {Request} req - The request object containing service data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createService = catchAsync(async (req: Request, res: Response) => {
  const { title, description, reviews, rating } = req.body;
  const banner = req.files?.banner as UploadedFile | undefined;
  const thumbnail = req.files?.thumbnail as UploadedFile | undefined;
  const images = req.files?.images as UploadedFile | UploadedFile[] | undefined;

  // Validate required fields:
  if (!banner) {
    return ServerResponse(res, false, 400, 'Missing required field: banner');
  }
  if (!thumbnail) {
    return ServerResponse(res, false, 400, 'Missing required field: thumbnail');
  }

  // Save banner
  const bannerPath = await saveFile(banner, 'banners');

  // Save thumbnail
  const thumbnailPath = await saveFile(thumbnail, 'thumbnails');

  // Save images
  const imagePaths = await saveImages(images);

  // Prepare data for service
  const serviceData = {
    title,
    description,
    banner: bannerPath,
    thumbnail: thumbnailPath,
    reviews,
    rating,
    images: imagePaths,
    created_by: new mongoose.Types.ObjectId(req.user?._id),
  };

  // Call the service method to create a new service and get the result
  const result = await serviceServices.createService(serviceData);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Service created successfully', result);
});

/**
 * Controller function to handle the update operation for a single service.
 *
 * @param {Request} req - The request object containing the ID of the service to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the existing service by ID
  const service = await Service.findById(id);
  if (!service) {
    return ServerResponse(res, false, 404, 'Service not found');
  }

  // Get banner, thumbnail and images from the request
  const banner = req.files?.banner as UploadedFile | undefined;
  const thumbnail = req.files?.thumbnail as UploadedFile | undefined;
  const newImages = req.files?.images as UploadedFile | UploadedFile[] | undefined;
  const imagesToRemove = req.body?.imagesToRemove as string[] | undefined;

  // Handle banner update: delete the old one if a new one is provided
  let bannerPath = service.banner;
  if (banner) {
    // Delete the old banner
    await deleteFile(service.banner);
    // Save the new banner
    bannerPath = await saveFile(banner, 'banners');
  }

  // Handle thumbnail update: delete the old one if a new one is provided
  let thumbnailPath = service.thumbnail;
  if (thumbnail) {
    // Delete the old thumbnail
    await deleteFile(service.thumbnail);
    // Save the new thumbnail
    thumbnailPath = await saveFile(thumbnail, 'thumbnails');
  }

  // Handle image update
  const updatedImages = await handleImageUpdate(service, newImages, imagesToRemove);

  // Prepare data for update
  const updateData = {
    ...req.body,
    banner: bannerPath,
    thumbnail: thumbnailPath,
    images: updatedImages,
    created_by: new mongoose.Types.ObjectId(req.user?._id),
  };

  // Call the service method to update the service by ID and get the result
  const result = await serviceServices.updateService(id, updateData);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Service updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single service.
 *
 * @param {Request} req - The request object containing the ID of the service to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the service by ID to get the associated file paths
  const service = await Service.findById(id);
  if (!service) {
    return ServerResponse(res, false, 404, 'Service not found');
  }

  // Call the service method to delete the service by ID
  await serviceServices.deleteService(id);

  // Delete the banner and thumbnail file
  await deleteFile(service.banner);
  await deleteFile(service.thumbnail);

  // Delete all image files if images exist
  for (const imagePath of service.images) {
    await deleteFile(imagePath);
  }

  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Service deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple service.
 *
 * @param {Request} req - The request object containing an array of IDs of service to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyService = catchAsync(async (req: Request, res: Response) => {
  // Expecting an object with an `ids` property
  const { ids }: { ids: string[] } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return ServerResponse(res, false, 400, 'No service IDs provided');
  }

  // Find all services by IDs to get their associated file paths
  const services = await Service.find({ _id: { $in: ids } });

  // Delete each service and associated files
  await Promise.all(
    services.map(async (service) => {
      // Delete the banner and thumbnail file
      await deleteFile(service.banner);
      await deleteFile(service.thumbnail);

      // Delete all image files if images exist
      if (service.images) {
        for (const imagePath of service.images) {
          await deleteFile(imagePath);
        }
      }

      // Delete the service record from the database
      await serviceServices.deleteService(req.body.ids);
    })
  );
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single service by ID.
 *
 * @param {Request} req - The request object containing the ID of the service to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the service by ID and get the result
  const result = await serviceServices.getServiceById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Service retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple service.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const { user } = req; // Assume req.user is set by authentication middleware
  const { searchKey, showPerPage, pageNo } = req.query;

  const page = parseInt(pageNo as string, 10);
  const limit = parseInt(showPerPage as string, 10);
  const skip = (page - 1) * limit;

  if (user?.role === 'admin') {
    const filter: any = {};
    if (searchKey) {
      const regex = new RegExp(searchKey as string, 'i'); // 'i' for case-insensitive
      filter.$or = [{ title: { $regex: regex } }, { description: { $regex: regex } }];
    }

    const { data, totalCount } = await serviceServices.getManyService(filter, limit, skip);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Send response with pagination info
    return ServerResponse(res, true, 200, 'Resources retrieved successfully', {
      posts: data,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } else {
    // Call the service method to get all posts for non-admin users
    const result = await serviceServices.getAllServices();
    return ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
  }
});


import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import Project from './project.model';
import { projectServices } from './project.service';

const MODEL_NAME = 'project';

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
  project: any, // The existing project
  newImages: UploadedFile | UploadedFile[] | undefined,
  imagesToRemove: string[] | undefined
): Promise<string[]> {
  // Start with the existing images
  let updatedImages = [...project.images];

  // Remove specified images from the filesystem and the list
  if (imagesToRemove) {
    for (const imageToRemove of imagesToRemove) {
      // Check if the image exists in the project
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
 * Controller function to handle the creation of a single Project.
 *
 * @param {Request} req - The request object containing project data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createProject = catchAsync(async (req: Request, res: Response) => {
  const images = req.files?.images as UploadedFile | UploadedFile[] | undefined;

  const { title, subject, skills, description, url } = req.body;

  // Save images
  const imagePaths = await saveImages(images);

  const projectData = {
    title,
    subject,
    skills,
    description,
    url,
    images: imagePaths,
    created_by: new mongoose.Types.ObjectId(req.user?._id),
  };

  // Call the service method to create a new project and get the result
  const result = await projectServices.createProject(projectData);

  // If there's an error to create project, then delete the saved images
  if (!result) {
    if (imagePaths.length > 0) {
      await Promise.all(imagePaths.map((path) => deleteFile(path)));
    }
  }

  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Project created successfully', result);
});

/**
 * Controller function to handle the update operation for a single project.
 *
 * @param {Request} req - The request object containing the ID of the project to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    throw new Error('Project not found');
  }

  const { title, subject, skills, description, url } = req.body;
  const images = req.files?.images as UploadedFile | UploadedFile[] | undefined;
  const imagesToRemove = req.body?.imagesToRemove as string[] | undefined;

  //Handle image update
  const updatedImages = await handleImageUpdate(project, images, imagesToRemove);

  const projectData = {
    title,
    subject,
    skills,
    description,
    url,
    images: updatedImages,
    created_by: new mongoose.Types.ObjectId(req.user?._id),
  };

  // Call the service method to update the project by ID and get the result
  const result = await projectServices.updateProject(id, projectData);

  // If there's an error to update project, then delete the saved images
  if (!result) {
    if (updatedImages.length > 0) {
      await Promise.all(updatedImages.map((path) => deleteFile(path)));
    }
  }

  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Project updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single project.
 *
 * @param {Request} req - The request object containing the ID of the project to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the project by ID to get the associated file paths
  const project = await Project.findById(id);

  if (!project) {
    throw new Error('Project not found');
  }

  // Delete the project record from the database
  const result = await projectServices.deleteProject(id);

  if (!result) {
    throw new Error('Failed to delete project');
  }

  // Delete all image files if images exist
  for (const imagePath of project.images) {
    await deleteFile(imagePath);
  }

  ServerResponse(res, true, 200, 'Project deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single project by ID.
 *
 * @param {Request} req - The request object containing the ID of the project to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the project by ID and get the result
  const result = await projectServices.getProjectById(id);

  if (result === null) throw new Error('Project not found');

  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Project retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple project.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getProject = catchAsync(async (req: Request, res: Response) => {
  const { user } = req; // Assume req.user is set by authentication middleware
  const { searchKey, showPerPage, pageNo } = req.query;

  const page = parseInt(pageNo as string, 10);
  const limit = parseInt(showPerPage as string, 10);
  const skip = (page - 1) * limit;

  if (user?.role === 'admin') {
    const filter: any = {};
    if (searchKey) {
      const regex = new RegExp(searchKey as string, 'i'); // 'i' for case-insensitive
      filter.$or = [
        { title: { $regex: regex } },
        { url: { $regex: regex } },
        { subject: { $regex: regex } },
        { description: { $regex: regex } },
        {
          // Use $elemMatch to find if any skill matches the search key
          skills: { $elemMatch: { $regex: regex } },
        },
      ];
    }

    const { data, totalCount } = await projectServices.getManyProject(filter, limit, skip);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Send response with pagination info
    return ServerResponse(res, true, 200, 'Resources retrieved successfully', {
      projects: data,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } else {
    // Call the service method to get all projects for non-admin users
    const result = await projectServices.getAllProject();
    return ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
  }
});

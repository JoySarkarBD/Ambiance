import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import User from './user.model';
import { userServices } from './user.service';

const MODEL_NAME = 'user';

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

// Helper function to delete a file
async function deleteFile(filePath: string): Promise<void> {
  const absolutePath = path.join(__dirname, '../../../public', filePath);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    console.error(`Failed to delete file: ${absolutePath}`, error);
  }
}

/**
 * Controller function to handle the update operation for a single user.
 *
 * @param {Request} req - The request object containing the ID of the user to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the existing user by ID
  const user = await User.findById(id);
  if (!user) {
    return ServerResponse(res, false, 404, 'User not found');
  }

  const avatar = req.files?.avatar as UploadedFile | undefined;

  // Handle avatar update: delete the old one if a new one is provided
  let avatarPath = user.avatar;

  if (avatar) {
    if (avatarPath) {
      // Only attempt to delete the old avatar if it exists
      await deleteFile(avatarPath);
    }
    // Save the new avatar and update the path
    avatarPath = await saveFile(avatar, 'avatars');
  }

  // Include the new avatar path in the updated data
  const updatedData = {
    ...req.body,
    avatar: avatarPath,
  };

  // Call the service method to update the user by ID and get the result
  const result = await userServices.updateUser(res, id, updatedData);

  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'User updated successfully', result);
});

/**
 * Controller function to handle the retrieval of user information.
 *
 * @param {Request} req - The request object containing the ID of the user in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const aboutUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get the user information
  const result = await userServices.aboutUser();

  // Send a success response with the user information
  ServerResponse(res, true, 200, 'About user details retrieved successfully', result);
});

/**
 * Controller function to handle updating the user's showData field.
 *
 * @param {Request} req - The request object containing the ID of the user in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateShowData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Call the service method to update the user's showData field
  const result = await userServices.updateShowData(id);

  // Send a success response with the updated user data
  ServerResponse(res, true, 200, 'User showData updated successfully', result);
});

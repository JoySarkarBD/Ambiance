import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { socialServices } from './social.service';

/**
 * Controller function to handle the creation of a single Social.
 *
 * @param {Request} req - The request object containing social data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createSocial = catchAsync(async (req: Request, res: Response) => {
  // Ensure the user is properly attached to the request and set `created_by`
  req.body.created_by = new mongoose.Types.ObjectId(req.user?._id);
  // Call the service method to create a new social and get the result
  const result = await socialServices.createSocial(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Social created successfully', result);
});

/**
 * Controller function to handle the update operation for a single social.
 *
 * @param {Request} req - The request object containing the ID of the social to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateSocial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ensure the user is properly attached to the request and set `created_by`
  req.body.created_by = new mongoose.Types.ObjectId(req.user?._id);
  // Call the service method to update the social by ID and get the result
  const result = await socialServices.updateSocial(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Social updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single social.
 *
 * @param {Request} req - The request object containing the ID of the social to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteSocial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the social by ID
  const result = await socialServices.deleteSocial(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Social deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple social.
 *
 * @param {Request} req - The request object containing an array of IDs of social to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManySocial = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple social and get the result
  await socialServices.deleteManySocial(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single social by ID.
 *
 * @param {Request} req - The request object containing the ID of the social to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getSocialById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the social by ID and get the result
  const result = await socialServices.getSocialById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Social retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of all social.
 *
 * @param {Request} req - The Express request object (not used in this case).
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getAllSocial = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple social based on query parameters and get the result
  const result = await socialServices.getAllSocial();
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of a single social by name.
 * This function handles the main logic for retrieving a social based on the provided name.
 *
 * @param {Request} req - The Express request object containing the name parameter.
 * @param {Response} res - The response object used to send the result back to the client.
 * @returns {void}
 */
export const getSocialByName = catchAsync(async (req: Request, res: Response) => {
  // Call the service function to get the social by name
  const result = await socialServices.getSocialByName(req.params.name);
  // Send a success response with the retrieved social data
  ServerResponse(res, true, 200, 'Social retrieved successfully', result);
});

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { optionServices } from './option.service';

/**
 * Controller function to handle the creation of a single Option.
 *
 * @param {Request} req - The request object containing option data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createOption = catchAsync(async (req: Request, res: Response) => {
  // Ensure the user is properly attached to the request and set `created_by`
  req.body.created_by = new mongoose.Types.ObjectId(req.user?._id);
  // Call the service method to create a new option and get the result
  const result = await optionServices.createOption(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Option created successfully', result);
});

/**
 * Controller function to handle the update operation for a single option.
 *
 * @param {Request} req - The request object containing the ID of the option to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateOption = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ensure the user is properly attached to the request and set `created_by`
  req.body.created_by = new mongoose.Types.ObjectId(req.user?._id);
  // Call the service method to update the option by ID and get the result
  const result = await optionServices.updateOption(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Option updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single option.
 *
 * @param {Request} req - The request object containing the ID of the option to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteOption = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the option by ID
  await optionServices.deleteOption(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Option deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple option.
 *
 * @param {Request} req - The request object containing an array of IDs of option to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyOption = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple option and get the result
  await optionServices.deleteManyOption(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single option by name.
 *
 * @param {Request} req - The request object containing the name of the option to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getOptionByName = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.params;
  // Call the service method to get the option by name and get the result
  const result = await optionServices.getOptionByName(name);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Option retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple option.
 *
 * @param {Request} req - The Express request object (not used in this case).
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getAllOption = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple option based on query parameters and get the result
  const result = await optionServices.getAllOption();
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});

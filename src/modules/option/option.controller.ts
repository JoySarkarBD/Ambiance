import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { optionServices } from './option.service';

/**
 * Controller function to handle the creation of a single option.
 *
 * @param {Request} req - The request object containing option data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createOption = catchAsync(async (req: Request, res: Response) => {
  req.body.created_by = new mongoose.Types.ObjectId(req.user?._id);
  // Call the service method to create option
  const result = await optionServices.createOption(req.body);
  ServerResponse(res, true, 201, 'Option created successfully', result);
});

/**
 * Controller function to handle the update of a single option.
 *
 * @param {Request} req - The request object containing the ID of the option to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateOption = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  req.body.created_by = new mongoose.Types.ObjectId(req.user?._id);
  // Call the service method to update option by id
  const result = await optionServices.updateOption(id, req.body);
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
  // Call the service method to delete option by id
  await optionServices.deleteOption(id);
  ServerResponse(res, true, 200, 'Option deleted successfully');
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
  // Call the service method to get option by name
  const result = await optionServices.getOptionByName(name);
  ServerResponse(res, true, 200, 'Option retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of all options.
 *
 * @param {Request} req - The request object containing query parameters for filtering, if any.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getAllOption = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get all options
  const result = await optionServices.getAllOption();
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});

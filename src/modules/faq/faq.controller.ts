import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { faqServices } from './faq.service';

/**
 * Controller function to handle the creation of a single Faq.
 *
 * @param {Request} req - The request object containing faq data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createFaq = catchAsync(async (req: Request, res: Response) => {
  // Ensure the user is properly attached to the request and set `created_by`
  req.body.created_by = new mongoose.Types.ObjectId(req.user?._id);

  // Call the service method to create a new FAQ and get the result
  const result = await faqServices.createFaq(req.body);

  // Send a success response with the created FAQ data
  ServerResponse(res, true, 201, 'FAQ created successfully', result);
});

/**
 * Controller function to handle the update operation for a single faq.
 *
 * @param {Request} req - The request object containing the ID of the faq to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the faq by ID and get the result
  const result = await faqServices.updateFaq(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Faq updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single faq.
 *
 * @param {Request} req - The request object containing the ID of the faq to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the faq by ID
  await faqServices.deleteFaq(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Faq deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple faq.
 *
 * @param {Request} req - The request object containing an array of IDs of faq to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyFaq = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple faq and get the result
  await faqServices.deleteManyFaq(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single faq by ID.
 *
 * @param {Request} req - The request object containing the ID of the faq to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getFaqById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the faq by ID and get the result
  const result = await faqServices.getFaqById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Faq retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of all faq.
 *
 * @param {Request} req - The Express request object (not used in this case).
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getAllFaq = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple faq based on query parameters and get the result
  const result = await faqServices.getAllFaq();
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});

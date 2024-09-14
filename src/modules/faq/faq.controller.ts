import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { faqServices } from './faq.service';

/**
 * Controller function to handle the creation of a single FAQ.
 *
 * @param {Request} req - The request object containing FAQ data in the body and user information.
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
 * Controller function to handle the update operation for a single FAQ.
 *
 * @param {Request} req - The request object containing the ID of the FAQ to update in URL parameters and updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  req.body.created_by = new mongoose.Types.ObjectId(req.user?._id);
  // Call the service method to update the FAQ by ID
  const result = await faqServices.updateFaq(id, req.body);
  // Send a success response with the updated FAQ data
  ServerResponse(res, true, 200, 'FAQ updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single FAQ.
 *
 * @param {Request} req - The request object containing the ID of the FAQ to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the FAQ by ID
  const result = await faqServices.deleteFaq(id);
  // Send a success response confirming the FAQ deletion
  ServerResponse(res, true, 200, 'FAQ deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple FAQs.
 *
 * @param {Request} req - The request object containing an array of IDs of FAQs to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyFaq = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple FAQs
  await faqServices.deleteManyFaq(req.body.ids);
  // Send a success response confirming the FAQs deletion
  ServerResponse(res, true, 200, 'FAQs deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single FAQ by ID.
 *
 * @param {Request} req - The request object containing the ID of the FAQ to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getFaqById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the FAQ by ID
  const result = await faqServices.getFaqById(id);
  // Send a success response with the retrieved FAQ data
  ServerResponse(res, true, 200, 'FAQ retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of all FAQs.
 *
 * @param {Request} req - The request object containing query parameters for filtering, if any.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getAllFaq = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get all FAQs
  const result = await faqServices.getAllFaq();
  // Send a success response with the retrieved FAQs data
  ServerResponse(res, true, 200, 'FAQs retrieved successfully', result);
});

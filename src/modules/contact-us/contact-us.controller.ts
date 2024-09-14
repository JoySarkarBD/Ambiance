import { Request, Response } from 'express';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { contactUsServices } from './contact-us.service';

/**
 * Controller function to handle the creation of a single ContactUs.
 *
 * @param {Request} req - The request object containing contact-us data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createContactUs = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new contact-us and get the result
  await contactUsServices.createContactUs(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'ContactUs created successfully');
});


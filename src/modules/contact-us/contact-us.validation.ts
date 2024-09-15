import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating contactUs data.
 */
const zodContactUsSchema = z
  .object({
    name: z
      .string({ required_error: 'Please provide your name.' })
      .min(1, 'Name cannot be empty.')
      .trim(),
    email: z
      .string({ required_error: 'Please provide your email address.' })
      .email('Please enter a valid email address.')
      .trim(),
    phone: z
      .string({ required_error: 'Please provide your phone number.' })
      .min(1, 'Phone number cannot be empty.')
      .trim(),
    location: z
      .string({ required_error: 'Please provide your location.' })
      .min(1, 'Location cannot be empty.')
      .trim(),
    details: z
      .string({ required_error: 'Please provide the details.' })
      .min(1, 'Details cannot be empty.')
      .trim(),
    iam: z.string({ required_error: 'Please provide valid details for your bio.' }).trim(),
  })
  .strict();

/**
 * Middleware function to validate contactUs using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateContactUs = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodContactUsSchema.safeParse(req.body);

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

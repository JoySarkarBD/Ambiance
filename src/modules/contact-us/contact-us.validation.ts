import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating contactUs data.
 */
const zodContactUsSchema = z
  .object({
    name: z.string().min(1, 'Name is required').trim(),
    email: z.string().email('Invalid email address').trim(),
    phone: z.string().min(1, 'Phone number is required').trim(),
    location: z.string().min(1, 'Location is required').trim(),
    details: z.string().min(1, 'Location is required'),
    iam: z.string().trim(),
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

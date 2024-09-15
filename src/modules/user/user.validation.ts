import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating user data.
 */
const zodUserSchema = z
  .object({
    first_name: z
      .string({ required_error: 'First name is required.' })
      .min(1, 'First name cannot be empty.')
      .trim(),
    last_name: z
      .string({ required_error: 'Last name is required.' })
      .min(1, 'Last name cannot be empty.')
      .trim(),
    email: z
      .string({ required_error: 'Email is required.' })
      .email('Invalid email address.')
      .min(1, 'Email cannot be empty.')
      .trim(),
    bio: z.string().min(1, 'Bio cannot be empty when provided.').trim().optional(),
    designation: z.string().min(1, 'Designation cannot be empty when provided.').trim().optional(),
  })
  .strict();

/**
 * Middleware function to validate user using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodUserSchema.safeParse(req.body);

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

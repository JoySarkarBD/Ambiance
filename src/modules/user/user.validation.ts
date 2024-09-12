import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating user data.
 */
const zodUserSchema = z
  .object({
    first_name: z.string().min(1, { message: 'First name is required' }).trim(),
    last_name: z.string().min(1, { message: 'Last name is required' }).trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    avatar: z.string().url({ message: 'Avatar must be a valid URL' }).optional(),
    role: z.enum(['admin', 'user'], { message: 'Role must be either admin or user' }),
    status: z.string().optional(),
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

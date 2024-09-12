import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Base Zod schema for validating authentication-related data.
 */
const zodAuthSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    previous_password: z
      .string()
      .min(6, { message: 'Previous password must be at least 6 characters long' }),
    new_password: z.string().min(6, { message: 'New password must be at least 6 characters long' }),
    token: z.string().uuid({ message: 'Invalid activation token format' }),
  })
  .strict();

/**
 * Middleware function to validate login using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodAuthSchema
    .pick({ email: true, password: true })
    .safeParse(req.body);

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

/**
 * Middleware function to validate user registration using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodAuthSchema
    .pick({ email: true, password: true, first_name: true, last_name: true })
    .safeParse(req.body);

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

/**
 * Middleware function to validate password reset using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodAuthSchema
    .pick({ previous_password: true, new_password: true })
    .safeParse(req.body);

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

/**
 * Middleware function to validate activation token using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateActivationToken = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodAuthSchema
    .pick({ token: true })
    .safeParse({ token: req.query.token as string });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};


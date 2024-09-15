import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Base Zod schema for validating authentication-related data.
 */
const zodAuthSchema = z
  .object({
    email: z
      .string({ required_error: 'Email page is required' })
      .email({ message: 'Invalid email address' })
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .trim(),
    first_name: z.string({ required_error: 'First name is required' }).min(1).trim(),
    last_name: z.string({ required_error: 'Last name is required' }).min(1).trim(),
    previous_password: z
      .string({ required_error: 'Previous password is required' })
      .min(6, { message: 'Previous password must be at least 6 characters long' }),
    new_password: z
      .string({ required_error: 'New password is required' })
      .min(6, { message: 'New password must be at least 6 characters long' }),
    resetPasswordToken: z
      .string({ required_error: 'Reset password token is required' })
      .uuid({ message: 'Invalid rest password token format' }),
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
 * Middleware function to validate email using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodAuthSchema.pick({ email: true }).safeParse(req.body);

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

/**
 * Middleware function to validate password update using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
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
 * Middleware function to validate the reset password request using a Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodAuthSchema
    .pick({ resetPasswordToken: true, new_password: true })
    .safeParse({ token: req.query.token as string, new_password: req.body });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

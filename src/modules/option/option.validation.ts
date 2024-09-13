import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating option data.
 */
const zodOptionSchema = z
  .object({
    name: z.string().min(1, 'Name is required').trim(),
    value: z.string().min(1, 'Value is required').trim(),
  })
  .strict();

/**
 * Middleware function to validate option using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateOption = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodOptionSchema.pick({ name: true, value: true }).safeParse({
    name: req.body.name,
    value: req.body.value,
  });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};
/**
 * Middleware function to validate option name using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateOptionName = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodOptionSchema.pick({ name: true }).safeParse({
    name: req.body.name,
  });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};


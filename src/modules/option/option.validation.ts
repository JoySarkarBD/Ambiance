import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

// Define the options name as an enum using Zod
const OptionsNameEnum = z.enum(
  ['site-url', 'site-title', 'privacy-policy', 'contact', 'email', 'terms-conditions'],
  {
    // Custom error message for invalid option names
    errorMap: () => ({
      message: 'Please select a valid option name',
    }),
  }
);

/**
 * Zod schema for validating option data.
 * Requires `name` to be one of the predefined enum values and `value` to be a non-empty string.
 */
const zodOptionSchema = z
  .object({
    name: OptionsNameEnum,
    value: z.string().min(1, 'Value is required').trim(),
  })
  .strict(); // Ensures no extra fields are present in the request

/**
 * Middleware to validate `name` and `value` fields in the request body.
 * Uses Zod schema to ensure `name` matches the predefined enum and `value` is non-empty.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const validateOption = (req: Request, res: Response, next: NextFunction) => {
  // Extract and validate only `name` and `value` from request body using Zod schema
  const { error, success } = zodOptionSchema.pick({ name: true, value: true }).safeParse({
    name: req.body.name,
    value: req.body.value,
  });

  // Handle validation errors
  if (!success) {
    return zodErrorHandler(req, res, error);
  }

  // Proceed to the next middleware if validation is successful
  return next();
};

/**
 * Middleware to validate only the `value` field in the request body for updating an option.
 * Uses Zod schema to ensure `value` is a non-empty string.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const validateUpdateOption = (req: Request, res: Response, next: NextFunction) => {
  // Extract and validate only `value` from request body using Zod schema
  const { error, success } = zodOptionSchema.pick({ value: true }).safeParse({
    value: req.body.value,
  });

  // Handle validation errors
  if (!success) {
    return zodErrorHandler(req, res, error);
  }

  // Proceed to the next middleware if validation is successful
  return next();
};

/**
 * Middleware to validate the `name` parameter in the request URL.
 * Uses Zod schema to ensure `name` matches the predefined enum.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const validateOptionName = (req: Request, res: Response, next: NextFunction) => {
  // Extract and validate `name` from request params using Zod schema
  const { error, success } = zodOptionSchema.pick({ name: true }).safeParse({
    name: req.params.name,
  });

  // Handle validation errors
  if (!success) {
    return zodErrorHandler(req, res, error);
  }

  // Proceed to the next middleware if validation is successful
  return next();
};

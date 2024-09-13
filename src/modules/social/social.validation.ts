import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating social data.
 */
const zodSocialSchema = z
  .object({
    name: z.string().min(1, 'Name is required').trim(),
    url: z.string().url('Invalid URL format').min(1, 'URL is required').trim(),
  })
  .strict();

/**
 * Middleware function to validate social using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateSocial = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodSocialSchema.pick({ name: true, url: true }).safeParse({
    name: req.body.name,
    url: req.body.url,
  });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

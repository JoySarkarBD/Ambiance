import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating faq data.
 */
const zodFaqSchema = z
  .object({
    title: z
      .string({ required_error: 'Please provide a title.' })
      .min(1, 'Title cannot be empty.')
      .trim(),
    description: z
      .string({ required_error: 'Please provide a description.' })
      .min(1, 'Description cannot be empty.')
      .trim(),
  })
  .strict();

/**
 * Middleware function to validate faq using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateFaq = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodFaqSchema.pick({ title: true, description: true }).safeParse({
    title: req.body.title,
    description: req.body.description,
  });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

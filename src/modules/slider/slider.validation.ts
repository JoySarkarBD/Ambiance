import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

// Define the slider type platforms as an enum
const SliderTypeEnum = z.enum(['hero', 'post'], {
  // Custom error message for invalid platform names
  errorMap: () => ({
    message: 'Please select a valid slider type: hero or post.',
  }),
});

// Define the slider type platforms as an enum for request query
const SliderTypeQueryEnum = z.enum(['hero', 'post'], {
  // Custom error message for invalid platform names
  errorMap: () => ({
    message: 'Please use valid slider type to query: hero or post.',
  }),
});

/**
 * Zod schema for validating slider data.
 */
const zodSliderSchema = z
  .object({
    type: SliderTypeEnum,
    imagesToRemove: z.union([z.string().trim(), z.array(z.string().trim())]).optional(),
  })
  .strict();

/**
 * Zod schema for validating slider type data for query.
 */
const zodSliderQuerySchema = z
  .object({
    type: SliderTypeQueryEnum,
  })
  .strict();

/**
 * Middleware function to validate slider using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateSlider = (req: Request, res: Response, next: NextFunction) => {
  // Ensure imagesToRemove is always an array
  if (req.body.imagesToRemove) {
    if (typeof req.body.imagesToRemove === 'string') {
      req.body.imagesToRemove = [req.body.imagesToRemove];
    } else if (!Array.isArray(req.body.imagesToRemove)) {
      req.body.imagesToRemove = [];
    }
  }

  // Validate request body
  const { error, success } = zodSliderSchema.safeParse(req.body);

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

/**
 * Middleware function to validate slider type using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateSliderType = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodSliderQuerySchema.pick({ type: true }).safeParse({
    type: req.query.type,
  });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};


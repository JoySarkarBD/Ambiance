import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating service data.
 */
const zodServiceSchema = z
  .object({
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().min(1, 'Description is required').trim(),
    reviews: z.string().transform((val) => Number(val)),
    rating: z.string().transform((val) => Number(val)),
    imagesToRemove: z.union([z.string(), z.array(z.string())]).optional(),
    searchKey: z.string(),
    showPerPage: z
      .string()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || val > 0, {
        message: 'showPerPage must be a positive number or undefined',
      }),
    pageNo: z
      .string()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || val > 0, {
        message: 'pageNo must be a positive number or undefined',
      }),
  })
  .strict();

/**
 * Middleware function to validate service using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateService = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodServiceSchema
    .pick({
      title: true,
      description: true,
      reviews: true,
      rating: true,
    })
    .safeParse({
      title: req.body.title,
      description: req.body.description,
      reviews: req.body.reviews,
      rating: req.body.rating,
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
 * Middleware function to validate imagesToRemove path using Zod schema.
 * This validates the `imagesToRemove` field in the request body.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateImageRemovePath = (req: Request, res: Response, next: NextFunction) => {
  // Ensure imagesToRemove is always an array
  if (typeof req.body.imagesToRemove === 'string') {
    req.body.imagesToRemove = [req.body.imagesToRemove];
  } else if (!Array.isArray(req.body.imagesToRemove)) {
    req.body.imagesToRemove = [];
  }

  // Validate `imagesToRemove` field
  const validationResult = zodServiceSchema
    .pick({ imagesToRemove: true })
    .safeParse({ imagesToRemove: req.body.imagesToRemove });

  // Check if validation was successful
  if (!validationResult.success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, validationResult.error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

/**
 * Middleware function to validate search query parameters using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  // Validate query parameters
  const { error, success } = zodServiceSchema
    .pick({ searchKey: true, showPerPage: true, pageNo: true })
    .safeParse({
      searchKey: req.query.searchKey,
      showPerPage: req.query.showPerPage,
      pageNo: req.query.pageNo,
    });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

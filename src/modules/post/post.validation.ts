import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating post data.
 */
const zodPostSchema = z
  .object({
    title: z
      .string({ required_error: 'Please provide a title.' })
      .min(1, 'Title cannot be empty.')
      .trim(),
    subtitle: z.string({ required_error: 'Please provide a valid subtitle.' }).trim().optional(),
    description: z
      .string({ required_error: 'Please provide a description.' })
      .min(1, 'Description cannot be empty.')
      .trim(),
    imagesToRemove: z.union([z.string().trim(), z.array(z.string().trim())]).optional(),
    searchKey: z
      .string({
        required_error: 'Search key is required. You can use an empty string like "" if necessary.',
      })
      .trim(),
    showPerPage: z
      .string({
        required_error: 'Please specify the number of items to show per page.',
      })
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || val > 0, {
        message: 'Show per page must be a positive number or undefined.',
      }),
    pageNo: z
      .string({
        required_error: 'Please specify the page number.',
      })
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || val > 0, {
        message: 'Page number must be a positive number or undefined.',
      }),
  })
  .strict();

/**
 * Middleware function to validate post using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validatePost = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body, excluding imagesToRemove
  const { error, success } = zodPostSchema
    .omit({
      imagesToRemove: true,
      searchKey: true,
      showPerPage: true,
      pageNo: true,
    })
    .safeParse({
      title: req.body.title,
      subtitle: req.body?.subtitle,
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
  const validationResult = zodPostSchema
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
  const { error, success } = zodPostSchema
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

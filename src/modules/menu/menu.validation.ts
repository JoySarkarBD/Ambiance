import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating menu data.
 */
const zodMenuSchema = z
  .object({
    title: z
      .string({ required_error: 'Please provide a title.' })
      .min(1, 'Title cannot be empty.')
      .trim(),
    url: z
      .string({ required_error: 'Please provide a URL.' })
      .url('Please provide a valid URL.')
      .trim(),
    target: z.string().min(1, 'Target cannot be empty.').trim().nullable().optional(),
    searchKey: z.string({
      required_error: 'Search key is required. You can use an empty string like "" if needed.',
    }),
    showPerPage: z
      .string({
        required_error: 'Please specify the number of items to show per page.',
      })
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || val > 0, {
        message: 'Show per page must be a positive number or left undefined.',
      }),
    pageNo: z
      .string({
        required_error: 'Please specify the page number.',
      })
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || val > 0, {
        message: 'Page number must be a positive number or left undefined.',
      }),
  })
  .strict();

/**
 * Middleware function to validate menu using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateMenu = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodMenuSchema
    .pick({
      title: true,
      url: true,
      target: true,
    })
    .safeParse({
      title: req.body.title,
      url: req.body.url,
      target: req.body?.target,
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
 * Middleware function to validate search query parameters using Zod schema.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  // Validate query parameters
  const { error, success } = zodMenuSchema
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

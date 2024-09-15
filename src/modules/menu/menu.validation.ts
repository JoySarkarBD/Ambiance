import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating menu data.
 */
const zodMenuSchema = z
  .object({
    title: z.string({ required_error: 'Title is required' }).min(1).trim(),
    url: z.string({ required_error: 'URL is required' }).url('Invalid URL format'),
    target: z.string().min(1).trim().nullable().optional(),
    searchKey: z.string({
      required_error: 'Search key is required, but you can simply use empty string like this ""',
    }),
    showPerPage: z
      .string({
        required_error: 'Show per page is required',
      })
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || val > 0, {
        message: 'showPerPage must be a positive number or undefined',
      }),
    pageNo: z
      .string({
        required_error: 'Page no is required',
      })
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || val > 0, {
        message: 'pageNo must be a positive number or undefined',
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

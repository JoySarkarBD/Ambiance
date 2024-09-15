import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating project data.
 */
const zodProjectSchema = z
  .object({
    title: z.string({ required_error: 'Title is required' }).min(1).trim(),
    url: z.string({ required_error: 'URL is required' }).url('Invalid URL format').optional(),
    subject: z.string({ required_error: 'Subject is required' }),
    skills: z
      .array(z.string(), { required_error: 'Skills is required' })
      .min(1, 'skills must have at least one item'),
    imagesToRemove: z.union([z.string(), z.array(z.string())]).optional(),
    description: z.string({ required_error: 'Description is required' }).min(1).trim(),
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
 * Middleware function to validate project using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  if (typeof req.body.skills === 'string') {
    req.body.skills = [req.body.skills];
  }

  const { success, error } = zodProjectSchema
    .pick({
      title: true,
      url: true,
      subject: true,
      skills: true,
      description: true,
    })
    .safeParse({
      title: req.body.title,
      url: req.body.url,
      subject: req.body.subject,
      skills: req.body.skills,
      description: req.body.description,
    });

  if (!success) {
    return zodErrorHandler(req, res, error);
  }

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
  const validationResult = zodProjectSchema
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
  const { error, success } = zodProjectSchema
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

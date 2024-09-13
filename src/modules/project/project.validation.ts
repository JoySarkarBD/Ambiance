import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating project data.
 */
const zodProjectSchema = z
  .object({
    title: z.string().min(1, 'Title is required').trim(),
    url: z.string().url('Invalid URL format').optional(),
    subject: z.string().min(1, 'Subject is required').trim(),
    skills: z
      .array(z.string(), { required_error: 'skills is required' })
      .min(1, 'skills must have at least one item'),
    description: z.string().min(1, 'Description is required').trim(),
    images: z.string().optional(),
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

  const { success, error } = zodProjectSchema.omit({ images: true }).safeParse(req.body);

  if (!success) {
    return zodErrorHandler(req, res, error);
  }

  return next();
};

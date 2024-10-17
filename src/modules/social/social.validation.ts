import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

// Define the social media platforms as an enum
const SocialMediaEnum = z.enum(
  [
    'Facebook',
    'Twitter',
    'Instagram',
    'LinkedIn',
    'YouTube',
    'TikTok',
    'Pinterest',
    'Google Business',
  ],
  {
    // Custom error message for invalid platform names
    errorMap: () => ({
      message:
        'Please select a valid social media platform: Facebook, Twitter, Instagram,LinkedIn, YouTube, TikTok and Pinterest.',
    }),
  }
);

/**
 * Zod schema for validating social data.
 */
const zodSocialSchema = z
  .object({
    name: SocialMediaEnum,
    url: z
      .string({ required_error: 'Please provide a URL.' })
      .url('Please provide a valid URL format.')
      .min(1, 'URL cannot be empty.')
      .trim(),
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

/**
 * Middleware function to validate social name using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateSocialName = (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  const { error, success } = zodSocialSchema.pick({ name: true }).safeParse({
    name: req.params.name,
  });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};

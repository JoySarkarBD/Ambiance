import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Base Zod schema for validating authentication-related data.
 */
const zodAuthSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .optional(),
    first_name: z.string().min(1, { message: 'First name is required' }).optional(),
    last_name: z.string().min(1, { message: 'Last name is required' }).optional(),
    status: z
      .enum(['active', 'inactive'], { message: 'Status must be either active or inactive' })
      .optional(),
    previous_password: z
      .string()
      .min(6, { message: 'Previous password must be at least 6 characters long' })
      .optional(),
    new_password: z
      .string()
      .min(6, { message: 'New password must be at least 6 characters long' })
      .optional(),
  })
  .strict();

/**
 * Creates a validator middleware for Zod schemas.
 * @param schema The Zod schema to validate against.
 * @returns Middleware for Express
 */
const createValidator = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return zodErrorHandler(req, res, result.error);
    }
    return next();
  };
};

// Specific schemas based on the general `zodAuthSchema`

/**
 * Login schema - requires email and password.
 */
const zodLoginSchema = zodAuthSchema.pick({
  email: true,
  password: true,
});

/**
 * Register schema - requires first name, last name, email and password.
 */
const zodRegisterSchema = zodAuthSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  password: true,
});

/**
 * Forget password schema - requires email.
 */
const zodForgetPasswordSchema = zodAuthSchema.pick({
  email: true,
});

/**
 * Reset password schema - requires token and new password.
 */
const zodResetPasswordSchema = zodAuthSchema.pick({
  previous_password: true,
  new_password: true,
});

/**
 * Status update schema - requires status.
 */
const zodStatusUpdateSchema = zodAuthSchema.pick({
  status: true,
});

// Export middleware validators
export const validateLogin = createValidator(zodLoginSchema);
export const validateRegister = createValidator(zodRegisterSchema);
export const validateForgetPassword = createValidator(zodForgetPasswordSchema);
export const validateResetPassword = createValidator(zodResetPasswordSchema);
export const validateStatusUpdate = createValidator(zodStatusUpdateSchema);


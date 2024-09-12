// Dependencies
import { NextFunction, Request, Response } from 'express';
import ServerResponse from '../../helpers/responses/custom-response';
import User from '../../modules/user/user.model';

// Extend express.Request to include user property
declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      role: string;
    };
  }
}

// Type definitions for user roles
type Role = 'admin' | 'user' | string;

/**
 * Middleware to check if a user is allowed to access a resource based on their role.
 *
 * @param {Role[]} roles - Array of roles that are allowed to access the resource (default is 'admin').
 * @returns Middleware function that checks the user's role and proceeds if allowed, or returns a 403 error if not.
 */
const isAllowed = (roles: Role[] = ['admin']) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if req.user is defined before destructuring
      if (!req.user) {
        return ServerResponse(res, false, 401, 'User not authenticated');
      }

      // Get user ID and role from the request object
      const { _id, role } = req.user;

      // Find the user by ID
      const user = await User.findById(_id);

      // Check if the user exists and their role is included in the allowed roles
      if (!user || !roles.includes(user.role)) {
        return ServerResponse(res, false, 403, 'You are not allowed to access this resource');
      }

      // If user is allowed, proceed to the next middleware or route handler
      return next();
    } catch (error) {
      // Pass any errors to the next middleware (error handler)
      return next(error);
    }
  };
};

export default isAllowed;

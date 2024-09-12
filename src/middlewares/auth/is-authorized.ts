import { NextFunction, Request, Response } from 'express';
import ServerResponse from '../../helpers/responses/custom-response';
import DecodeToken from '../../utils/jwt/decode-token';

// Extend the Request interface to include a user property
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to authenticate requests using Bearer tokens.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
const isAuthorized = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Retrieve the Authorization header from the request or token from cookies
    const authHeader: string | undefined = req.headers['authorization'] || req.cookies?.token;

    // Check if the Authorization header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ServerResponse(res, false, 401, 'Unauthorized');
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Decode the token
    const decoded = await DecodeToken(token);

    // If token decoding fails, respond with unauthorized
    if (!decoded) {
      return ServerResponse(res, false, 401, 'Unauthorized: Invalid Token');
    }

    // Ensure decoded token contains necessary fields
    if (
      typeof decoded === 'object' &&
      'email' in decoded &&
      'userId' in decoded &&
      'role' in decoded
    ) {
      // Attach user information to the request object
      req.user = {
        email: decoded.email as string,
        _id: decoded.userId as string,
        role: decoded.role as string,
      };
      // Proceed to the next middleware or route handler
      return next();
    } else {
      return ServerResponse(res, false, 401, 'Unauthorized: Invalid Token Payload');
    }
  } catch (error) {
    console.error('Authentication error:', error);

    // Handle any unexpected errors
    return ServerResponse(res, false, 401, 'Unauthorized');
  }
};

export default isAuthorized;

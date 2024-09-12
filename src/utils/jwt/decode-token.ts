import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config/config';

/**
 * Verifies a JWT token using a secret key.
 *
 * @param token - The JWT token to verify.
 * @returns {Promise<{ email: string; userId: string; role: string } | null>} - The decoded token payload if valid, null if verification fails.
 */
const DecodeToken = async (
  token: string
): Promise<{ email: string; userId: string; role: string } | null> => {
  try {
    const KEY: string = config.JWT_SECRET;
    const decoded = jwt.verify(token, KEY) as JwtPayload;

    // Ensure the token contains the expected properties
    if (
      decoded &&
      typeof decoded === 'object' &&
      'email' in decoded &&
      'user_id' in decoded &&
      'role' in decoded
    ) {
      return {
        email: decoded.email as string,
        userId: decoded.user_id as string,
        role: decoded.role as string,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export default DecodeToken;

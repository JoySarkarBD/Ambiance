import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config/config';

/**
 * Verifies a JWT token using a secret key.
 *
 * @param token - The JWT token to verify.
 * @returns {Promise<JwtPayload | null>} - The decoded token payload if valid, null if verification fails.
 */
const DecodeToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const KEY: string = config.JWT_SECRET;
    const decoded = jwt.verify(token, KEY) as JwtPayload;

    // Ensure the token contains the expected properties
    if (
      decoded &&
      typeof decoded === 'object' &&
      'email' in decoded &&
      'userId' in decoded &&
      'first_name' in decoded &&
      'last_name' in decoded &&
      'bio' in decoded &&
      'designation' in decoded &&
      'avatar' in decoded
    ) {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export default DecodeToken;

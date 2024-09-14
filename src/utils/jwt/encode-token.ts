import jwt from 'jsonwebtoken';
import config from '../../config/config';

/**
 * Generates a JWT token for a user based on their details.
 *
 * @param first_name - The user's first name.
 * @param last_name - The user's last name.
 * @param email - The user's email.
 * @param bio - The user's biography.
 * @param designation - The user's designation.
 * @param avatar - The user's avatar.
 * @param userId - The user's unique ID.
 * @param role - The user's role.
 * @returns {Promise<string>} - A promise that resolves to the signed JWT token.
 */
const EncodeToken = async (
  first_name: string,
  last_name: string,
  email: string,
  bio: string,
  designation: string,
  avatar: string,
  userId: string,
  role: string
): Promise<string> => {
  const KEY: string = config.JWT_SECRET;
  const EXPIRE: jwt.SignOptions = { expiresIn: config.JWT_EXPIRATION_TIME };

  // Payload to include in the token
  const PAYLOAD = {
    userId,
    first_name,
    last_name,
    email,
    bio,
    designation,
    avatar,
    role,
  };

  // Sign and return the JWT token
  return jwt.sign(PAYLOAD, KEY, EXPIRE);
};

export default EncodeToken;

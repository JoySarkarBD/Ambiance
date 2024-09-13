// Import the model
import { Response } from 'express';
import ms from 'ms';
import config from '../../config/config';
import EncodeToken from '../../utils/jwt/encode-token';
import UserModel from './user.model';

/**
 * Service function to update a single user by ID.
 *
 * @param id - The ID of the user to update.
 * @param data - The updated data for the user.
 * @returns {Promise<{ token: string, user: object }>} - The updated user and JWT token.
 */
const updateUser = async (res: Response, id: string, data: object) => {
  // Update the user and retrieve the updated document
  const user = await UserModel.findByIdAndUpdate(id, data, { new: true });

  if (!user) {
    throw new Error('User not found');
  }

  // Generate JWT token
  const token = await EncodeToken(user.email, user._id, user.role);

  // Set token in response header
  res.set('authorization', `Bearer ${token}`);

  // Convert JWT expiration time to milliseconds using ms()
  const maxAgeInMs = ms(config.JWT_EXPIRATION_TIME);

  // Set token in response cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: maxAgeInMs,
  });

  // Return user data and token
  return {
    token,
    user: {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  };
};

export const userServices = {
  updateUser,
};


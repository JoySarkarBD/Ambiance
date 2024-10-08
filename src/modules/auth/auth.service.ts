import { Request, Response } from 'express';
import ms from 'ms';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config/config';
import CompareInfo from '../../utils/bcrypt/compare-info';
import HashInfo from '../../utils/bcrypt/hash-info';
import SendEmail from '../../utils/email/send-email';
import EncodeToken from '../../utils/jwt/encode-token';
import User from '../user/user.model';

/**
 * Service function to handle user login.
 *
 * @param res - The response object used to set the token in response.
 * @param data - The login credentials including email and password.
 * @returns {Promise<object>} - An object containing the token and user data if login is successful.
 */
const login = async (res: Response, data: { email: string; password: string }) => {
  const { email, password } = data;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Check if the password matches
  const isPasswordValid = await CompareInfo(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  // Generate JWT token
  const token = await EncodeToken(
    user.first_name as string,
    user.last_name as string,
    user.email as string,
    user.bio as string,
    user.designation as string,
    user.avatar as string,
    user._id as string,
    user.role as string
  );

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
      bio: user.bio,
      designation: user.designation,
      avatar: user.avatar,
    },
  };
};

/**
 * Service function to register a new admin.
 *
 * @param data - The registration data including first name, last name, email, and password.
 * @returns {Promise<User>} - The created admin with activation status based on existing admins.
 */
const registerAdmin = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  const { first_name, last_name, email, password } = data;

  // Check if an admin already exists
  const existingAdmin = await User.findOne({ role: 'admin' });

  if (existingAdmin) {
    throw new Error('Admin already exists.');
  }

  // Hash the password and create the admin
  const hashedPassword = await HashInfo(password);
  const newAdmin = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    role: 'admin',
    status: 'active',
    showData: true,
  });

  const result = await newAdmin.save();

  if (!result) throw new Error('Failed to register admin');

  return newAdmin;
};

/**
 * Service function to handle forget password requests.
 *
 * @param email - The email address of the user requesting password reset.
 * @returns {Promise<string>} - A success message or token for password reset.
 */
const forgetPassword = async (email: string) => {
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User with this email does not exist');
  }

  // Generate a password reset token
  const resetToken = uuidv4();
  const resetLink = `${config.NEXT_APP_URL}/reset-password?token=${resetToken}`;

  // Save the reset token to the user
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour
  await user.save();

  // Send password reset email
  const emailSent = await SendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `Please click the following link to reset your password: ${resetLink}. This link will be valid for 1 hour.`,
    html: `<p>Please click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p><p>This link will be valid for 1 hour.</p>`,
  });

  if (!emailSent) {
    throw new Error('Failed to send password reset email');
  }

  return 'Password reset email sent successfully and the reset password token will expire in one hour';
};

/**
 * Service function to handle password reset.
 *
 * @param resetPasswordToken - The password reset token.
 * @param new_password - The new password to set.
 * @returns {Promise<User>} - The updated user with the new password.
 */
const resetPassword = async (resetPasswordToken: string, new_password: string) => {
  // Find the user by reset token and check if the token is still valid
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordTokenExpires: { $gt: new Date() }, // Check if token has not expired
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Hash the new password
  const hashedNewPassword = await HashInfo(new_password);

  // Update the user's password and clear the reset token
  user.password = hashedNewPassword;
  user.resetPasswordToken = '';
  user.resetPasswordTokenExpires = undefined;
  const result = await user.save();

  if (!result) throw new Error('Failed to reset password');
};

/**
 * Service function to handle password update.
 *
 * @param req - The request object containing user details.
 * @param previous_password - The current password of the user.
 * @param new_password - The new password to set.
 * @returns {Promise<User>} - The updated user with the new password.
 */
const updatePassword = async (req: Request, previous_password: string, new_password: string) => {
  // Find the user by ID from the request object
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new Error('User not found');
  }

  // Check if the previous password matches the current password
  const isMatch = await CompareInfo(previous_password, user.password);
  if (!isMatch) {
    throw new Error('Previous password does not match');
  }

  // Hash the new password
  const hashedNewPassword = await HashInfo(new_password);

  // Update the user's password
  user.password = hashedNewPassword;
  const result = await user.save();

  if (!result) throw new Error('Failed to update password');

  return user;
};

export const authServices = {
  login,
  registerAdmin,
  forgetPassword,
  resetPassword,
  updatePassword,
};

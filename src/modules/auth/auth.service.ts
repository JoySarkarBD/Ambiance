import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import ms from 'ms';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config/config';
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
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  // Generate JWT token
  const token = await EncodeToken(email, user._id, user.role);

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

  // Check if an admin already exists or if the email is taken
  const existingAdmin = (await User.findOne({ role: 'admin' })) || (await User.findOne({ email }));
  if (existingAdmin) {
    if (existingAdmin.email === email) throw new Error('Admin with this email already exists.');
    // If an admin exists but with a different email, assume it can be an existing admin or another role
  }

  // Hash the password and create the admin
  const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
  const newAdmin = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    role: 'admin',
    status: 'active',
  });

  await newAdmin.save();

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
  const resetLink = `${config.BASE_URL}:${config.PORT}/api/v1/auth/reset-password?token=${resetToken}`;

  // Save the reset token to the user
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour
  await user.save();

  // Send password reset email
  const emailSent = await SendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `Please click the following link to reset your password: ${resetLink}`,
    html: `<p>Please click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
  });

  if (!emailSent) {
    throw new Error('Failed to send password reset email');
  }

  return 'Password reset email sent successfully and the reset password token will expire in one hour';
};

/**
 * Service function to handle password reset.
 *
 * @param token - The password reset token.
 * @param new_password - The new password to set.
 * @returns {Promise<User>} - The updated user with the new password.
 */
const resetPassword = async (token: string, new_password: string) => {
  // Find the user by reset token and check if the token is still valid
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpires: { $gt: new Date() }, // Check if token has not expired
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(new_password, config.SALT_ROUNDS);

  // Update the user's password and clear the reset token
  user.password = hashedNewPassword;
  user.resetPasswordToken = '';
  user.resetPasswordTokenExpires = undefined;
  await user.save();
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
  const isMatch = await bcrypt.compare(previous_password, user.password);
  if (!isMatch) {
    throw new Error('Previous password does not match');
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(new_password, config.SALT_ROUNDS);

  // Update the user's password
  user.password = hashedNewPassword;
  await user.save();

  return user;
};

export const authServices = {
  login,
  registerAdmin,
  forgetPassword,
  resetPassword,
  updatePassword,
};

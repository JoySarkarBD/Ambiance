import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
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

  // Set token in response cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: config.JWT_EXPIRATION_TIME,
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
 * Service function to register a new user.
 *
 * @param data - The registration data including first name, last name, email, and password.
 * @returns {Promise<User>} - The created user with an activation token sent via email.
 */
const registerUser = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  const { first_name, last_name, email, password } = data;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);

  // Create a new user
  const newUser = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    role: 'user',
    status: 'inactive', // User is inactive initially
  });

  // Save the user to the database
  await newUser.save();

  const activationToken = uuidv4(); // Generate a unique token
  const activationLink = `${config.BASE_URL}/api/v1/auth/activate-status?token=${activationToken}`;

  // Save the activation token to the user
  newUser.activationToken = activationToken;
  await newUser.save();

  // Send activation email
  const emailSent = await SendEmail({
    to: newUser.email,
    subject: 'Activate Your Status',
    text: `Please click the following link to activate your status: ${activationLink}`,
    html: `<p>Please click the following link to activate your status: <a href="${activationLink}">Activate Status</a></p>`,
  });

  if (!emailSent) {
    throw new Error('Failed to send activation email');
  }

  return newUser;
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
    status: existingAdmin ? 'inactive' : 'active',
  });

  await newAdmin.save();

  if (newAdmin.status !== 'active') {
    const activationToken = uuidv4();
    const activationLink = `${config.BASE_URL}:${config.PORT}/api/v1/auth/activate-status?token=${activationToken}`;

    // Save the activation token to the user
    newAdmin.activationToken = activationToken;
    await newAdmin.save();

    // Send activation email
    const emailSent = await SendEmail({
      to: newAdmin.email,
      subject: 'Activate Your Status',
      text: `Please click the following link to activate your status: ${activationLink}`,
      html: `<p>Please click the following link to activate your status: <a href="${activationLink}">Activate Status</a></p>`,
    });

    if (!emailSent) {
      throw new Error('Failed to send activation email');
    }
  }

  return newAdmin;
};

/**
 * Service function to activate user status using an activation token.
 *
 * @param token - The activation token used to activate the user status.
 * @returns {Promise<{ success: boolean }>} - An object indicating whether activation was successful.
 */
const activateUserStatus = async (token: string): Promise<{ success: boolean }> => {
  // Find the user by activation token
  const user = await User.findOne({ activationToken: token });
  if (!user) {
    return { success: false };
  }

  // Activate the user's status
  user.status = 'active';
  user.activationToken = undefined;
  await user.save();

  // Return success
  return { success: true };
};

// /**
//  * Service function to handle forget password requests.
//  *
//  * @param email - The email address of the user requesting password reset.
//  * @returns {Promise<string>} - A success message or token for password reset.
//  */
// const forgetPassword = async (email: string) => {
//   // Apply the logic here
// };

/**
 * Service function to handle password reset.
 *
 * @param req - The request object containing user details and token.
 * @param previous_password - The current password of the user.
 * @param new_password - The new password to set.
 * @returns {Promise<User>} - The updated user with the new password.
 */
const resetPassword = async (req: Request, previous_password: string, new_password: string) => {
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

/**
 * Service function to update user status.
 *
 * @param id - The ID of the user whose status is to be updated.
 * @returns {Promise<User>} - The updated user with the new status.
 */
const updateStatus = async (id: string) => {
  // Find the user whose status needs to be updated
  const userToUpdate = await User.findById(id);
  if (!userToUpdate) {
    throw new Error('User not found');
  }

  // Toggle the user's status
  userToUpdate.status = userToUpdate.status === 'active' ? 'inactive' : 'active';

  // Save the updated user
  await userToUpdate.save();

  return userToUpdate;
};

export const authServices = {
  login,
  registerUser,
  registerAdmin,
  activateUserStatus,
  // forgetPassword,
  resetPassword,
  updateStatus,
};


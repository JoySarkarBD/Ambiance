import { Request, Response } from 'express';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { authServices } from './auth.service';

/**
 * Controller function to handle user login.
 *
 * @param {Request} req - The request object containing login credentials.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const loginAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.login(res, req.body);
  ServerResponse(res, true, 200, 'Login successful', result);
});

/**
 * Controller function to handle admin registration.
 *
 * @param {Request} req - The request object containing admin registration data.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const registerAdmin = catchAsync(async (req: Request, res: Response) => {
  const newAdmin = await authServices.registerAdmin(req.body);
  const message =
    newAdmin.status === 'active'
      ? 'Admin registered successfully'
      : 'Admin registered successfully and an email has been sent to your mail to activate your account';
  ServerResponse(res, true, 201, message, newAdmin);
});

/**
 * Controller function to handle forget password requests.
 *
 * @param {Request} req - The request object containing the email address.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const forgetPasswordAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.forgetPassword(req.body.email);
  ServerResponse(res, true, 200, result);
});

/**
 * Controller function to handle resetting password using the reset token.
 *
 * @param {Request} req - The request object containing the reset token and new password.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const resetPasswordAuth = catchAsync(async (req: Request, res: Response) => {
  const { token, new_password } = req.body;

  if (!token || !new_password) {
    return ServerResponse(res, false, 400, 'Token and new password are required');
  }

  // Call the service to reset the user's password using the token
  await authServices.resetPassword(token, new_password);

  ServerResponse(res, true, 200, 'Password reset successfully');
});

/**
 * Controller function to handle password update requests.
 *
 * @param {Request} req - The request object containing previous and new passwords.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const { previous_password, new_password } = req.body;

  // Call the service to update the user old password
  await authServices.updatePassword(req, previous_password, new_password);
  ServerResponse(res, true, 200, 'Password update successfully');
});

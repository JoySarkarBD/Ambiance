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
  const result = await authServices.login(req.body);
  ServerResponse(res, true, 200, 'Login successful', result);
});

/**
 * Controller function to handle user registration.
 *
 * @param {Request} req - The request object containing user registration data.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req.body);
  ServerResponse(res, true, 201, 'User registered successfully', result);
});

/**
 * Controller function to handle admin registration.
 *
 * @param {Request} req - The request object containing admin registration data.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const registerAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerAdmin(req.body);
  ServerResponse(res, true, 201, 'Admin registered successfully', result);
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
  ServerResponse(res, true, 200, 'Password reset link sent successfully', result);
});

/**
 * Controller function to handle password reset.
 *
 * @param {Request} req - The request object containing the previous password and new password.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const resetPasswordAuth = catchAsync(async (req: Request, res: Response) => {
  const { previous_password, new_password } = req.body;
  const result = await authServices.resetPassword(previous_password, new_password);
  ServerResponse(res, true, 200, 'Password reset successfully', result);
});

/**
 * Controller function to handle status update of a user.
 *
 * @param {Request} req - The request object containing the status update data.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateStatusAuth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await authServices.updateStatus(id, status);
  ServerResponse(res, true, 200, 'Status updated successfully', result);
});


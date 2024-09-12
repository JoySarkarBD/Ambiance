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
 * Controller function to handle user registration.
 *
 * @param {Request} req - The request object containing user registration data.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req.body);
  ServerResponse(
    res,
    true,
    201,
    'User registered successfully and an email has sent to your mail to active your account',
    result
  );
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
 * Controller function to handle user status activation.
 *
 * @param {Request} req - The request object containing the activation token in params.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const activateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const token = req.query.token as string;

  // Call the service to activate the user status
  const result = await authServices.activateUserStatus(token);

  if (result.success) {
    ServerResponse(res, true, 200, 'User status activated successfully');
  } else {
    ServerResponse(res, false, 400, 'Status activation failed, try again');
  }
});

// /**
//  * Controller function to handle forget password requests.
//  *
//  * @param {Request} req - The request object containing the email address.
//  * @param {Response} res - The response object used to send the response.
//  * @returns {void}
//  */
// export const forgetPasswordAuth = catchAsync(async (req: Request, res: Response) => {
//   const result = await authServices.forgetPassword(req.body.email);
//   ServerResponse(res, true, 200, 'Password reset link sent successfully', result);
// });

/**
 * Controller function to handle password reset requests.
 *
 * @param {Request} req - The request object containing previous and new passwords.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const resetPasswordAuth = catchAsync(async (req: Request, res: Response) => {
  const { previous_password, new_password } = req.body;

  // Call the service to reset the user old password
  await authServices.resetPassword(req, previous_password, new_password);
  ServerResponse(res, true, 200, 'Password reset successfully');
});

/**
 * Controller function to handle user status updates.
 *
 * @param {Request} req - The request object containing the user ID in params.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateStatusAuth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Call the service to update the user status
  await authServices.updateStatus(id);
  ServerResponse(res, true, 200, 'Status updated successfully');
});


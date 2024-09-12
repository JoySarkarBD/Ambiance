import { Router } from 'express';

// Import controllers from corresponding module
import {
  forgetPasswordAuth,
  loginAuth,
  registerAdmin,
  registerUser,
  resetPasswordAuth,
  updateStatusAuth,
} from './auth.controller';

// Import validators from corresponding module
import {
  validateForgetPassword,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateStatusUpdate,
} from './auth.validation';

// Import ID validation
import { validateId } from '../../handlers/common-zod-validator';

// Initialize router
const router = Router();

/**
 * @route POST /api/v1/auth/login
 * @description User login
 * @access Public
 * @param {function} controller - ['loginAuth']
 * @param {function} validation - ['validateLogin']
 */
router.post('/login', validateLogin, loginAuth);

/**
 * @route POST /api/v1/auth/register-user
 * @description User registration
 * @access Public
 * @param {function} controller - ['registerUser']
 * @param {function} validation - ['validateRegister']
 */
router.post('/register-user', validateRegister, registerUser);

/**
 * @route POST /api/v1/auth/register-admin
 * @description Admin registration
 * @access Public
 * @param {function} controller - ['registerAdmin']
 * @param {function} validation - ['validateRegister']
 */
router.post('/register-admin', validateRegister, registerAdmin);

/**
 * @route POST /api/v1/auth/forget-password
 * @description Handle forget password requests
 * @access Public
 * @param {function} controller - ['forgetPasswordAuth']
 * @param {function} validation - ['validateForgetPassword']
 */
router.post('/forget-password', validateForgetPassword, forgetPasswordAuth);

/**
 * @route POST /api/v1/auth/reset-password
 * @description Handle reset password
 * @access Public
 * @param {function} controller - ['resetPasswordAuth']
 * @param {function} validation - ['validateResetPassword']
 */
router.post('/reset-password', validateResetPassword, resetPasswordAuth);

/**
 * @route PUT /api/v1/auth/update-status/:id
 * @description Update user status
 * @access Public
 * @param {string} id - The ID of the user whose status is being updated
 * @param {function} controller - ['updateStatusAuth']
 * @param {function} validation - ['validateStatusUpdate']
 */
router.put('/update-status/:id', validateId, validateStatusUpdate, updateStatusAuth);

// Export the router
module.exports = router;


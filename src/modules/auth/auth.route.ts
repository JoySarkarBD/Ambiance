import { Router } from 'express';

// Import controllers from corresponding module
import {
  forgetPasswordAuth,
  // forgetPasswordAuth,
  loginAuth,
  registerAdmin,
  resetPasswordAuth,
  updatePassword,
} from './auth.controller';

// Import validators from corresponding module
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import {
  validateEmail,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateUpdatePassword,
} from './auth.validation';

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
 * @param {function} validation - ['validateEmail']
 */
router.post('/forget-password', validateEmail, forgetPasswordAuth);

/**
 * @route POST /api/v1/auth/reset-password
 * @description Handle reset password
 * @access Public
 * @param {function} controller - ['resetPasswordAuth']
 * @param {function} validation - ['validateResetPassword']
 */
router.post('/reset-password', validateResetPassword, resetPasswordAuth);

/**
 * @route POST /api/v1/auth/update-password
 * @description Handle update the previous password
 * @access Admin
 * @param {function} controller - ['updatePassword']
 * @param {function} validation - ['validateUpdatePassword']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post(
  '/update-password',
  isAuthorized,
  isAllowed(['admin']),
  validateUpdatePassword,
  updatePassword
);

// Export the router
module.exports = router;

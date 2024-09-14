// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { aboutUser, updateUser } from './user.controller';

//Import validation from corresponding module
import { validateId } from '../../handlers/common-zod-validator';
import isAuthorized from '../../middlewares/auth/is-authorized';
import { validateUser } from './user.validation';

// Initialize router
const router = Router();

/**
 * @route Get /api/v1/user/about-user
 * @description About user information
 * @access Public
 * @param {function} controller - ['aboutUser']
 */
router.get('/about-user', aboutUser);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

// Define route handlers

/**
 * @route PUT /api/v1/user/update-user/:id
 * @description Update user information
 * @param {string} id - The ID of the user to update
 * @access Authorized
 * @param {function} controller - ['updateUser']
 * @param {function} validation - ['validateId', 'validateUser']
 */
router.put('/update-user/:id', validateId, validateUser, updateUser);

// Export the router
module.exports = router;

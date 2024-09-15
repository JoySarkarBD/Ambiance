// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { aboutUser, updateShowData, updateUser } from './user.controller';

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
 * @route PUT /api/v1/user/update-user
 * @description Update user information
 * @access Authorized
 * @param {function} controller - ['updateUser']
 * @param {function} validation - [ 'validateUser']
 */
router.put('/update-user', validateUser, updateUser);

/**
 * @route PUT /api/v1/user/update-user-show-data/:id
 * @description Update user show data
 * @access Authorized
 * @param {function} controller - ['updateShowData']
 * @param {function} validation - ['validateId']
 */
router.put('/update-user-show-data/:id', validateId, updateShowData);

// Export the router
module.exports = router;

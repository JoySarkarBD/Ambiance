// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createManyUser,
  createUser,
  deleteManyUser,
  deleteUser,
  getManyUser,
  getUserById,
  updateManyUser,
  updateUser,
} from './user.controller';

//Import validation from corresponding module
import { validateId, validateIds } from '../../handlers/common-zod-validator';
import { validateUser } from './user.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/user/create-user
 * @description Create a new user
 * @access Admin
 * @param {function} controller - ['createUser']
 * @param {function} validation - ['validateUser']
 */
router.post('/create-user', validateUser, createUser);

/**
 * @route POST /api/v1/user/create-user/many
 * @description Create multiple user
 * @access Admin
 * @param {function} controller - ['createManyUser']
 */
router.post('/create-user/many', createManyUser);

/**
 * @route PUT /api/v1/user/update-user/many
 * @description Update multiple user information
 * @access Admin
 * @param {function} controller - ['updateManyUser']
 * @param {function} validation - ['validateIds']
 */
router.put('/update-user/many', validateIds, updateManyUser);

/**
 * @route PUT /api/v1/user/update-user/:id
 * @description Update user information by user or admin
 * @param {string} id - The ID of the user to update
 * @access ["Admin", "User"]
 * @param {function} controller - ['updateUser']
 * @param {function} validation - ['validateId', 'validateUser']
 */
router.put('/update-user/:id', validateId, validateUser, updateUser);

/**
 * @route DELETE /api/v1/user/delete-user/many
 * @description Delete multiple user
 * @access Admin
 * @param {function} controller - ['deleteManyUser']
 * @param {function} validation - ['validateIds']
 */
router.delete('/delete-user/many', validateIds, deleteManyUser);

/**
 * @route DELETE /api/v1/user/delete-user/:id
 * @description Delete a user by user or admin
 * @param {string} id - The ID of the user to delete
 * @access ["Admin", "User"]
 * @param {function} controller - ['deleteUser']
 * @param {function} validation - ['validateId']
 */
router.delete('/delete-user/:id', validateId, deleteUser);

/**
 * @route GET /api/v1/user/get-user/many
 * @description Get multiple user
 * @access ["Admin"]
 * @param {function} controller - ['getManyUser']
 * @param {function} validation - ['validateIds']
 */
router.get('/get-user/many', validateIds, getManyUser);

/**
 * @route GET /api/v1/user/get-user/:id
 * @description Get a user by ID
 * @param {string} id - The ID of the user to retrieve
 * @access ["Admin", "User"]
 * @param {function} controller - ['getUserById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-user/:id', validateId, getUserById);

// Export the router

module.exports = router;

// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createManyMenu,
  createMenu,
  deleteManyMenu,
  deleteMenu,
  getManyMenu,
  getMenuById,
  updateManyMenu,
  updateMenu,
} from './menu.controller';

//Import validation from corresponding module
import { validateId, validateIds } from '../../handlers/common-zod-validator';
import { validateMenu } from './menu.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/menu/create-menu
 * @description Create a new menu
 * @access Admin
 * @param {function} controller - ['createMenu']
 * @param {function} validation - ['validateMenu']
 */
router.post('/create-menu', validateMenu, createMenu);

/**
 * @route POST /api/v1/menu/create-menu/many
 * @description Create multiple menu
 * @access Admin
 * @param {function} controller - ['createManyMenu']
 */
router.post('/create-menu/many', createManyMenu);

/**
 * @route PUT /api/v1/menu/update-menu/many
 * @description Update multiple menu information
 * @access Admin
 * @param {function} controller - ['updateManyMenu']
 * @param {function} validation - ['validateIds']
 */
router.put('/update-menu/many', validateIds, updateManyMenu);

/**
 * @route PUT /api/v1/menu/update-menu/:id
 * @description Update menu information
 * @param {string} id - The ID of the menu to update
 * @access Admin
 * @param {function} controller - ['updateMenu']
 * @param {function} validation - ['validateId', 'validateMenu']
 */
router.put('/update-menu/:id', validateId, validateMenu, updateMenu);

/**
 * @route DELETE /api/v1/menu/delete-menu/many
 * @description Delete multiple menu
 * @access Admin
 * @param {function} controller - ['deleteManyMenu']
 * @param {function} validation - ['validateIds']
 */
router.delete('/delete-menu/many', validateIds, deleteManyMenu);

/**
 * @route DELETE /api/v1/menu/delete-menu/:id
 * @description Delete a menu
 * @param {string} id - The ID of the menu to delete
 * @access Admin
 * @param {function} controller - ['deleteMenu']
 * @param {function} validation - ['validateId']
 */
router.delete('/delete-menu/:id', validateId, deleteMenu);

/**
 * @route GET /api/v1/menu/get-menu/many
 * @description Get multiple menu
 * @access Admin
 * @param {function} controller - ['getManyMenu']
 * @param {function} validation - ['validateIds']
 */
router.get('/get-menu/many', validateIds, getManyMenu);

/**
 * @route GET /api/v1/menu/get-menu/:id
 * @description Get a menu by ID
 * @param {string} id - The ID of the menu to retrieve
 * @access Admin
 * @param {function} controller - ['getMenuById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-menu/:id', validateId, getMenuById);

// Export the router

module.exports = router;

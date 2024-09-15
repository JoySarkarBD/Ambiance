// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { createMenu, deleteMenu, getAllMenu, getMenuById, updateMenu } from './menu.controller';

//Import validation from corresponding module
import { validateId } from '../../handlers/common-zod-validator';
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import { validateMenu } from './menu.validation';

// Initialize router
const router = Router();

// Define route handlers

/**
 * @route GET /api/v1/menu/get-all-menu
 * @description Get multiple menu
 * @access Public
 * @param {function} controller - ['getAllMenu']
 */
router.get('/get-all-menu', getAllMenu);

/**
 * @route GET /api/v1/menu/get-menu/:id
 * @description Get a menu by ID
 * @param {string} id - The ID of the menu to retrieve
 * @access Public
 * @param {function} controller - ['getMenuById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-menu/:id', validateId, getMenuById);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

/**
 * @route POST /api/v1/menu/create-menu
 * @description Create a new menu
 * @access Admin
 * @param {function} controller - ['createMenu']
 * @param {function} validation - ['validateMenu']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post('/create-menu', isAllowed(['admin']), validateMenu, createMenu);

/**
 * @route PUT /api/v1/menu/update-menu/:id
 * @description Update menu information
 * @param {string} id - The ID of the menu to update
 * @access Admin
 * @param {function} controller - ['updateMenu']
 * @param {function} validation - ['validateId', 'validateMenu']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.put('/update-menu/:id', isAllowed(['admin']), validateId, validateMenu, updateMenu);

/**
 * @route DELETE /api/v1/menu/delete-menu/:id
 * @description Delete a menu
 * @param {string} id - The ID of the menu to delete
 * @access Admin
 * @param {function} controller - ['deleteMenu']
 * @param {function} validation - ['validateId']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-menu/:id', isAllowed(['admin']), validateId, deleteMenu);

// Export the router

module.exports = router;

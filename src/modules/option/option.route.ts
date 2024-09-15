// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createOption,
  deleteOption,
  getAllOption,
  getOptionByName,
  updateOption,
} from './option.controller';

//Import validation from corresponding module
import { validateId } from '../../handlers/common-zod-validator';
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import { validateOption, validateOptionName } from './option.validation';

// Initialize router
const router = Router();

// Define route handlers

/**
 * @route GET /api/v1/option/get-all-option
 * @description Get multiple option
 * @access Public
 * @param {function} controller - ['getAllOption']
 */
router.get('/get-all-option', getAllOption);

/**
 * @route GET /api/v1/option/get-option/:name
 * @description Get a option by name
 * @param {string} id - The name of the option to retrieve
 * @access Public
 * @param {function} controller - ['getOptionById']
 * @param {function} validation - ['validateOptionName']
 */
router.get('/get-option/:name', validateOptionName, getOptionByName);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

/**
 * @route POST /api/v1/option/create-option
 * @description Create a new option
 * @access Admin
 * @param {function} controller - ['createOption']
 * @param {function} validation - ['validateOption']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post('/create-option', isAllowed(['admin']), validateOption, createOption);

/**
 * @route PUT /api/v1/option/update-option/:id
 * @description Update option information
 * @param {string} id - The ID of the option to update
 * @access Admin
 * @param {function} controller - ['updateOption']
 * @param {function} validation - ['validateId', 'validateOption']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.put('/update-option/:id', isAllowed(['admin']), validateId, validateOption, updateOption);

/**
 * @route DELETE /api/v1/option/delete-option/:id
 * @description Delete a option
 * @param {string} id - The ID of the option to delete
 * @access Admin
 * @param {function} controller - ['deleteOption']
 * @param {function} validation - ['validateId']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-option/:id', isAllowed(['admin']), validateId, deleteOption);

// Export the router
module.exports = router;

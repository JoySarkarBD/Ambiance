// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createSocial,
  deleteManySocial,
  deleteSocial,
  getAllSocial,
  getSocialById,
  getSocialByName,
  updateSocial,
} from './social.controller';

//Import validation from corresponding module
import { validateId, validateIds } from '../../handlers/common-zod-validator';
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import { validateSocial, validateSocialName } from './social.validation';

// Initialize router
const router = Router();

/**
 * @route GET /api/v1/social/get-all-social/many
 * @description Get all social
 * @access Public
 * @param {function} controller - ['getAllSocial']
 */
router.get('/get-all-social', getAllSocial);

/**
 * @route GET /api/v1/social/get-social/:id
 * @description Get a social by ID
 * @param {string} id - The ID of the social to retrieve
 * @access Public
 * @param {function} controller - ['getSocialById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-social/:id', validateId, getSocialById);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

// Define route handlers
/**
 * @route POST /api/v1/social/create-social
 * @description Create a new social
 * @access Admin
 * @param {function} controller - ['createSocial']
 * @param {function} validation - ['validateSocial']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post('/create-social', isAllowed(['admin']), validateSocial, createSocial);

/**
 * @route PUT /api/v1/social/update-social/:id
 * @description Update social information
 * @param {string} id - The ID of the social to update
 * @access Admin
 * @param {function} controller - ['updateSocial']
 * @param {function} validation - ['validateId', 'validateSocial']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.put('/update-social/:id', isAllowed(['admin']), validateId, validateSocial, updateSocial);

/**
 * @route DELETE /api/v1/social/delete-social/many
 * @description Delete multiple social
 * @access Admin
 * @param {function} controller - ['deleteManySocial']
 * @param {function} validation - ['validateIds']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-social/many', isAllowed(['admin']), validateIds, deleteManySocial);

/**
 * @route DELETE /api/v1/social/delete-social/:id
 * @description Delete a social
 * @param {string} id - The ID of the social to delete
 * @access Admin
 * @param {function} controller - ['deleteSocial']
 * @param {function} validation - ['validateId']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-social/:id', isAllowed(['admin']), validateId, deleteSocial);

/**
 * @route GET /api/v1/social/get-social-details/:name
 * @description Get a social by name
 * @param {string} name - The name of the social to retrieve
 * @access Admin
 * @param {function} controller - ['getSocialByName']
 * @param {function} validation - ['validateSocialName']
 */
router.get('/get-social-details/:name', validateSocialName, getSocialByName);

// Export the router
module.exports = router;

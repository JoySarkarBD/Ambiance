// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createService,
  deleteManyService,
  deleteService,
  getAllService,
  getServiceById,
  updateService,
} from './service.controller';

//Import validation from corresponding module
import { validateId, validateIds } from '../../handlers/common-zod-validator';
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import {
  validateImageRemovePath,
  validateSearchQuery,
  validateService,
} from './service.validation';

// Initialize router
const router = Router();

/**
 * @route GET /api/v1/service/get-all-service
 * @description Get multiple service
 * @access Public
 * @param {function} controller - ['getAllService']
 */
router.get('/get-all-service', getAllService);

/**
 * @route GET /api/v1/service/get-service/:id
 * @description Get a service by ID
 * @param {string} id - The ID of the service to retrieve
 * @access Public
 * @param {function} controller - ['getServiceById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-service/:id', validateId, getServiceById);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

// Define route handlers
/**
 * @route POST /api/v1/service/create-service
 * @description Create a new service
 * @access Admin
 * @param {function} controller - ['createService']
 * @param {function} validation - ['validateService']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post('/create-service', isAllowed(['admin']), validateService, createService);

/**
 * @route PUT /api/v1/service/update-service/:id
 * @description Update service information
 * @param {string} id - The ID of the service to update
 * @access Admin
 * @param {function} controller - ['updateService']
 * @param {function} validation - ['validateId', 'validateService', 'validateImageRemovePath']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.put(
  '/update-service/:id',
  isAllowed(['admin']),
  validateId,
  validateService,
  validateImageRemovePath,
  updateService
);

/**
 * @route DELETE /api/v1/service/delete-service/many
 * @description Delete multiple service
 * @access Public
 * @param {function} controller - ['deleteManyService']
 * @param {function} validation - ['validateIds']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-service/many', isAllowed(['admin']), validateIds, deleteManyService);

/**
 * @route DELETE /api/v1/service/delete-service/:id
 * @description Delete a service
 * @param {string} id - The ID of the service to delete
 * @access Admin
 * @param {function} controller - ['deleteService']
 * @param {function} validation - ['validateId']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-service/:id', isAllowed(['admin']), validateId, deleteService);

/**
 * @route GET /api/v1/service/get-service/many
 * @description Get multiple service
 * @access Admin
 * @param {function} controller - ['getAllService']
 * @param {function} validation - ['validateSearchQuery']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.get('/get-service/many', isAllowed(['admin']), validateSearchQuery, getAllService);

// Export the router
module.exports = router;


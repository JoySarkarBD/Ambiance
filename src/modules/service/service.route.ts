// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createManyService,
  createService,
  deleteManyService,
  deleteService,
  getManyService,
  getServiceById,
  updateManyService,
  updateService,
} from './service.controller';

//Import validation from corresponding module
import { validateId, validateIds } from '../../handlers/common-zod-validator';
import { validateService } from './service.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/service/create-service
 * @description Create a new service
 * @access Admin
 * @param {function} controller - ['createService']
 * @param {function} validation - ['validateService']
 */
router.post('/create-service', validateService, createService);

/**
 * @route POST /api/v1/service/create-service/many
 * @description Create multiple service
 * @access Admin
 * @param {function} controller - ['createManyService']
 */
router.post('/create-service/many', createManyService);

/**
 * @route PUT /api/v1/service/update-service/many
 * @description Update multiple service information
 * @access Admin
 * @param {function} controller - ['updateManyService']
 * @param {function} validation - ['validateIds']
 */
router.put('/update-service/many', validateIds, updateManyService);

/**
 * @route PUT /api/v1/service/update-service/:id
 * @description Update service information
 * @param {string} id - The ID of the service to update
 * @access Admin
 * @param {function} controller - ['updateService']
 * @param {function} validation - ['validateId', 'validateService']
 */
router.put('/update-service/:id', validateId, validateService, updateService);

/**
 * @route DELETE /api/v1/service/delete-service/many
 * @description Delete multiple service
 * @access Public
 * @param {function} controller - ['deleteManyService']
 * @param {function} validation - ['validateIds']
 */
router.delete('/delete-service/many', validateIds, deleteManyService);

/**
 * @route DELETE /api/v1/service/delete-service/:id
 * @description Delete a service
 * @param {string} id - The ID of the service to delete
 * @access Admin
 * @param {function} controller - ['deleteService']
 * @param {function} validation - ['validateId']
 */
router.delete('/delete-service/:id', validateId, deleteService);

/**
 * @route GET /api/v1/service/get-service/many
 * @description Get multiple service
 * @access Admin
 * @param {function} controller - ['getManyService']
 * @param {function} validation - ['validateIds']
 */
router.get('/get-service/many', validateIds, getManyService);

/**
 * @route GET /api/v1/service/get-service/:id
 * @description Get a service by ID
 * @param {string} id - The ID of the service to retrieve
 * @access Admin
 * @param {function} controller - ['getServiceById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-service/:id', validateId, getServiceById);

// Export the router

module.exports = router;


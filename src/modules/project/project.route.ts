// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createProject,
  deleteManyProject,
  deleteProject,
  getProject,
  getProjectById,
  updateProject,
} from './project.controller';

//Import validation from corresponding module
import { validateId, validateIds } from '../../handlers/common-zod-validator';
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import {
  validateImageRemovePath,
  validateProject,
  validateSearchQuery,
} from './project.validation';

// Initialize router
const router = Router();

// Define route handlers

/**
 * @route GET /api/v1/project/get-all-project
 * @description Get multiple post
 * @access Public
 * @param {function} controller - ['getProject']
 */
router.get('/get-all-project', getProject);

/**
 * @route GET /api/v1/project/get-project/many
 * @description Get multiple project
 * @access Admin
 * @param {function} controller - ['getProject']
 * @param {function} validation - ['validateSearchQuery']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.get(
  '/get-project/many',
  isAuthorized,
  isAllowed(['admin']),
  validateSearchQuery,
  getProject
);

/**
 * @route GET /api/v1/project/get-project/:id
 * @description Get a project by ID
 * @param {string} id - The ID of the project to retrieve
 * @access Public
 * @param {function} controller - ['getProjectById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-project/:id', validateId, getProjectById);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

/**
 * @route POST /api/v1/project/create-project
 * @description Create a new project
 * @access Admin
 * @param {function} controller - ['createProject']
 * @param {function} validation - ['validateProject']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post('/create-project', isAllowed(['admin']), validateProject, createProject);

/**
 * @route PUT /api/v1/project/update-project/:id
 * @description Update project information
 * @param {string} id - The ID of the project to update
 * @access Admin
 * @param {function} controller - ['updateProject']
 * @param {function} validation - ['validateId', 'validateProject', 'validateImageRemovePath']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.put(
  '/update-project/:id',
  isAllowed(['admin']),
  validateId,
  validateProject,
  validateImageRemovePath,
  updateProject
);

/**
 * @route DELETE /api/v1/project/delete-project/many
 * @description Delete multiple project
 * @access Admin
 * @param {function} controller - ['deleteManyProject']
 * @param {function} validation - ['validateIds']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-project/many', isAllowed(['admin']), validateIds, deleteManyProject);

/**
 * @route DELETE /api/v1/project/delete-project/:id
 * @description Delete a project
 * @param {string} id - The ID of the project to delete
 * @access Admin
 * @param {function} controller - ['deleteProject']
 * @param {function} validation - ['validateId']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-project/:id', isAllowed(['admin']), validateId, deleteProject);

// Export the router
module.exports = router;

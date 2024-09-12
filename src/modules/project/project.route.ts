// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createManyProject,
  createProject,
  deleteManyProject,
  deleteProject,
  getManyProject,
  getProjectById,
  updateManyProject,
  updateProject,
} from './project.controller';

//Import validation from corresponding module
import { validateId, validateIds } from '../../handlers/common-zod-validator';
import { validateProject } from './project.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/project/create-project
 * @description Create a new project
 * @access Admin
 * @param {function} controller - ['createProject']
 * @param {function} validation - ['validateProject']
 */
router.post('/create-project', validateProject, createProject);

/**
 * @route POST /api/v1/project/create-project/many
 * @description Create multiple project
 * @access Admin
 * @param {function} controller - ['createManyProject']
 */
router.post('/create-project/many', createManyProject);

/**
 * @route PUT /api/v1/project/update-project/many
 * @description Update multiple project information
 * @access Admin
 * @param {function} controller - ['updateManyProject']
 * @param {function} validation - ['validateIds']
 */
router.put('/update-project/many', validateIds, updateManyProject);

/**
 * @route PUT /api/v1/project/update-project/:id
 * @description Update project information
 * @param {string} id - The ID of the project to update
 * @access Admin
 * @param {function} controller - ['updateProject']
 * @param {function} validation - ['validateId', 'validateProject']
 */
router.put('/update-project/:id', validateId, validateProject, updateProject);

/**
 * @route DELETE /api/v1/project/delete-project/many
 * @description Delete multiple project
 * @access Admin
 * @param {function} controller - ['deleteManyProject']
 * @param {function} validation - ['validateIds']
 */
router.delete('/delete-project/many', validateIds, deleteManyProject);

/**
 * @route DELETE /api/v1/project/delete-project/:id
 * @description Delete a project
 * @param {string} id - The ID of the project to delete
 * @access Admin
 * @param {function} controller - ['deleteProject']
 * @param {function} validation - ['validateId']
 */
router.delete('/delete-project/:id', validateId, deleteProject);

/**
 * @route GET /api/v1/project/get-project/many
 * @description Get multiple project
 * @access Admin
 * @param {function} controller - ['getManyProject']
 * @param {function} validation - ['validateIds']
 */
router.get('/get-project/many', validateIds, getManyProject);

/**
 * @route GET /api/v1/project/get-project/:id
 * @description Get a project by ID
 * @param {string} id - The ID of the project to retrieve
 * @access Admin
 * @param {function} controller - ['getProjectById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-project/:id', validateId, getProjectById);

// Export the router

module.exports = router;


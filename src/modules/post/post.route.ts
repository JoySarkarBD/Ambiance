// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createManyPost,
  createPost,
  deleteManyPost,
  deletePost,
  getManyPost,
  getPostById,
  updateManyPost,
  updatePost,
} from './post.controller';

//Import validation from corresponding module
import { validateId, validateIds } from '../../handlers/common-zod-validator';
import { validatePost } from './post.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/post/create-post
 * @description Create a new post
 * @access Admin
 * @param {function} controller - ['createPost']
 * @param {function} validation - ['validatePost']
 */
router.post('/create-post', validatePost, createPost);

/**
 * @route POST /api/v1/post/create-post/many
 * @description Create multiple post
 * @access Admin
 * @param {function} controller - ['createManyPost']
 */
router.post('/create-post/many', createManyPost);

/**
 * @route PUT /api/v1/post/update-post/many
 * @description Update multiple post information
 * @access Admin
 * @param {function} controller - ['updateManyPost']
 * @param {function} validation - ['validateIds']
 */
router.put('/update-post/many', validateIds, updateManyPost);

/**
 * @route PUT /api/v1/post/update-post/:id
 * @description Update post information
 * @param {string} id - The ID of the post to update
 * @access Admin
 * @param {function} controller - ['updatePost']
 * @param {function} validation - ['validateId', 'validatePost']
 */
router.put('/update-post/:id', validateId, validatePost, updatePost);

/**
 * @route DELETE /api/v1/post/delete-post/many
 * @description Delete multiple post
 * @access Admin
 * @param {function} controller - ['deleteManyPost']
 * @param {function} validation - ['validateIds']
 */
router.delete('/delete-post/many', validateIds, deleteManyPost);

/**
 * @route DELETE /api/v1/post/delete-post/:id
 * @description Delete a post
 * @param {string} id - The ID of the post to delete
 * @access Admin
 * @param {function} controller - ['deletePost']
 * @param {function} validation - ['validateId']
 */
router.delete('/delete-post/:id', validateId, deletePost);

/**
 * @route GET /api/v1/post/get-post/many
 * @description Get multiple post
 * @access Admin
 * @param {function} controller - ['getManyPost']
 * @param {function} validation - ['validateIds']
 */
router.get('/get-post/many', validateIds, getManyPost);

/**
 * @route GET /api/v1/post/get-post/:id
 * @description Get a post by ID
 * @param {string} id - The ID of the post to retrieve
 * @access Admin
 * @param {function} controller - ['getPostById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-post/:id', validateId, getPostById);

// Export the router

module.exports = router;

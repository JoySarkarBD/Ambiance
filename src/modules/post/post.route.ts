// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { createPost, deletePost, getAllPost, getPostById, updatePost } from './post.controller';

//Import validation from corresponding module
import { validateId } from '../../handlers/common-zod-validator';
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import { validateImageRemovePath, validatePost } from './post.validation';

// Initialize router
const router = Router();

// Define route handlers

/**
 * @route GET /api/v1/post/get-all-post
 * @description Get multiple post
 * @access Public
 * @param {function} controller - ['getAllPost']
 */
router.get('/get-all-post', getAllPost);

/**
 * @route GET /api/v1/post/get-post/:id
 * @description Get a post by ID
 * @param {string} id - The ID of the post to retrieve
 * @access Public
 * @param {function} controller - ['getPostById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-post/:id', validateId, getPostById);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

/**
 * @route POST /api/v1/post/create-post
 * @description Create a new post
 * @access Admin
 * @param {function} controller - ['createPost']
 * @param {function} validation - ['validatePost']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post('/create-post', isAllowed(['admin']), validatePost, createPost);

/**
 * @route PUT /api/v1/post/update-post/:id
 * @description Update post information
 * @param {string} id - The ID of the post to update
 * @access Admin
 * @param {function} controller - ['updatePost']
 * @param {function} validation - ['validateId', 'validatePost', 'validateImageRemovePath' ]
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.put(
  '/update-post/:id',
  isAllowed(['admin']),
  validateId,
  validatePost,
  validateImageRemovePath,
  updatePost
);

/**
 * @route DELETE /api/v1/post/delete-post/:id
 * @description Delete a post
 * @param {string} id - The ID of the post to delete
 * @access Admin
 * @param {function} controller - ['deletePost']
 * @param {function} validation - ['validateId']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-post/:id', isAllowed(['admin']), validateId, deletePost);

// Export the router
module.exports = router;

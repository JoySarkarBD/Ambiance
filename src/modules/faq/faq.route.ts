// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { createFaq, deleteFaq, getAllFaq, getFaqById, updateFaq } from './faq.controller';

//Import validation from corresponding module
import { validateId } from '../../handlers/common-zod-validator';
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import { validateFaq } from './faq.validation';

// Initialize router
const router = Router();

// Define route handlers

/**
 * @route GET /api/v1/faq/get-all-faq
 * @description Get all faq
 * @access Public
 * @param {function} controller - ['getAllFaq']
 */
router.get('/get-all-faq', getAllFaq);

/**
 * @route GET /api/v1/faq/get-faq/:id
 * @description Get a faq by ID
 * @param {string} id - The ID of the faq to retrieve
 * @access Public
 * @param {function} controller - ['getFaqById']
 * @param {function} validation - ['validateId']
 */
router.get('/get-faq/:id', validateId, getFaqById);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

/**
 * @route POST /api/v1/faq/create-faq
 * @description Create a new faq
 * @access Admin
 * @param {function} controller - ['createFaq']
 * @param {function} validation - ['validateFaq']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post('/create-faq', isAllowed(['admin']), validateFaq, createFaq);

/**
 * @route PUT /api/v1/faq/update-faq/:id
 * @description Update faq information
 * @param {string} id - The ID of the faq to update
 * @access Admin
 * @param {function} controller - ['updateFaq']
 * @param {function} validation - ['validateId', 'validateFaq']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.put('/update-faq/:id', isAllowed(['admin']), validateId, validateFaq, updateFaq);

/**
 * @route DELETE /api/v1/faq/delete-faq/:id
 * @description Delete a faq
 * @param {string} id - The ID of the faq to delete
 * @access Admin
 * @param {function} controller - ['deleteFaq']
 * @param {function} validation - ['validateId']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.delete('/delete-faq/:id', isAllowed(['admin']), validateId, deleteFaq);

// Export the router
module.exports = router;

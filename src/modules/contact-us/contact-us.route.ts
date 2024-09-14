// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { createContactUs } from './contact-us.controller';

//Import validation from corresponding module
import { validateContactUs } from './contact-us.validation';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/contact-us
 * @description Create a new contact-us
 * @access Public
 * @param {function} controller - ['createContactUs']
 * @param {function} validation - ['validateContactUs']
 */
router.post('/', validateContactUs, createContactUs);

// Export the router
module.exports = router;

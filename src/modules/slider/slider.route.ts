// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { createOrUpdateSlider, getSliders } from './slider.controller';

//Import validation from corresponding module
import isAllowed from '../../middlewares/auth/is-allowed';
import isAuthorized from '../../middlewares/auth/is-authorized';
import { validateSlider, validateSliderType } from './slider.validation';

// Initialize router
const router = Router();

// Define route handlers

/**
 * @route GET /api/v1/slider/get-slider
 * @description Get multiple slider
 * @access Public
 * @param {function} validation - ['validateSlider']
 * @param {function} controller - ['validateSliderType']
 */
router.get('/get-slider', validateSliderType, getSliders);

/**
 * @description check if user is authorized
 * @param {function} middleware - ['isAuthorized']
 * @returns {object} - router
 * @method USE
 */
router.use(isAuthorized);

// Define route handlers
/**
 * @route POST /api/v1/slider/create-or-update-slider
 * @description Create a new slider
 * @access Public
 * @param {function} controller - ['createSlider']
 * @param {function} validation - ['validateSlider']
 * @param {function} middlewares - ['isAuthorized', 'isAllowed']
 */
router.post('/create-or-update-slider', isAllowed(['admin']), validateSlider, createOrUpdateSlider);

// Export the router
module.exports = router;


import { Request, Response } from 'express';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';
import { menuServices } from './menu.service';

/**
 * Controller function to handle the creation of a single Menu.
 *
 * @param {Request} req - The request object containing menu data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createMenu = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new menu and get the result
  const result = await menuServices.createMenu(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Menu created successfully', result);
});

/**
 * Controller function to handle the update operation for a single menu.
 *
 * @param {Request} req - The request object containing the ID of the menu to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the menu by ID and get the result
  const result = await menuServices.updateMenu(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Menu updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single menu.
 *
 * @param {Request} req - The request object containing the ID of the menu to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the menu by ID
  await menuServices.deleteMenu(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Menu deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple menu.
 *
 * @param {Request} req - The request object containing an array of IDs of menu to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyMenu = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple menu and get the result
  await menuServices.deleteManyMenu(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single menu by ID.
 *
 * @param {Request} req - The request object containing the ID of the menu to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getMenuById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the menu by ID and get the result
  const result = await menuServices.getMenuById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Menu retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple menu.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getAllMenu = catchAsync(async (req: Request, res: Response) => {
  const { user } = req; // Assume req.user is set by authentication middleware
  const { searchKey, showPerPage, pageNo } = req.query;

  const page = parseInt(pageNo as string, 10);
  const limit = parseInt(showPerPage as string, 10);
  const skip = (page - 1) * limit;

  if (user?.role === 'admin') {
    const filter: any = {};
    if (searchKey) {
      const regex = new RegExp(searchKey as string, 'i'); // 'i' for case-insensitive
      filter.$or = [
        { title: { $regex: regex } },
        { url: { $regex: regex } },
        { target: { $regex: regex } },
      ];
    }

    const { data, totalCount } = await menuServices.getManyMenu(filter, limit, skip);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Send response with pagination info
    return ServerResponse(res, true, 200, 'Resources retrieved successfully', {
      posts: data,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } else {
    // Call the service method to get all posts for non-admin users
    const result = await menuServices.getAllMenu();
    return ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
  }
});


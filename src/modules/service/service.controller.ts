import { Request, Response } from 'express';
import { serviceServices } from './service.service';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single Service.
 *
 * @param {Request} req - The request object containing service data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createService = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new service and get the result
  const result = await serviceServices.createService(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Service created successfully', result);
});

/**
 * Controller function to handle the creation of multiple service.
 *
 * @param {Request} req - The request object containing an array of service data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createManyService = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple services and get the result
  const result = await serviceServices.createManyService(req.body);
  // Send a success response with the created resources data
  ServerResponse(res, true, 201, 'Resources created successfully', result);
});

/**
 * Controller function to handle the update operation for a single service.
 *
 * @param {Request} req - The request object containing the ID of the service to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the service by ID and get the result
  const result = await serviceServices.updateService(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Service updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple service.
 *
 * @param {Request} req - The request object containing an array of service data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateManyService = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple service and get the result
  const result = await serviceServices.updateManyService(req.body);
  // Send a success response with the updated resources data
  ServerResponse(res, true, 200, 'Resources updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single service.
 *
 * @param {Request} req - The request object containing the ID of the service to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the service by ID
  await serviceServices.deleteService(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Service deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple service.
 *
 * @param {Request} req - The request object containing an array of IDs of service to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyService = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple service and get the result
  await serviceServices.deleteManyService(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single service by ID.
 *
 * @param {Request} req - The request object containing the ID of the service to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the service by ID and get the result
  const result = await serviceServices.getServiceById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Service retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple service.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getManyService = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple service based on query parameters and get the result
  const result = await serviceServices.getManyService(req.query);
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});
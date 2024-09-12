import { Request, Response } from 'express';
import { projectServices } from './project.service';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single Project.
 *
 * @param {Request} req - The request object containing project data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createProject = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new project and get the result
  const result = await projectServices.createProject(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Project created successfully', result);
});

/**
 * Controller function to handle the creation of multiple project.
 *
 * @param {Request} req - The request object containing an array of project data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createManyProject = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple projects and get the result
  const result = await projectServices.createManyProject(req.body);
  // Send a success response with the created resources data
  ServerResponse(res, true, 201, 'Resources created successfully', result);
});

/**
 * Controller function to handle the update operation for a single project.
 *
 * @param {Request} req - The request object containing the ID of the project to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the project by ID and get the result
  const result = await projectServices.updateProject(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Project updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple project.
 *
 * @param {Request} req - The request object containing an array of project data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateManyProject = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple project and get the result
  const result = await projectServices.updateManyProject(req.body);
  // Send a success response with the updated resources data
  ServerResponse(res, true, 200, 'Resources updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single project.
 *
 * @param {Request} req - The request object containing the ID of the project to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the project by ID
  await projectServices.deleteProject(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Project deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple project.
 *
 * @param {Request} req - The request object containing an array of IDs of project to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyProject = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple project and get the result
  await projectServices.deleteManyProject(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single project by ID.
 *
 * @param {Request} req - The request object containing the ID of the project to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the project by ID and get the result
  const result = await projectServices.getProjectById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Project retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple project.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getManyProject = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple project based on query parameters and get the result
  const result = await projectServices.getManyProject(req.query);
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});
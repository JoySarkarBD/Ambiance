import { Request, Response } from 'express';
import { postServices } from './post.service';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

/**
 * Controller function to handle the creation of a single Post.
 *
 * @param {Request} req - The request object containing post data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createPost = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new post and get the result
  const result = await postServices.createPost(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'Post created successfully', result);
});

/**
 * Controller function to handle the creation of multiple post.
 *
 * @param {Request} req - The request object containing an array of post data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const createManyPost = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create multiple posts and get the result
  const result = await postServices.createManyPost(req.body);
  // Send a success response with the created resources data
  ServerResponse(res, true, 201, 'Resources created successfully', result);
});

/**
 * Controller function to handle the update operation for a single post.
 *
 * @param {Request} req - The request object containing the ID of the post to update in URL parameters and the updated data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to update the post by ID and get the result
  const result = await postServices.updatePost(id, req.body);
  // Send a success response with the updated resource data
  ServerResponse(res, true, 200, 'Post updated successfully', result);
});

/**
 * Controller function to handle the update operation for multiple post.
 *
 * @param {Request} req - The request object containing an array of post data in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const updateManyPost = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to update multiple post and get the result
  const result = await postServices.updateManyPost(req.body);
  // Send a success response with the updated resources data
  ServerResponse(res, true, 200, 'Resources updated successfully', result);
});

/**
 * Controller function to handle the deletion of a single post.
 *
 * @param {Request} req - The request object containing the ID of the post to delete in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deletePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to delete the post by ID
  await postServices.deletePost(id);
  // Send a success response confirming the deletion
  ServerResponse(res, true, 200, 'Post deleted successfully');
});

/**
 * Controller function to handle the deletion of multiple post.
 *
 * @param {Request} req - The request object containing an array of IDs of post to delete in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteManyPost = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to delete multiple post and get the result
  await postServices.deleteManyPost(req.body);
  // Send a success response confirming the deletions
  ServerResponse(res, true, 200, 'Resources deleted successfully');
});

/**
 * Controller function to handle the retrieval of a single post by ID.
 *
 * @param {Request} req - The request object containing the ID of the post to retrieve in URL parameters.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getPostById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Call the service method to get the post by ID and get the result
  const result = await postServices.getPostById(id);
  // Send a success response with the retrieved resource data
  ServerResponse(res, true, 200, 'Post retrieved successfully', result);
});

/**
 * Controller function to handle the retrieval of multiple post.
 *
 * @param {Request} req - The request object containing query parameters for filtering.
 * @param {Response} res - The response object used to send the response.
 * @returns {void}
 */
export const getManyPost = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to get multiple post based on query parameters and get the result
  const result = await postServices.getManyPost(req.query);
  // Send a success response with the retrieved resources data
  ServerResponse(res, true, 200, 'Resources retrieved successfully', result);
});
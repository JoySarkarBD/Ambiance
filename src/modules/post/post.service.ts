// Import the model
import PostModel from './post.model';

/**
 * Service function to create a new post.
 *
 * @param data - The data to create a new post.
 * @returns {Promise<Post>} - The created post.
 */
const createPost = async (data: object) => {
  const newPost = new PostModel(data);
  return await newPost.save();
};

/**
 * Service function to create multiple post.
 *
 * @param data - An array of data to create multiple post.
 * @returns {Promise<Post[]>} - The created post.
 */
const createManyPost = async (data: object[]) => {
  return await PostModel.insertMany(data);
};

/**
 * Service function to update a single post by ID.
 *
 * @param id - The ID of the post to update.
 * @param data - The updated data for the post.
 * @returns {Promise<Post>} - The updated post.
 */
const updatePost = async (id: string, data: object) => {
  return await PostModel.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Service function to update multiple post.
 *
 * @param data - An array of data to update multiple post.
 * @returns {Promise<Post[]>} - The updated post.
 */
const updateManyPost = async (data: { id: string, updates: object }[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    PostModel.findByIdAndUpdate(id, updates, { new: true })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single post by ID.
 *
 * @param id - The ID of the post to delete.
 * @returns {Promise<Post>} - The deleted post.
 */
const deletePost = async (id: string) => {
  return await PostModel.findByIdAndDelete(id);
};

/**
 * Service function to delete multiple post.
 *
 * @param ids - An array of IDs of post to delete.
 * @returns {Promise<Post[]>} - The deleted post.
 */
const deleteManyPost = async (ids: string[]) => {
  return await PostModel.deleteMany({ _id: { $in: ids } });
};

/**
 * Service function to retrieve a single post by ID.
 *
 * @param id - The ID of the post to retrieve.
 * @returns {Promise<Post>} - The retrieved post.
 */
const getPostById = async (id: string) => {
  return await PostModel.findById(id);
};

/**
 * Service function to retrieve multiple post based on query parameters.
 *
 * @param query - The query parameters for filtering post.
 * @returns {Promise<Post[]>} - The retrieved post.
 */
const getManyPost = async (query: object) => {
  return await PostModel.find(query);
};

export const postServices = {
  createPost,
  createManyPost,
  updatePost,
  updateManyPost,
  deletePost,
  deleteManyPost,
  getPostById,
  getManyPost,
};
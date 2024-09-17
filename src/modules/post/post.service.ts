// Import the model
import PostModel, { IPost } from './post.model';

/**
 * Service function to create a new post.
 *
 * @param data - The data to create a new post.
 * @returns {Promise<IPost>} - The created post.
 */
export const createPost = async (data: Partial<IPost>): Promise<IPost> => {
  const newPost = new PostModel(data);
  const savedPost = await newPost.save();
  return savedPost;
};

/**
 * Service function to update a single post by ID.
 *
 * @param id - The ID of the post to update.
 * @param data - The updated data for the post.
 * @returns {Promise<IPost>} - The updated post.
 */
const updatePost = async (id: string, data: object): Promise<IPost | null> => {
  const updatedPost = await PostModel.findByIdAndUpdate(id, data, { new: true });
  return updatedPost;
};

/**
 * Service function to delete a single post by ID.
 *
 * @param id - The ID of the post to delete.
 * @returns {Promise<IPost | null>} - The deleted post.
 */
const deletePost = async (id: string): Promise<IPost | null> => {
  const deletedPost = await PostModel.findByIdAndDelete(id);
  return deletedPost;
};

/**
 * Service function to retrieve a single post by ID.
 *
 * @param id - The ID of the post to retrieve.
 * @returns {Promise<IPost | null>} - The retrieved post.
 */
const getPostById = async (id: string): Promise<IPost | null> => {
  const post = await PostModel.findById(id).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  return post;
};

/**
 * Service function to retrieve all posts for non-admin users.
 *
 * @returns {Promise<IPost[]>} - The retrieved posts.
 */
const getAllPost = async (): Promise<IPost[]> => {
  const posts = await PostModel.find().populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  return posts;
};

export const postServices = {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getAllPost,
};

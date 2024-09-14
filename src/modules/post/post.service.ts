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
  return await newPost.save();
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
 * Service function to delete a single post by ID.
 *
 * @param id - The ID of the post to delete.
 * @returns {Promise<Post>} - The deleted post.
 */
const deletePost = async (id: string) => {
  return await PostModel.findByIdAndDelete(id);
};

/**
 * Service function to retrieve a single post by ID.
 *
 * @param id - The ID of the post to retrieve.
 * @returns {Promise<Post>} - The retrieved post.
 */
const getPostById = async (id: string) => {
  return await PostModel.findById(id).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
};

/**
 * Service function to retrieve multiple posts based on query parameters for admins.
 *
 * @param filter - The filter criteria for posts.
 * @param limit - Number of posts per page.
 * @param skip - Number of posts to skip for pagination.
 * @returns {Promise<{ data: Post[], totalCount: number }>} - The retrieved posts and total count.
 */
const getManyPost = async (filter: object, limit: number, skip: number) => {
  // Retrieve posts with filter, pagination, and count
  const data = await PostModel.find(filter)
    .populate({
      path: 'created_by',
      select: 'first_name last_name avatar',
    })
    .limit(limit)
    .skip(skip)
    .exec();
  const totalCount = await PostModel.countDocuments(filter);

  return { data, totalCount };
};

/**
 * Service function to retrieve all posts for non-admin users.
 *
 * @returns {Promise<Post[]>} - The retrieved posts.
 */
const getAllPost = async () => {
  return await PostModel.find().populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
};

export const postServices = {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getManyPost,
  getAllPost,
};

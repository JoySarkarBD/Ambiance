// Import the model
import SocialModel from './social.model';

/**
 * Service function to create a new social.
 *
 * @param data - The data to create a new social.
 * @returns {Promise<Social>} - The created social.
 */
const createSocial = async (data: object) => {
  const newSocial = new SocialModel(data);
  return await newSocial.save();
};

/**
 * Service function to update a single social by ID.
 *
 * @param id - The ID of the social to update.
 * @param data - The updated data for the social.
 * @returns {Promise<Social>} - The updated social.
 */
const updateSocial = async (id: string, data: object) => {
  return await SocialModel.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Service function to delete a single social by ID.
 *
 * @param id - The ID of the social to delete.
 * @returns {Promise<Social>} - The deleted social.
 */
const deleteSocial = async (id: string) => {
  return await SocialModel.findByIdAndDelete(id);
};

/**
 * Service function to delete multiple social.
 *
 * @param ids - An array of IDs of social to delete.
 * @returns {Promise<Social[]>} - The deleted social.
 */
const deleteManySocial = async (ids: string[]) => {
  return await SocialModel.deleteMany({ _id: { $in: ids } });
};

/**
 * Service function to retrieve a single social by ID.
 *
 * @param id - The ID of the social to retrieve.
 * @returns {Promise<Social>} - The retrieved social.
 */
const getSocialById = async (id: string) => {
  return await SocialModel.findById(id);
};

/**
 * Service function to retrieve all social .
 *
 * @returns {Promise<Social[]>} - The retrieved social.
 */
const getAllSocial = async () => {
  return await SocialModel.find();
};

export const socialServices = {
  createSocial,
  updateSocial,
  deleteSocial,
  deleteManySocial,
  getSocialById,
  getAllSocial,
};


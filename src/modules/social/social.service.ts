import SocialModel, { ISocial } from './social.model';

/**
 * Service function to create a new social.
 *
 * @param data - The data to create a new social.
 * @returns {Promise<ISocial>} - The created social.
 * @throws {Error} - Throws an error if the social creation fails.
 */
const createSocial = async (data: Partial<ISocial>): Promise<ISocial> => {
  const newSocial = new SocialModel(data);
  const savedSocial = await newSocial.save();
  if (!savedSocial) throw new Error('Failed to create social');
  return savedSocial;
};

/**
 * Service function to update a single social by ID.
 *
 * @param id - The ID of the social to update.
 * @param data - The updated data for the social.
 * @returns {Promise<ISocial | null>} - The updated social or null if not found.
 * @throws {Error} - Throws an error if the social update fails.
 */
const updateSocial = async (id: string, data: Partial<ISocial>): Promise<ISocial | null> => {
  const updatedSocial = await SocialModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedSocial) throw new Error('Failed to update social');
  return updatedSocial;
};

/**
 * Service function to delete a single social by ID.
 *
 * @param id - The ID of the social to delete.
 * @returns {Promise<ISocial | null>} - The deleted social or null if not found.
 * @throws {Error} - Throws an error if the social deletion fails.
 */
const deleteSocial = async (id: string): Promise<ISocial | null> => {
  const deletedSocial = await SocialModel.findByIdAndDelete(id);
  if (!deletedSocial) throw new Error('Failed to delete social');
  return deletedSocial;
};

/**
 * Service function to retrieve a single social by ID.
 *
 * @param id - The ID of the social to retrieve.
 * @returns {Promise<ISocial | null>} - The retrieved social or null if not found.
 * @throws {Error} - Throws an error if the social is not found.
 */
const getSocialById = async (id: string): Promise<ISocial | null> => {
  const social = await SocialModel.findById(id).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!social) throw new Error('Social not found');
  return social;
};

/**
 * Service function to retrieve all socials.
 *
 * @returns {Promise<ISocial[]>} - The retrieved socials.
 * @throws {Error} - Throws an error if the retrieval fails.
 */
const getAllSocial = async (): Promise<ISocial[]> => {
  const socials = await SocialModel.find().populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!socials) throw new Error('Failed to retrieve socials');
  return socials;
};

/**
 * Service function to retrieve a single social by name.
 *
 * @param name - The name of the social to retrieve.
 * @returns {Promise<ISocial | null>} - The retrieved social document or null if not found.
 * @throws {Error} - Throws an error if the social is not found.
 */
const getSocialByName = async (name: string): Promise<ISocial | null> => {
  const social = await SocialModel.findOne({ name }).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!social) throw new Error('Social not found');
  return social;
};

export const socialServices = {
  createSocial,
  updateSocial,
  deleteSocial,
  getSocialById,
  getAllSocial,
  getSocialByName,
};

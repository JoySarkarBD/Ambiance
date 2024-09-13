// Import the model
import FaqModel from './faq.model';

/**
 * Service function to create a new faq.
 *
 * @param data - The data to create a new faq.
 * @returns {Promise<Faq>} - The created faq.
 */
const createFaq = async (data: object) => {
  const newFaq = new FaqModel(data);
  return await newFaq.save();
};

/**
 * Service function to update a single faq by ID.
 *
 * @param id - The ID of the faq to update.
 * @param data - The updated data for the faq.
 * @returns {Promise<Faq>} - The updated faq.
 */
const updateFaq = async (id: string, data: object) => {
  return await FaqModel.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Service function to delete a single faq by ID.
 *
 * @param id - The ID of the faq to delete.
 * @returns {Promise<Faq>} - The deleted faq.
 */
const deleteFaq = async (id: string) => {
  return await FaqModel.findByIdAndDelete(id);
};

/**
 * Service function to delete multiple faq.
 *
 * @param ids - An array of IDs of faq to delete.
 * @returns {Promise<Faq[]>} - The deleted faq.
 */
const deleteManyFaq = async (ids: string[]) => {
  return await FaqModel.deleteMany({ _id: { $in: ids } });
};

/**
 * Service function to retrieve a single faq by ID.
 *
 * @param id - The ID of the faq to retrieve.
 * @returns {Promise<Faq>} - The retrieved faq.
 */
const getFaqById = async (id: string) => {
  return await FaqModel.findById(id);
};

/**
 * Service function to retrieve multiple faq based on query parameters.
 *
 * @returns {Promise<Faq[]>} - The retrieved faq.
 */
const getAllFaq = async () => {
  return await FaqModel.find();
};

export const faqServices = {
  createFaq,
  updateFaq,
  deleteFaq,
  deleteManyFaq,
  getFaqById,
  getAllFaq,
};


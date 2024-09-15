import FaqModel, { IFaq } from './faq.model';

/**
 * Service function to create a new FAQ.
 *
 * @param {Partial<IFaq>} data - The data to create a new FAQ.
 * @returns {Promise<IFaq>} - The created FAQ.
 * @throws {Error} - Throws an error if the FAQ creation fails.
 */
const createFaq = async (data: Partial<IFaq>): Promise<IFaq> => {
  const newFaq = new FaqModel(data);
  const savedFaq = await newFaq.save();
  if (!savedFaq) throw new Error('Failed to create FAQ');
  return savedFaq;
};

/**
 * Service function to update a single FAQ by ID.
 *
 * @param {string} id - The ID of the FAQ to update.
 * @param {Partial<IFaq>} data - The updated data for the FAQ.
 * @returns {Promise<IFaq | null>} - The updated FAQ or null if not found.
 * @throws {Error} - Throws an error if the FAQ update fails.
 */
const updateFaq = async (id: string, data: Partial<IFaq>): Promise<IFaq | null> => {
  const updatedFaq = await FaqModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedFaq) throw new Error('Failed to update FAQ');
  return updatedFaq;
};

/**
 * Service function to delete a single FAQ by ID.
 *
 * @param {string} id - The ID of the FAQ to delete.
 * @returns {Promise<IFaq | null>} - The deleted FAQ or null if not found.
 * @throws {Error} - Throws an error if the FAQ deletion fails.
 */
const deleteFaq = async (id: string): Promise<IFaq | null> => {
  const deletedFaq = await FaqModel.findByIdAndDelete(id);
  if (!deletedFaq) throw new Error('Failed to delete FAQ');
  return deletedFaq;
};

/**
 * Service function to retrieve a single FAQ by ID.
 *
 * @param {string} id - The ID of the FAQ to retrieve.
 * @returns {Promise<IFaq | null>} - The retrieved FAQ or null if not found.
 * @throws {Error} - Throws an error if the FAQ is not found.
 */
const getFaqById = async (id: string): Promise<IFaq | null> => {
  const faq = await FaqModel.findById(id).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!faq) throw new Error('FAQ not found');
  return faq;
};

/**
 * Service function to retrieve all FAQs.
 *
 * @returns {Promise<IFaq[]>} - An array of all FAQs.
 * @throws {Error} - Throws an error if the FAQs retrieval fails.
 */
const getAllFaq = async (): Promise<IFaq[]> => {
  const faqs = await FaqModel.find().populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!faqs) throw new Error('Failed to retrieve FAQs');
  return faqs;
};

export const faqServices = {
  createFaq,
  updateFaq,
  deleteFaq,
  getFaqById,
  getAllFaq,
};

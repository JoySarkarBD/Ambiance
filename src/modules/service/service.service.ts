// Import the model
import ServiceModel from './service.model';

/**
 * Service function to create a new service.
 *
 * @param data - The data to create a new service.
 * @returns {Promise<Service>} - The created service.
 */
const createService = async (data: object) => {
  const newService = new ServiceModel(data);
  return await newService.save();
};

/**
 * Service function to create multiple service.
 *
 * @param data - An array of data to create multiple service.
 * @returns {Promise<Service[]>} - The created service.
 */
const createManyService = async (data: object[]) => {
  return await ServiceModel.insertMany(data);
};

/**
 * Service function to update a single service by ID.
 *
 * @param id - The ID of the service to update.
 * @param data - The updated data for the service.
 * @returns {Promise<Service>} - The updated service.
 */
const updateService = async (id: string, data: object) => {
  return await ServiceModel.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Service function to update multiple service.
 *
 * @param data - An array of data to update multiple service.
 * @returns {Promise<Service[]>} - The updated service.
 */
const updateManyService = async (data: { id: string, updates: object }[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    ServiceModel.findByIdAndUpdate(id, updates, { new: true })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single service by ID.
 *
 * @param id - The ID of the service to delete.
 * @returns {Promise<Service>} - The deleted service.
 */
const deleteService = async (id: string) => {
  return await ServiceModel.findByIdAndDelete(id);
};

/**
 * Service function to delete multiple service.
 *
 * @param ids - An array of IDs of service to delete.
 * @returns {Promise<Service[]>} - The deleted service.
 */
const deleteManyService = async (ids: string[]) => {
  return await ServiceModel.deleteMany({ _id: { $in: ids } });
};

/**
 * Service function to retrieve a single service by ID.
 *
 * @param id - The ID of the service to retrieve.
 * @returns {Promise<Service>} - The retrieved service.
 */
const getServiceById = async (id: string) => {
  return await ServiceModel.findById(id);
};

/**
 * Service function to retrieve multiple service based on query parameters.
 *
 * @param query - The query parameters for filtering service.
 * @returns {Promise<Service[]>} - The retrieved service.
 */
const getManyService = async (query: object) => {
  return await ServiceModel.find(query);
};

export const serviceServices = {
  createService,
  createManyService,
  updateService,
  updateManyService,
  deleteService,
  deleteManyService,
  getServiceById,
  getManyService,
};
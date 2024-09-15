import ServiceModel, { IService } from './service.model';

/**
 * Service function to create a new service.
 *
 * @param data - The data to create a new service.
 * @returns {Promise<IService>} - The created service.
 * @throws {Error} - Throws an error if the service creation fails.
 */
const createService = async (data: Partial<IService>): Promise<IService> => {
  const newService = new ServiceModel(data);
  const savedService = await newService.save();
  return savedService;
};

/**
 * Service function to update a single service by ID.
 *
 * @param id - The ID of the service to update.
 * @param data - The updated data for the service.
 * @returns {Promise<IService | null>} - The updated service or null if not found.
 * @throws {Error} - Throws an error if the service update fails.
 */
const updateService = async (id: string, data: Partial<IService>): Promise<IService | null> => {
  const updatedService = await ServiceModel.findByIdAndUpdate(id, data, { new: true });
  return updatedService;
};

/**
 * Service function to delete a single service by ID.
 *
 * @param id - The ID of the service to delete.
 * @returns {Promise<IService | null>} - The deleted service or null if not found.
 * @throws {Error} - Throws an error if the service deletion fails.
 */
const deleteService = async (id: string): Promise<IService | null> => {
  const deletedService = await ServiceModel.findByIdAndDelete(id);
  return deletedService;
};

/**
 * Service function to retrieve a single service by ID.
 *
 * @param id - The ID of the service to retrieve.
 * @returns {Promise<IService | null>} - The retrieved service or null if not found.
 * @throws {Error} - Throws an error if the service is not found.
 */
const getServiceById = async (id: string): Promise<IService | null> => {
  const service = await ServiceModel.findById(id).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!service) throw new Error('Service not found');
  return service;
};

/**
 * Service function to retrieve all services for non-admin users.
 *
 * @returns {Promise<IService[]>} - The retrieved services.
 * @throws {Error} - Throws an error if the services retrieval fails.
 */
const getAllService = async (): Promise<IService[]> => {
  const services = await ServiceModel.find();
  if (!services) throw new Error('Failed to retrieve services');
  return services;
};

export const serviceServices = {
  createService,
  updateService,
  deleteService,
  getServiceById,
  getAllService,
};

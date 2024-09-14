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
  if (!savedService) throw new Error('Failed to create service');
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
  if (!updatedService) throw new Error('Failed to update service');
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
  if (!deletedService) throw new Error('Failed to delete service');
  return deletedService;
};

/**
 * Service function to delete multiple services by IDs.
 *
 * @param ids - An array of IDs of services to delete.
 * @returns {Promise<number>} - The number of deleted services.
 * @throws {Error} - Throws an error if the deletion fails or no services were deleted.
 */
const deleteManyService = async (ids: string[]): Promise<number> => {
  const result = await ServiceModel.deleteMany({ _id: { $in: ids } });
  if (!result || result.deletedCount === 0) throw new Error('Failed to delete services');
  return result.deletedCount;
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
 * Service function to retrieve multiple services based on query parameters.
 *
 * @param filter - The filter criteria for services.
 * @param limit - Number of services per page.
 * @param skip - Number of services to skip for pagination.
 * @returns {Promise<{ data: IService[], totalCount: number }>} - The retrieved services and total count.
 * @throws {Error} - Throws an error if the services retrieval fails.
 */
const getManyService = async (
  filter: object,
  limit: number,
  skip: number
): Promise<{ data: IService[]; totalCount: number }> => {
  const data = await ServiceModel.find(filter)
    .populate({
      path: 'created_by',
      select: 'first_name last_name avatar',
    })
    .limit(limit)
    .skip(skip)
    .exec();

  if (!data) throw new Error('Failed to retrieve services');

  const totalCount = await ServiceModel.countDocuments(filter);
  if (totalCount === undefined) throw new Error('Failed to retrieve total count of services');

  return { data, totalCount };
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
  deleteManyService,
  getServiceById,
  getManyService,
  getAllService,
};

// Import the model
import ServiceModel, { IService } from './service.model';

/**
 * Service function to create a new service.
 *
 * @param data - The data to create a new service.
 * @returns {Promise<IService>} - The created service.
 */
const createService = async (data: Partial<IService>): Promise<IService> => {
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
const updateManyService = async (data: { id: string; updates: object }[]) => {
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
  return await ServiceModel.findById(id).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
};

/**
 * Service function to retrieve multiple service based on query parameters.
 *
 * @param filter - The filter criteria for posts.
 * @param limit - Number of posts per page.
 * @param skip - Number of posts to skip for pagination.
 * @returns {Promise<{ data: Post[], totalCount: number }>} - The retrieved posts and total count.
 */
const getManyService = async (filter: object, limit: number, skip: number) => {
  // Retrieve posts with filter, pagination, and count
  const data = await ServiceModel.find(filter)
    .populate({
      path: 'created_by',
      select: 'first_name last_name avatar',
    })
    .limit(limit)
    .skip(skip)
    .exec();
  const totalCount = await ServiceModel.countDocuments(filter);

  return { data, totalCount };
};

/**
 * Service function to retrieve all services for non-admin users.
 *
 * @returns {Promise<Service[]>} - The retrieved services.
 */
const getAllService = async () => {
  return await ServiceModel.find();
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
  getAllService,
};

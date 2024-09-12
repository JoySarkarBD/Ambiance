// Import the model
import ProjectModel from './project.model';

/**
 * Service function to create a new project.
 *
 * @param data - The data to create a new project.
 * @returns {Promise<Project>} - The created project.
 */
const createProject = async (data: object) => {
  const newProject = new ProjectModel(data);
  return await newProject.save();
};

/**
 * Service function to create multiple project.
 *
 * @param data - An array of data to create multiple project.
 * @returns {Promise<Project[]>} - The created project.
 */
const createManyProject = async (data: object[]) => {
  return await ProjectModel.insertMany(data);
};

/**
 * Service function to update a single project by ID.
 *
 * @param id - The ID of the project to update.
 * @param data - The updated data for the project.
 * @returns {Promise<Project>} - The updated project.
 */
const updateProject = async (id: string, data: object) => {
  return await ProjectModel.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Service function to update multiple project.
 *
 * @param data - An array of data to update multiple project.
 * @returns {Promise<Project[]>} - The updated project.
 */
const updateManyProject = async (data: { id: string, updates: object }[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    ProjectModel.findByIdAndUpdate(id, updates, { new: true })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single project by ID.
 *
 * @param id - The ID of the project to delete.
 * @returns {Promise<Project>} - The deleted project.
 */
const deleteProject = async (id: string) => {
  return await ProjectModel.findByIdAndDelete(id);
};

/**
 * Service function to delete multiple project.
 *
 * @param ids - An array of IDs of project to delete.
 * @returns {Promise<Project[]>} - The deleted project.
 */
const deleteManyProject = async (ids: string[]) => {
  return await ProjectModel.deleteMany({ _id: { $in: ids } });
};

/**
 * Service function to retrieve a single project by ID.
 *
 * @param id - The ID of the project to retrieve.
 * @returns {Promise<Project>} - The retrieved project.
 */
const getProjectById = async (id: string) => {
  return await ProjectModel.findById(id);
};

/**
 * Service function to retrieve multiple project based on query parameters.
 *
 * @param query - The query parameters for filtering project.
 * @returns {Promise<Project[]>} - The retrieved project.
 */
const getManyProject = async (query: object) => {
  return await ProjectModel.find(query);
};

export const projectServices = {
  createProject,
  createManyProject,
  updateProject,
  updateManyProject,
  deleteProject,
  deleteManyProject,
  getProjectById,
  getManyProject,
};
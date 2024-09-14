import ProjectModel, { IProject } from './project.model';

/**
 * Service function to create a new project.
 *
 * @param data - The data to create a new project.
 * @returns {Promise<IProject>} - The created project.
 * @throws {Error} - Throws an error if the project creation fails.
 */
const createProject = async (data: Partial<IProject>): Promise<IProject> => {
  const newProject = new ProjectModel(data);
  const savedProject = await newProject.save();
  if (!savedProject) throw new Error('Failed to create project');
  return savedProject;
};

/**
 * Service function to create multiple projects.
 *
 * @param data - An array of data to create multiple projects.
 * @returns {Promise<IProject[]>} - The created projects.
 * @throws {Error} - Throws an error if the projects creation fails.
 */
const createManyProject = async (data: object[]): Promise<IProject[]> => {
  const result = await ProjectModel.insertMany(data);
  if (!result) throw new Error('Failed to create projects');
  return result;
};

/**
 * Service function to update a single project by ID.
 *
 * @param id - The ID of the project to update.
 * @param data - The updated data for the project.
 * @returns {Promise<IProject | null>} - The updated project.
 * @throws {Error} - Throws an error if the project update fails.
 */
const updateProject = async (id: string, data: object): Promise<IProject | null> => {
  const updatedProject = await ProjectModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedProject) throw new Error('Failed to update project');
  return updatedProject;
};

/**
 * Service function to delete a single project by ID.
 *
 * @param id - The ID of the project to delete.
 * @returns {Promise<IProject | null>} - The deleted project.
 * @throws {Error} - Throws an error if the project deletion fails.
 */
const deleteProject = async (id: string): Promise<IProject | null> => {
  const deletedProject = await ProjectModel.findByIdAndDelete(id);
  if (!deletedProject) throw new Error('Failed to delete project');
  return deletedProject;
};

/**
 * Service function to delete multiple projects.
 *
 * @param ids - An array of IDs of projects to delete.
 * @returns {Promise<{ deletedCount: number }>} - The result of the delete operation.
 * @throws {Error} - Throws an error if the projects deletion fails.
 */
const deleteManyProject = async (ids: string[]): Promise<{ deletedCount: number }> => {
  const result = await ProjectModel.deleteMany({ _id: { $in: ids } });
  if (result.deletedCount === undefined) throw new Error('Failed to delete projects');
  return { deletedCount: result.deletedCount };
};

/**
 * Service function to retrieve a single project by ID.
 *
 * @param id - The ID of the project to retrieve.
 * @returns {Promise<IProject | null>} - The retrieved project.
 * @throws {Error} - Throws an error if the project retrieval fails.
 */
const getProjectById = async (id: string): Promise<IProject | null> => {
  const project = await ProjectModel.findById(id).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!project) throw new Error('Project not found');
  return project;
};

/**
 * Service function to retrieve multiple projects based on query parameters.
 *
 * @param filter - The filter criteria for projects.
 * @param limit - Number of projects per page.
 * @param skip - Number of projects to skip for pagination.
 * @returns {Promise<{ data: IProject[], totalCount: number }>} - The retrieved projects and total count.
 * @throws {Error} - Throws an error if the projects retrieval fails.
 */
const getManyProject = async (
  filter: object,
  limit: number,
  skip: number
): Promise<{ data: IProject[]; totalCount: number }> => {
  const data = await ProjectModel.find(filter)
    .populate({
      path: 'created_by',
      select: 'first_name last_name avatar',
    })
    .limit(limit)
    .skip(skip)
    .exec();
  if (!data) throw new Error('Failed to retrieve projects');
  const totalCount = await ProjectModel.countDocuments(filter);
  if (totalCount === undefined) throw new Error('Failed to count projects');

  return { data, totalCount };
};

/**
 * Service function to retrieve all projects for non-admin users.
 *
 * @returns {Promise<IProject[]>} - The retrieved projects.
 * @throws {Error} - Throws an error if the projects retrieval fails.
 */
const getAllProject = async (): Promise<IProject[]> => {
  const projects = await ProjectModel.find().populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!projects) throw new Error('Failed to retrieve projects');
  return projects;
};

export const projectServices = {
  createProject,
  createManyProject,
  updateProject,
  deleteProject,
  deleteManyProject,
  getProjectById,
  getManyProject,
  getAllProject,
};

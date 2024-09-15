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
  return savedProject;
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
  return deletedProject;
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
  updateProject,
  deleteProject,
  getProjectById,
  getAllProject,
};

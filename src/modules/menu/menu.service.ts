// Import the model
import MenuModel from './menu.model';

/**
 * Service function to create a new menu.
 *
 * @param data - The data to create a new menu.
 * @returns {Promise<Menu>} - The created menu.
 */
const createMenu = async (data: object) => {
  const newMenu = new MenuModel(data);
  return await newMenu.save();
};

/**
 * Service function to create multiple menu.
 *
 * @param data - An array of data to create multiple menu.
 * @returns {Promise<Menu[]>} - The created menu.
 */
const createManyMenu = async (data: object[]) => {
  return await MenuModel.insertMany(data);
};

/**
 * Service function to update a single menu by ID.
 *
 * @param id - The ID of the menu to update.
 * @param data - The updated data for the menu.
 * @returns {Promise<Menu>} - The updated menu.
 */
const updateMenu = async (id: string, data: object) => {
  return await MenuModel.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Service function to update multiple menu.
 *
 * @param data - An array of data to update multiple menu.
 * @returns {Promise<Menu[]>} - The updated menu.
 */
const updateManyMenu = async (data: { id: string, updates: object }[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    MenuModel.findByIdAndUpdate(id, updates, { new: true })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single menu by ID.
 *
 * @param id - The ID of the menu to delete.
 * @returns {Promise<Menu>} - The deleted menu.
 */
const deleteMenu = async (id: string) => {
  return await MenuModel.findByIdAndDelete(id);
};

/**
 * Service function to delete multiple menu.
 *
 * @param ids - An array of IDs of menu to delete.
 * @returns {Promise<Menu[]>} - The deleted menu.
 */
const deleteManyMenu = async (ids: string[]) => {
  return await MenuModel.deleteMany({ _id: { $in: ids } });
};

/**
 * Service function to retrieve a single menu by ID.
 *
 * @param id - The ID of the menu to retrieve.
 * @returns {Promise<Menu>} - The retrieved menu.
 */
const getMenuById = async (id: string) => {
  return await MenuModel.findById(id);
};

/**
 * Service function to retrieve multiple menu based on query parameters.
 *
 * @param query - The query parameters for filtering menu.
 * @returns {Promise<Menu[]>} - The retrieved menu.
 */
const getManyMenu = async (query: object) => {
  return await MenuModel.find(query);
};

export const menuServices = {
  createMenu,
  createManyMenu,
  updateMenu,
  updateManyMenu,
  deleteMenu,
  deleteManyMenu,
  getMenuById,
  getManyMenu,
};
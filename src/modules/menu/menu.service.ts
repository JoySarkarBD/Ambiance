// Import the model
import MenuModel, { IMenu } from './menu.model';

/**
 * Service function to create a new menu.
 *
 * @param data - The data to create a new menu.
 * @returns {Promise<Menu>} - The created menu.
 */
const createMenu = async (data: Partial<IMenu>): Promise<IMenu> => {
  const newMenu = new MenuModel(data);
  return await newMenu.save();
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
 * @param filter - The filter criteria for menus.
 * @param limit - Number of menus per page.
 * @param skip - Number of menus to skip for pagination.
 * @returns {Promise<{ data: Post[], totalCount: number }>} - The retrieved menus and total count.
 */
const getManyMenu = async (filter: object, limit: number, skip: number) => {
  // Retrieve posts with filter, pagination, and count
  const data = await MenuModel.find(filter).limit(limit).skip(skip).exec();
  const totalCount = await MenuModel.countDocuments(filter);

  return { data, totalCount };
};

/**
 * Service function to retrieve all menu for non-admin users.
 *
 * @returns {Promise<Post[]>} - The retrieved menu.
 */
const getAllMenu = async () => {
  return await MenuModel.find();
};

export const menuServices = {
  createMenu,
  updateMenu,
  deleteMenu,
  deleteManyMenu,
  getMenuById,
  getManyMenu,
  getAllMenu,
};


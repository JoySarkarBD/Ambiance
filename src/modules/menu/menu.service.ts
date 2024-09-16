import MenuModel, { IMenu } from './menu.model';

/**
 * Service function to create a new menu.
 *
 * @param data - The data to create a new menu.
 * @returns {Promise<Menu>} - The created menu.
 */
const createMenu = async (data: Partial<IMenu>): Promise<IMenu> => {
  const newMenu = new MenuModel(data);
  const savedMenu = await newMenu.save();
  if (!savedMenu) throw new Error('Failed to create menu');
  return savedMenu;
};

/**
 * Service function to update a single menu by ID.
 *
 * @param id - The ID of the menu to update.
 * @param data - The updated data for the menu.
 * @returns {Promise<Menu>} - The updated menu.
 */
const updateMenu = async (id: string, data: object): Promise<IMenu | null> => {
  const updatedMenu = await MenuModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedMenu) throw new Error('Failed to update menu');
  return updatedMenu;
};

/**
 * Service function to delete a single menu by ID.
 *
 * @param id - The ID of the menu to delete.
 * @returns {Promise<Menu>} - The deleted menu.
 */
const deleteMenu = async (id: string): Promise<IMenu | null> => {
  const deletedMenu = await MenuModel.findByIdAndDelete(id);
  if (!deletedMenu) throw new Error('Failed to delete menu');
  return deletedMenu;
};

/**
 * Service function to retrieve a single menu by ID.
 *
 * @param id - The ID of the menu to retrieve.
 * @returns {Promise<Menu>} - The retrieved menu.
 */
const getMenuById = async (id: string): Promise<IMenu | null> => {
  const menu = await MenuModel.findById(id).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!menu) throw new Error('Menu not found');
  return menu;
};

/**
 * Service function to retrieve all menus.
 *
 * @returns {Promise<Menu[]>} - The retrieved menus.
 */
const getAllMenu = async (): Promise<IMenu[]> => {
  const menus = await MenuModel.find().populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!menus) throw new Error('Failed to retrieve menus');
  return menus;
};

export const menuServices = {
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuById,
  getAllMenu,
};

// Import the model
import OptionModel, { IOption } from './option.model';

/**
 * Service function to create a new option.
 *
 * @param data - The data to create a new option.
 * @returns {Promise<IOption>} - The created option.
 */
const createOption = async (data: Partial<IOption>): Promise<IOption> => {
  const { name } = data;

  // Check if an option with the same name already exists
  const existingOption = await OptionModel.findOne({ name }).exec();
  if (existingOption) {
    throw new Error(`Option with name "${name}" already exists`);
  }

  // Create and save the new option
  const newOption = new OptionModel(data);
  return await newOption.save();
};

/**
 * Service function to update a single option by ID.
 *
 * @param id - The ID of the option to update.
 * @param data - The updated data for the option.
 * @returns {Promise<IOption | null>} - The updated option.
 */
const updateOption = async (id: string, data: object): Promise<IOption | null> => {
  const updatedOption = await OptionModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedOption) throw new Error('Failed to update option');
  return updatedOption;
};

/**
 * Service function to delete a single option by ID.
 *
 * @param id - The ID of the option to delete.
 * @returns {Promise<IOption | null>} - The deleted option.
 */
const deleteOption = async (id: string): Promise<IOption | null> => {
  const deletedOption = await OptionModel.findByIdAndDelete(id);
  if (!deletedOption) throw new Error('Failed to delete option');
  return deletedOption;
};

/**
 * Service function to delete multiple options.
 *
 * @param ids - An array of IDs of options to delete.
 * @returns {Promise<number>} - The number of deleted options.
 */
const deleteManyOption = async (ids: string[]): Promise<number> => {
  const result = await OptionModel.deleteMany({ _id: { $in: ids } });
  if (result.deletedCount === 0) throw new Error('Failed to delete options');
  return result.deletedCount;
};

/**
 * Service function to retrieve a single option by name.
 *
 * @param name - The name of the option to retrieve.
 * @returns {Promise<IOption | null>} - The retrieved option.
 */
const getOptionByName = async (name: string): Promise<IOption | null> => {
  const option = await OptionModel.findOne({ name }).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!option) throw new Error('Option not found');
  return option;
};

/**
 * Service function to retrieve all options.
 *
 * @returns {Promise<IOption[]>} - The retrieved options.
 */
const getAllOption = async (): Promise<IOption[]> => {
  const options = await OptionModel.find().populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  if (!options) throw new Error('Failed to retrieve options');
  return options;
};

export const optionServices = {
  createOption,
  updateOption,
  deleteOption,
  deleteManyOption,
  getOptionByName,
  getAllOption,
};

// Import the model
import OptionModel, { IOption } from './option.model';

/**
 * Service function to create a new option.
 *
 * @param data - The data to create a new option.
 * @returns {Promise<IOption>} - The created option.
 */
const createOption = async (data: Partial<IOption>): Promise<IOption> => {
  const newOption = new OptionModel(data);
  return await newOption.save();
};

/**
 * Service function to update a single option by ID.
 *
 * @param id - The ID of the option to update.
 * @param data - The updated data for the option.
 * @returns {Promise<Option>} - The updated option.
 */
const updateOption = async (id: string, data: object) => {
  return await OptionModel.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Service function to delete a single option by ID.
 *
 * @param id - The ID of the option to delete.
 * @returns {Promise<Option>} - The deleted option.
 */
const deleteOption = async (id: string) => {
  return await OptionModel.findByIdAndDelete(id);
};

/**
 * Service function to delete multiple option.
 *
 * @param ids - An array of IDs of option to delete.
 * @returns {Promise<Option[]>} - The deleted option.
 */
const deleteManyOption = async (ids: string[]) => {
  return await OptionModel.deleteMany({ _id: { $in: ids } });
};

/**
 * Service function to retrieve a single option by name.
 *
 * @param id - The name of the option to retrieve.
 * @returns {Promise<Option>} - The retrieved option.
 */
const getOptionByName = async (name: string) => {
  return await OptionModel.find({ name });
};

/**
 * Service function to retrieve all option.
 *
 * @returns {Promise<Option[]>} - The retrieved option.
 */
const getAllOption = async () => {
  return await OptionModel.find();
};

export const optionServices = {
  createOption,
  updateOption,
  deleteOption,
  deleteManyOption,
  getOptionByName,
  getAllOption,
};

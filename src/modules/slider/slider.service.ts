// Import the model
import SliderModel, { ISlider } from './slider.model';

/**
 * Service function to create a new slider.
 *
 * @param {Partial<ISlider>} data - The data to create a new slider.
 * @returns {Promise<Partial<ISlider>>} - The created slider.
 */
const createSlider = async (data: Partial<ISlider>): Promise<Partial<ISlider>> => {
  const newSlider = new SliderModel(data);
  const savedSlider = await newSlider.save();
  return savedSlider;
};

/**
 * Service function to update a single slider by ID.
 *
 * @param {string} id - The ID of the slider to update.
 * @param {Partial<ISlider>} data - The updated data for the slider.
 * @returns {Promise<Partial<ISlider>>} - The updated slider.
 */
const updateSlider = async (
  id: string,
  data: Partial<ISlider>
): Promise<Partial<ISlider | null>> => {
  const updatedSlider = await SliderModel.findByIdAndUpdate(id, data, { new: true });
  return updatedSlider;
};

/**
 * Service function to retrieve multiple slider based on query parameters.
 *
 * @param {object} query - The query parameters for filtering slider.
 * @returns {Promise<Partial<ISlider>[]>} - The retrieved slider.
 */
const getSliders = async (query: object): Promise<Partial<ISlider>[]> => {
  const slider = await SliderModel.find(query).populate({
    path: 'created_by',
    select: 'first_name last_name avatar',
  });
  return slider;
};

export const sliderServices = {
  createSlider,
  updateSlider,
  getSliders,
};


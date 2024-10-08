// Import the model
import { Response } from 'express';
import ms from 'ms';
import config from '../../config/config';
import EncodeToken from '../../utils/jwt/encode-token';
import UserModel from './user.model';

/**
 * Service function to update a single user by ID.
 *
 * @param id - The ID of the user to update.
 * @param data - The updated data for the user.
 * @returns {Promise<{ token: string, user: object }>} - The updated user and JWT token.
 */
const updateUser = async (res: Response, id: string, data: object) => {
  // Update the user and retrieve the updated document
  const user = await UserModel.findByIdAndUpdate(id, data, { new: true });

  if (!user) {
    throw new Error('User not found or failed to update');
  }

  // Generate JWT token
  const token = await EncodeToken(
    user.first_name as string,
    user.last_name as string,
    user.email as string,
    user.bio as string,
    user.designation as string,
    user.avatar as string,
    user._id as string,
    user.role as string
  );

  // Set token in response header
  res.set('authorization', `Bearer ${token}`);

  // Convert JWT expiration time to milliseconds using ms()
  const maxAgeInMs = ms(config.JWT_EXPIRATION_TIME);

  // Set token in response cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: maxAgeInMs,
  });

  // Return user data and token
  return {
    token,
    user: {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      designation: user.designation,
      avatar: user.avatar,
    },
  };
};

/**
 * Service function to get a single user and their gallery images using aggregation.
 *
 * @returns {Promise<object>} - The user with their gallery images as an array of strings.
 */
const aboutUser = async () => {
  // Stage 1: Match the user based on the criteria
  const matchStage = {
    $match: { showData: true },
  };

  // Stage 2: Lookup the gallery images from the Project collection
  const lookupStage = {
    $lookup: {
      from: 'projects', // The collection name for projects
      localField: '_id',
      foreignField: 'created_by',
      as: 'gallery',
    },
  };

  // Stage 3: Unwind the gallery array to work with individual project documents
  const unwindGalleryStage = {
    $unwind: {
      path: '$gallery',
      preserveNullAndEmptyArrays: true, // In case user has no gallery
    },
  };

  // Stage 4: Project the user fields and flatten the images
  const projectStage = {
    $project: {
      bio: 1,
      designation: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      avatar: 1,
      status: 1,
      role: 1,
      gallery: '$gallery.images',
    },
  };

  // Stage 5: Unwind the gallery images array to flatten it
  const unwindImagesStage = {
    $unwind: {
      path: '$gallery',
      preserveNullAndEmptyArrays: true, // Ensure users without images don't break the pipeline
    },
  };

  // Stage 6: Group to merge gallery images into a single array
  const groupStage = {
    $group: {
      _id: '$_id',
      bio: { $first: '$bio' },
      designation: { $first: '$designation' },
      first_name: { $first: '$first_name' },
      last_name: { $first: '$last_name' },
      email: { $first: '$email' },
      avatar: { $first: '$avatar' },
      status: { $first: '$status' },
      role: { $first: '$role' },
      gallery: { $push: '$gallery' },
    },
  };

  // Aggregation pipeline using the separated stages
  const user = await UserModel.aggregate([
    matchStage,
    lookupStage,
    unwindGalleryStage,
    projectStage,
    unwindImagesStage,
    groupStage,
  ]);

  return user[0];
};

/**
 * Service function to toggle the `showData` field for a user by ID.
 * If the updated `showData` value is `true`, set the `showData` field for all other users to `false`.
 *
 * @param {string} id - The ID of the user to update.
 * @returns {Promise<object>} - The updated user with the toggled `showData` value.
 */
const updateShowData = async (id: string) => {
  // Find the user by ID
  const user = await UserModel.findOne({ _id: id, showData: false });

  if (!user) {
    throw new Error('User not found or show data is not true');
  }

  // Reverse the `showData` field (if true, set to false, and vice versa)
  const newShowData = !user.showData;

  // Update the user's `showData` field
  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { showData: newShowData },
    { new: true }
  );

  // If the new `showData` is set to true, update all other users' `showData` to false
  if (newShowData) {
    await UserModel.updateMany(
      { _id: { $ne: id } }, // Exclude the updated user
      { showData: false }
    );
  }

  return updatedUser;
};

export const userServices = {
  updateUser,
  aboutUser,
  updateShowData,
};

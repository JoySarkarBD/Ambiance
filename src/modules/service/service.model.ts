import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a Service document
export interface IService extends Document {
  title: string;
  description: string;
  banner: string;
  thumbnail: string;
  reviews: number;
  rating: number;
  images: string[];
  created_by: mongoose.Types.ObjectId;
}

// Define the Service schema
const ServiceSchema: Schema<IService> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    reviews: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Create the Service model
const Service = mongoose.model<IService>('Service', ServiceSchema);

// Export the Service model
export default Service;


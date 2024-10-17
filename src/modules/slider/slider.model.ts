import mongoose, { Document, Schema } from 'mongoose';

// Define and export an interface representing a Slider document
export interface ISlider extends Document {
  type: string;
  images: string[];
  created_by: mongoose.Types.ObjectId;
}

// Define the Slider schema
const SliderSchema: Schema<ISlider> = new Schema(
  {
    type: {
      type: String,
      enum: ['hero', 'post'],
      required: true,
    },
    images: {
      type: [String],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the Slider model
const Slider = mongoose.model<ISlider>('Slider', SliderSchema);

// Export the Slider model

export default Slider;


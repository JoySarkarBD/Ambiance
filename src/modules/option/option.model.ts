import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a Option document
export interface IOption extends Document {
  _id: string;
  name: string;
  value: string;
  created_by: mongoose.Types.ObjectId;
}

// Define the Option schema
const OptionSchema: Schema<IOption> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
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

// Create the Option model
const Option = mongoose.model<IOption>('Option', OptionSchema);

// Export the Option model

export default Option;

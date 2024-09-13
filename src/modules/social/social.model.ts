import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a Social document
interface ISocial extends Document {
  _id: string;
  name: string;
  url: string;
  created_by: mongoose.Types.ObjectId;
}

// Define the Social schema
const SocialSchema: Schema<ISocial> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
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

// Create the Social model
const Social = mongoose.model<ISocial>('Social', SocialSchema);

// Export the Social model

export default Social;

import mongoose, { Document, Schema } from 'mongoose';

// Define an enum for social media platforms
enum SocialMedia {
  Facebook = 'Facebook',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
  LinkedIn = 'LinkedIn',
  YouTube = 'YouTube',
  TikTok = 'TikTok',
  Pinterest = 'Pinterest',
  GoogleBusiness = 'Google Business',
}

// Define an interface representing a Social document
export interface ISocial extends Document {
  _id: string;
  name: SocialMedia;
  url: string;
  created_by: mongoose.Types.ObjectId;
}

// Define the Social schema
const SocialSchema: Schema<ISocial> = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: Object.values(SocialMedia),
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

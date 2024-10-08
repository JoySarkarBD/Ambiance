import mongoose, { Document, Schema } from 'mongoose';

// Define an enum for option names
export enum OptionName {
  SiteUrl = 'site-url',
  SiteTitle = 'site-title',
  PrivacyPolicy = 'privacy-policy',
  Contact = 'contact',
  Email = 'email',
  TermsConditions = 'terms-conditions',
}

// Define an interface representing an Option document
export interface IOption extends Document {
  _id: string;
  name: OptionName; // Enum type for the name field
  value: string;
  created_by: mongoose.Types.ObjectId;
}

// Define the Option schema
const OptionSchema: Schema<IOption> = new Schema(
  {
    name: {
      type: String,
      enum: Object.values(OptionName),
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

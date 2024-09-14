import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a Faq document
export interface IFaq extends Document {
  data: null;
  _id: string;
  title: string;
  description: string;
  created_by: mongoose.Types.ObjectId;
}

// Define the Faq schema
const FaqSchema: Schema<IFaq> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
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

// Create the Faq model
const Faq = mongoose.model<IFaq>('Faq', FaqSchema);

// Export the Faq model

export default Faq;

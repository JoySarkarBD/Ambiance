import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a Faq document
interface IFaq extends Document {
  _id: string;
  title: string;
  description: string;
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


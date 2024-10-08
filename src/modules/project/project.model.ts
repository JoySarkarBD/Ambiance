import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a Project document
export interface IProject extends Document {
  title: string;
  url?: string;
  subject: string;
  skills: string[];
  images: string[];
  description: string;
  created_by: mongoose.Types.ObjectId;
}

// Define the Project schema
const ProjectSchema: Schema<IProject> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
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

// Create the Project model
const Project = mongoose.model<IProject>('Project', ProjectSchema);

// Export the Project model
export default Project;

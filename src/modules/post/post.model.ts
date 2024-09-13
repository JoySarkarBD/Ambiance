import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a Post document
export interface IPost extends Document {
  title: string;
  images: string[];
  banner: string;
  subtitle?: string | '';
  description: string;
  created_by: mongoose.Types.ObjectId;
}

// Define the Post schema
const PostSchema: Schema<IPost> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    banner: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
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

// Create the Post model
const Post = mongoose.model<IPost>('Post', PostSchema);

// Export the Post model
export default Post;


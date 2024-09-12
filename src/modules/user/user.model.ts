import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a User document
interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar?: string;
  status?: string;
  role: 'admin' | 'user';
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

// Export the User model
export default User;


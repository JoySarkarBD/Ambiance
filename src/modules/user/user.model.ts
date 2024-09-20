import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a User document
interface IUser extends Document {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  designation?: string;
  password: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  showData: boolean;
  role: 'admin' | 'user';
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
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
    bio: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    showData: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: '',
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
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

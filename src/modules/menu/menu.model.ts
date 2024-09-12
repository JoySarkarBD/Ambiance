import mongoose, { Document, Schema } from 'mongoose';

// Define an interface representing a Menu document
interface IMenu extends Document {
  title: string;
  url: string;
  target?: string | null;
  created_by: mongoose.Types.ObjectId;
}

// Define the Menu schema
const MenuSchema: Schema<IMenu> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: String,
      trim: true,
      default: null,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Create the Menu model
const Menu = mongoose.model<IMenu>('Menu', MenuSchema);

// Export the Menu model
export default Menu;


/**
 * Type definition for User.
 *
 * This type defines the structure of a single user object.
 * @interface TUser
 */
export interface TUser {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  avatar: string;
  status: string;
  role: 'admin' | 'user';
  createAt: Date;
  UpdatedAt: Date;
}


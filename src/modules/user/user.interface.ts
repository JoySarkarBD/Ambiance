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
  bio?: string;
  designation?: string;
  password?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  showData: boolean;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Type definition for Menu.
 *
 * This type defines the structure of a single menu object.
 * @interface TMenu
 */
export interface TMenu {
  _id: string;
  title: string;
  url: string;
  target: string | null;
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}


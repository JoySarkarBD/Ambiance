/**
 * Type definition for Social.
 *
 * This type defines the structure of a single social object.
 * @interface TSocial
 */
export interface TSocial {
  _id?: string;
  name: string;
  url: string;
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}

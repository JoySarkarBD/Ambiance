/**
 * Type definition for Option.
 *
 * This type defines the structure of a single option object.
 * @interface TOption
 */
export interface TOption {
  _id?: string;
  name: string;
  value: string;
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}

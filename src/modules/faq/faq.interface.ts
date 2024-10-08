/**
 * Type definition for Faq.
 *
 * This type defines the structure of a single faq object.
 * @interface TFaq
 */
export interface TFaq {
  _id?: string;
  title: string;
  description: string;
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}

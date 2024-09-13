/**
 * Type definition for Post.
 *
 * This type defines the structure of a single post object.
 * @interface TPost
 */
export interface TPost {
  title: string;
  images: string[];
  banner: string;
  subtitle: string | '';
  description: string;
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}


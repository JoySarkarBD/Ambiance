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
  subtitle: string | null;
  description: string;
  created_by: object;
  createdAt?: Date;
  updatedAt?: Date;
}


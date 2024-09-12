/**
 * Type definition for Service.
 *
 * This type defines the structure of a single service object.
 * @interface TService
 */
export interface TService {
  _id?: string;
  title: string;
  description: string;
  banner: string;
  thumbnail: string;
  reviews: number;
  rating: number;
  images?: string[];
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}


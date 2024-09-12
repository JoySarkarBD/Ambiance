/**
 * Type definition for Project.
 *
 * This type defines the structure of a single project object.
 * @interface TProject
 */
export interface TProject {
  _id: string;
  title: string;
  url: string;
  subject: string;
  skills: string[];
  description: string;
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}


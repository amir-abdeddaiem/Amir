import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  accType: 'regular' | 'provider';
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  birthDate: Date;
  location: string;
  coordinates?: {
    type: string;
    coordinates: [number, number];
  };
  phone: string;
  avatar?: string;
  bio?: string;
  // Provider specific fields
  businessName?: string;
  businessType?: string;
  services?: string[];
  certifications?: string;
  description?: string;
  website?: string;
  // Relations
  pets: Types.ObjectId[];
  posts: Types.ObjectId[];
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

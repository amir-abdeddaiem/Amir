import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  accType: 'regular' | 'provider'|'admin';
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
    businessType?: string;

  businessName?: string;
  boutiqueImage?: string,
  services?: string[];
  certifications?: string;
  description?: string;
  website?: string;
 status: 'authenticated'| 'unauthenticated';
  // Provider specific fields

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

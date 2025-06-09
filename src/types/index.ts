import { Types } from 'mongoose';

// export interface IUser {
//   _id: Types.ObjectId;
//   username: string;
//   email: string;
//   password: string;
//   pets: Types.ObjectId[];
//   createdAt: Date;
// }

// export interface IPet {
//   _id: Types.ObjectId;
//   owner: Types.ObjectId;
//   name: string;
//   species: string;
//   age: number;
//   photo?: string;
//   description?: string;
//   createdAt: Date;
// }

export interface ISwipe {
  _id: Types.ObjectId;
  swiperPet: Types.ObjectId;
  swipedPet: Types.ObjectId;
  action: 'like' | 'ignore' | 'super_like';
  createdAt: Date;
}

export interface IMatch {
  _id: Types.ObjectId;
  pet1: Types.ObjectId;
  pet2: Types.ObjectId;
  createdAt: Date;
}

export interface IMessage {
  _id: Types.ObjectId;
  matchId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  createdAt: Date;
}


///////////////////////////////////////////////////////////////////
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  location?: string
  accType: "regular" | "provider"
  businessName?: string
  businessType?: string
  services?: string[]
  certifications?: string
  website?: string
}

export interface Pet {
  id: string
  name: string
  breed: string
  age: number
  description: string
  image?: string
  ownerId: string
  createdAt: string
}

export interface MarketplacePost {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category: "pet" | "accessory" | "food" | "service"
  userId: string
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  image?: string
  providerId: string
  category: "veterinary" | "training" | "grooming" | "boarding"
}

export interface Appointment {
  id: string
  date: string
  time: string
  clientName: string
  serviceType: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
}

export interface LostFoundPost {
  id: string
  title: string
  description: string
  image?: string
  location: string
  type: "lost" | "found"
  userId: string
  createdAt: string
}


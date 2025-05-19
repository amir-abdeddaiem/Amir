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


// import mongoose from 'mongoose'

// let isConnected = false

// export const connectDB = async () => {
//   if (isConnected) {
//     console.log('Already connected to MongoDB')
//     return
//   }
//   try {
//     await mongoose.connect(process.env.DB_URL as string )
//     isConnected = true
//     console.log('MongoDB Connected...')
//   } catch (err: any) {
//     console.error(err.message)
//   }
// }
import mongoose from "mongoose";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      // Register models here
      User;
      Product;
      Review;
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export { connectDB };
import mongoose from "mongoose";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";
import { Match } from "@/models/Match";
import  SwipeAction  from "@/models/Swipe";
import { Message } from "@/models/Message";
import { Like } from "@/models/Like";
import { Favorite } from "@/models/Favorite";
import { Animal } from "@/models/Animal";
import { Recover } from "@/models/Recover";
import Appointment from "@/models/Service";
import { Reservation } from "@/models/Reservation";
import { BusinessProvider } from "@/models/BusnessProvider";


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
      Match;
      // SwipeAction;
      Recover;
      // Message;
      // Like;
      Favorite;
      Animal;
      SwipeAction;
      Appointment;
      Reservation;
      // BusinessProvider;

      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export { connectDB };
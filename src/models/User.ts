// models/User.ts
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  accType: { type: String, enum: ['regular', 'provider'], default: 'regular' },
  birthDate: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  lastName: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  password: { type: String, required: true, select: false }, // Never returned by default
  phone: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  // Provider specific fields
  businessName: { type: String },
  businessType: { type: String },
  services: [{ type: String }],
  certifications: { type: String },
  description: { type: String },
  website: { type: String },
  // Relations
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
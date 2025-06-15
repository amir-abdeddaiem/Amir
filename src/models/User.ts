// models/User.ts
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  accType: { type: String, enum: ['regular', 'provider','admin'] },
  birthDate: { type: Date},
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required:true },
  gender: { type: String, required: false },
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
  password: { type: String, required: true },
  phone: { type: String, required: true },
  avatar: { type: String },
  boutiqueImage: { type: String },
  bio: { type: String },
  status: { type: String, enum: ['authenticated', 'unauthenticated'], default: 'unauthenticated' },
  // Provider specific fields
  businessName: { type: String },
  businessType: { type: String, enum: ['veterinarian', 'trainer', 'groomer', 'shelter', 'daycare', 'shop'] },
  services: [{ type: String }],
  certifications: { type: String },
  description: { type: String },
  website: { type: String },
  // Relations

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10)
  }
  next()
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
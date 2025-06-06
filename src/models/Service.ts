import mongoose, { Schema, type Document } from "mongoose"

export interface IService extends Document {
  providerId: mongoose.Types.ObjectId
  name: string
  type: "Veterinary" | "Grooming" | "Training" | "Pet Sitting" | "Boarding" | "Walking"
  description: string
  price: {
    min: number
    max: number
    currency: string
  }
  duration: number // in minutes
  location: {
    address: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  images: string[]
  rating: number
  reviewCount: number
  isActive: boolean
  availability: {
    dayOfWeek: number // 0-6 (Sunday-Saturday)
    timeSlots: string[] // ["09:00", "10:00", etc.]
  }[]
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema<IService>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Veterinary", "Grooming", "Training", "Pet Sitting", "Boarding", "Walking"],
    },
    description: { type: String, required: true },
    price: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },
    duration: { type: Number, required: true }, // in minutes
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    availability: [
      {
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
        timeSlots: [{ type: String }],
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for location-based queries
ServiceSchema.index({ "location.coordinates": "2dsphere" })
ServiceSchema.index({ type: 1, isActive: 1 })
ServiceSchema.index({ providerId: 1 })

export const Service = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema)

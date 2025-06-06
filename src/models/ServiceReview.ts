import mongoose, { Schema, type Document } from "mongoose"

export interface IServiceReview extends Document {
  customerId: mongoose.Types.ObjectId
  serviceId: mongoose.Types.ObjectId
  providerId: mongoose.Types.ObjectId
  reservationId: mongoose.Types.ObjectId
  rating: number
  comment: string
  images: string[]
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
}

const ServiceReviewSchema = new Schema<IServiceReview>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }],
    isVisible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

ServiceReviewSchema.index({ serviceId: 1, isVisible: 1 })
ServiceReviewSchema.index({ providerId: 1, isVisible: 1 })
ServiceReviewSchema.index({ customerId: 1 })

export const ServiceReview =
  mongoose.models.ServiceReview || mongoose.model<IServiceReview>("ServiceReview", ServiceReviewSchema)

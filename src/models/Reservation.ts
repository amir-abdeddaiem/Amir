import mongoose, { Schema, type Document } from "mongoose"

export interface IReservation extends Document {
  customerId: mongoose.Types.ObjectId
  serviceId: mongoose.Types.ObjectId
  providerId: mongoose.Types.ObjectId
  petId: mongoose.Types.ObjectId
  date: Date
  timeSlot: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show"
  totalPrice: number
  currency: string
  notes: string
  cancellationReason?: string
  createdAt: Date
  updatedAt: Date
}

const ReservationSchema = new Schema<IReservation>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    petId: { type: Schema.Types.ObjectId, ref: "Animal", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // "09:00", "14:30", etc.
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "completed", "cancelled", "no-show"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    notes: { type: String, default: "" },
    cancellationReason: { type: String },
  },
  {
    timestamps: true,
  },
)

// Indexes
ReservationSchema.index({ customerId: 1, date: -1 })
ReservationSchema.index({ providerId: 1, date: -1 })
ReservationSchema.index({ serviceId: 1, date: 1 })
ReservationSchema.index({ date: 1, timeSlot: 1 })

export const Reservation = mongoose.models.Reservation || mongoose.model<IReservation>("Reservation", ReservationSchema)

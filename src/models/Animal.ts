import mongoose from 'mongoose'

const AnimalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true ,enum: ['male', 'female', 'other']},
  weight: { type: String },
  description: { type: String, required: true },
  vaccinated: { type: Boolean, required: true },
  neutered: { type: Boolean, required: true },
  microchipped: { type: Boolean},
  friendly: { type: Boolean, required: true },
  image: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

AnimalSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const Animal = mongoose.models.Animal || mongoose.model('Animal', AnimalSchema)
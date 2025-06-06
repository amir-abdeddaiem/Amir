import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  message: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
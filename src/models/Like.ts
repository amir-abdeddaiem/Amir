// models/Like.ts
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  petliker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  petliked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure each like is unique
likeSchema.index({ petliker: 1, petliked: 1 }, { unique: true });

// Optional: update `updatedAt` before save
likeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
// models/Like.ts
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  pet1: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  pet2: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

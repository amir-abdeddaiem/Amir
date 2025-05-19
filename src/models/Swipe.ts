import mongoose from 'mongoose';

const swipeSchema = new mongoose.Schema({
  swiperPet: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  swipedPet: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  action: { type: String, enum: ['like', 'ignore', 'super_like'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Swipe = mongoose.models.Swipe || mongoose.model('Swipe', swipeSchema);




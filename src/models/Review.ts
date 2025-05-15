import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  stars: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  message: { 
    type: String, 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
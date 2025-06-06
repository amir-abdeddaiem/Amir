import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },


  createdAt: { type: Date, default: Date.now }
});

export const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
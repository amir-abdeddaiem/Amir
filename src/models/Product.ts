import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { 
  timestamps: true // Automatically adds `createdAt` and `updatedAt`
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
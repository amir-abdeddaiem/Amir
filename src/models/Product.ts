import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true }, 
  category: { type: String, required: true },
  localisation: { type: String },
  featured: { type: Boolean, required: true },
  petType: { type: String, required: true },

  quantity: { type: Number, required: true },
  specifications: [{
    key: String,
    value: String
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
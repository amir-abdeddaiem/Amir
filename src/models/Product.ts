import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  category: { type: String, required: true },
  localisation: { type: String },
  featured: { type: Boolean, required: true },
  petType: { type: String, required: true },
  quantity: { type: Number, required: true },
  specifications: [{
    key: String,
    value: String
  }],
  breed: { type: String, required: [true, 'Breed is required'] },
  age: { type: String, required: [true, 'Age is required'] },
  gender: { 
    type: String, 
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be either male, female, or other'
    }
  },
  weight: { type: String },
  HealthStatus: {
    vaccinated: { type: Boolean },
    neutered: { type: Boolean},
    microchipped: { type: Boolean },
  },
  friendly: {
    children: { type: Boolean, default: false },
    dogs: { type: Boolean, default: false },
    cats: { type: Boolean, default: false },
    animals: { type: Boolean, default: false }
  },
  Color :{type: String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingType: { 
    type: String, 
    enum: ['sale', 'adoption'], 
    required: true, 
    default: 'sale' 
  }, // To differentiate between sale and adoption
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
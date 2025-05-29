import mongoose from 'mongoose';

const AnimalSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  type: { type: String, required: [true, 'Type is required'] },
  breed: { type: String, required: [true, 'Breed is required'] },
  birthDate: { type: Date },
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
  description: { type: String, required: [true, 'Description is required'] },
  HealthStatus: {
    vaccinated: { type: Boolean, required: [true, 'Vaccinated status is required'] },
    neutered: { type: Boolean, required: [true, 'Neutered status is required'] },
    microchipped: { type: Boolean },
  },
  friendly: {
    children: { type: Boolean, default: false },
    dogs: { type: Boolean, default: false },
    cats: { type: Boolean, default: false },
    animals: { type: Boolean, default: false }
  },
  image: { type: String},
  // image: { type: String, required: [true, 'Image is required'] },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Owner is required'] 
  },
  inmatch :  {type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
  
AnimalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Animal = mongoose.models.Animal || mongoose.model('Animal', AnimalSchema);
import mongoose from 'mongoose';

const AnimalSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  type: { type: String, required: [true, 'Type is required'] },
  breed: { type: String, required: [true, 'Breed is required'] },
  // birthDate: { type: Date },
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
  description: { type: String },
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
  image: { type: String},
  // image: { type: String, required: [true, 'Image is required'] },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Owner is required'] 
  },
  Color :{type: String},
  inmatch :  {type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
  
AnimalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

AnimalSchema.index({ name: 1, owner: 1 }, { unique: true });


export const Animal = mongoose.models.Animal || mongoose.model('Animal', AnimalSchema);
// models/FoundAnimal.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IFoundAnimal extends Document {
  color?: string;
  image: string;
  description?: string;
  breed?: string;
  gender?: string;
  type?: string;
}

const FoundAnimalSchema: Schema = new Schema({
  color: { type: String },
  image: { type: String},
  description: { type: String},
  breed: { type: String},
  gender: { type: String},
  type: { type: String},
});

export const FoundAnimal = models.FoundAnimal || model<IFoundAnimal>('FoundAnimal', FoundAnimalSchema);

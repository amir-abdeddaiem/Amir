// models/FoundAnimal.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IFoundAnimal extends Document {
  color: string;
  image: string;
  description: string;
  breed: string;
  gender: string;
  type: string;
}

const FoundAnimalSchema: Schema = new Schema({
  color: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  breed: { type: String, required: true },
  gender: { type: String, required: true },
  type: { type: String, required: true },
});

export const FoundAnimal = models.FoundAnimal || model<IFoundAnimal>('FoundAnimal', FoundAnimalSchema);

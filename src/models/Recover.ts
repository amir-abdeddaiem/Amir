import mongoose, { Schema, Document, models } from 'mongoose';

// Optional: Define TypeScript interface for type safety
export interface IRecover extends Document {
  email: string;
  digits: string;
  date: Date;
}

const RecoverSchema = new Schema<IRecover>({
  email: { type: String, required: true },
  digits: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

// Prevent model overwrite in development (important for Next.js hot reload)
export const Recover = models.Recover || mongoose.model<IRecover>('Recover', RecoverSchema);

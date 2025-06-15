import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    pet1: { type: mongoose.Types.ObjectId, ref: 'Animal', required: true },
    pet2: { type: mongoose.Types.ObjectId, ref: 'Animal', required: true },
    owner1: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    owner2: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Ensure unique matches (order-agnostic)
matchSchema.index(
  { pet1: 1, pet2: 1 },
  {
    unique: true,
    partialFilterExpression: { pet1: { $lt: '$pet2' } }, // Ensure pet1 < pet2 to avoid duplicates
  }
);

export const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);
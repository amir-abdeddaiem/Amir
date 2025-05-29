import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  pet1: { type: mongoose.Types.ObjectId, ref: 'Animal', required: true },
  pet2: { type: mongoose.Types.ObjectId, ref: 'Animal', required: true },
}, { timestamps: true });

matchSchema.index({ pet1: 1, pet2: 1 }, { unique: true });

export const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);

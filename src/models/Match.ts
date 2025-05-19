import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  pet1: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  pet2: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);



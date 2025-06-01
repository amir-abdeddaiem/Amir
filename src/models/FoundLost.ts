// models/FoundLost.ts
import mongoose from 'mongoose';

const LostFoundSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['lost', 'found'],
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function (this: any) {
      return this.status === 'lost';
    },
  },
  contactInfo: {
    name: {
      type: String,
      required: function (this: any) {
        return this.status === 'found' && !this.reporter;
      },
    },
    phone: {
      type: String,
      required: function (this: any) {
        return this.status === 'found' && !this.reporter;
      },
    },
    email: {
      type: String,
      required: function (this: any) {
        return this.status === 'found' && !this.reporter;
      },
    },
  },
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: function (this: any) {
      return this.status === 'lost';
    },
  },
  foundDetails: {
    species: {
      type: String,
      required: function (this: any) {
        return this.status === 'found';
      },
    },
    color: {
      type: String,
      required: function (this: any) {
        return this.status === 'found';
      },
    },
    photo: {
      type: String,
      required: function (this: any) {
        return this.status === 'found';
      },
    },
  },
  location: {
    type: String,
    required: true,
  },
  description: String,
  photos: [String],
}, {
  timestamps: true,
});

export const FoundLost = mongoose.models.FoundLost || mongoose.model('FoundLost', LostFoundSchema);

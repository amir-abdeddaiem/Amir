import mongoose, { Document } from 'mongoose';

export type SwipeType = 'like' | 'superlike' | 'ignore';

export interface ISwipeAction extends Document {
  swiper: mongoose.Types.ObjectId; // Animal who swiped
  swiped: mongoose.Types.ObjectId; // Animal who was swiped on
  actionType: SwipeType;
  createdAt: Date;
}

const swipeActionSchema = new mongoose.Schema<ISwipeAction>(
  {
    swiper: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    swiped: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    actionType: {
      type: String,
      enum: ['like', 'superlike', 'ignore'],
      required: true,
    },
  },
  { timestamps: true }
);

// Index to prevent duplicate swipes
swipeActionSchema.index({ swiper: 1, swiped: 1 }, { unique: true });

export default mongoose.models.SwipeAction || mongoose.model<ISwipeAction>('SwipeAction', swipeActionSchema);
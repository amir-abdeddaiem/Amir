import mongoose, { Document } from 'mongoose';

export type SwipeType = 'like' | 'superlike' | 'ignore';

export interface ISwipeAction extends Document {
  swiper: mongoose.Types.ObjectId; // User who owns the swiperpet
  swiperpet: mongoose.Types.ObjectId; // Animal performing the swipe
  swipedpet: mongoose.Types.ObjectId; // Animal being swiped on
  actionType: SwipeType;
  createdAt: Date;
}

const swipeActionSchema = new mongoose.Schema<ISwipeAction>(
  {
    swiper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    swiperpet: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    swipedpet: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    actionType: {
      type: String,
      enum: ['like', 'superlike', 'ignore'],
      required: true,
    },
  },
  { timestamps: true }
);

// Index to prevent duplicate swipes
swipeActionSchema.index({ swiperpet: 1, swipedpet: 1 }, { unique: true });

export default mongoose.models.SwipeAction || mongoose.model<ISwipeAction>('SwipeAction', swipeActionSchema);
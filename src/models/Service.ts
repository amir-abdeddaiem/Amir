import { Document, Model, Schema, model, models } from 'mongoose';



const appointmentSchema = new Schema({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  date: {
    type: Date,
    required: true
  },
  times: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add indexes
appointmentSchema.index({ providerId: 1, date: 1 });
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ date: 1, status: 1 });

const Appointment: Model<any> = models.Appointment || model('Appointment', appointmentSchema);

export default Appointment;
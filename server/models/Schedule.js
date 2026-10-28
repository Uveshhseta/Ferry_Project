import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true
    },
    ferry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ferry'
    },
    departure: {
      type: String,
      required: true
    },
    peak: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['on-time', 'boarding', 'delayed', 'cancelled', 'scheduled', 'completed', 'On Time', 'Boarding', 'Delayed', 'Cancelled', 'Scheduled', 'Completed'],
      default: 'on-time'
    },
    delayMinutes: {
      type: Number,
      default: 0
    },
    gate: {
      type: String,
      default: 'Gate 2'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'schedules'
  }
);

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);

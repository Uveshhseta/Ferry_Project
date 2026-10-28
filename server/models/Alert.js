import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    severity: {
      type: String,
      enum: ['urgent', 'advisory', 'info', 'peak', 'normal', 'warning', 'notice', 'Urgent', 'Warning', 'Advisory', 'Notice', 'Normal'],
      default: 'advisory'
    },
    active: {
      type: Boolean,
      default: true
    },
    route: {
      type: String,
      default: 'System-Wide'
    }
  },
  {
    timestamps: true,
    collection: 'alerts'
  }
);

// Virtual to ensure message / body fallback
alertSchema.virtual('displayMessage').get(function() {
  return this.message || this.body || '';
});

export default mongoose.models.Alert || mongoose.model('Alert', alertSchema);

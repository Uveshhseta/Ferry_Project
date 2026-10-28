import mongoose from 'mongoose';

const ferrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      default: 750
    },
    status: {
      type: String,
      enum: ['operational', 'standby', 'maintenance', 'in-service'],
      default: 'operational'
    },
    currentLoad: {
      type: Number,
      default: 0
    },
    assignedRoute: {
      type: String,
      default: 'Centre Island'
    },
    captain: {
      type: String,
      default: 'Capt. R. Campbell'
    },
    type: {
      type: String,
      default: 'Double-Ended Passenger'
    },
    yearBuilt: {
      type: Number,
      default: 1939
    }
  },
  {
    timestamps: true,
    collection: 'ferries'
  }
);

export default mongoose.models.Ferry || mongoose.model('Ferry', ferrySchema);

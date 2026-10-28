import mongoose from 'mongoose';

const terminalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    terminals: [terminalSchema],
    seasonal: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default: ''
    },
    durationMinutes: {
      type: Number,
      default: 15
    },
    distanceKm: {
      type: Number,
      default: 2.1
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'routes'
  }
);

export default mongoose.models.Route || mongoose.model('Route', routeSchema);

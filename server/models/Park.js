import mongoose from 'mongoose';

const parkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'Family Attractions'
    },
    destination: {
      type: String,
      default: 'Centre Island'
    },
    area: {
      type: String,
      default: 'Toronto Island'
    },
    type: {
      type: String,
      default: 'Park & Destination'
    },
    description: {
      type: String,
      default: ''
    },
    features: [{ type: String }],
    amenities: [{ type: String }],
    hours: {
      type: String,
      default: 'Dawn to Dusk'
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 1200
    },
    image: {
      type: String,
      default: '/images/centre-island.jpg'
    },
    distanceFromDock: {
      type: String,
      default: '5 min walk from Ferry Dock'
    },
    accessible: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'parks'
  }
);

export default mongoose.models.Park || mongoose.model('Park', parkSchema);

import mongoose from 'mongoose';

const passengerDetailSchema = new mongoose.Schema({
  fullName: { type: String, trim: true, default: '' },
  type: { type: String, default: 'Adult' },
  isLead: { type: Boolean, default: false }
});

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    ticketCode: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contactName: {
      type: String,
      trim: true,
      default: ''
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    contactPhone: {
      type: String,
      trim: true,
      default: ''
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule'
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route'
    },
    from: {
      type: String,
      default: 'Jack Layton Ferry Terminal'
    },
    to: {
      type: String,
      default: 'Centre Island'
    },
    date: {
      type: String,
      required: true
    },
    departureTime: {
      type: String,
      default: '15:45'
    },
    tripType: {
      type: String,
      enum: ['single', 'round'],
      default: 'round'
    },
    passengers: {
      type: Number,
      required: true,
      default: 1
    },
    passengerBreakdown: {
      adult: { type: Number, default: 1 },
      senior: { type: Number, default: 0 },
      youth: { type: Number, default: 0 },
      junior: { type: Number, default: 0 },
      infant: { type: Number, default: 0 },
      bicycle: { type: Number, default: 0 }
    },
    passengerDetails: [passengerDetailSchema],
    pricing: {
      baseFare: { type: Number, default: 0 },
      taxRatePercent: { type: Number, default: 5 },
      taxAmount: { type: Number, default: 0 },
      taxLabel: { type: String, default: 'GST' },
      harbourFee: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      currency: { type: String, default: 'CAD' }
    },
    payment: {
      provider: { type: String, default: 'card-simulator' },
      status: {
        type: String,
        enum: ['paid', 'pending', 'refunded', 'failed'],
        default: 'paid'
      },
      transactionId: { type: String, default: '' },
      paidAt: { type: Date, default: Date.now }
    },
    status: {
      type: String,
      enum: ['confirmed', 'active', 'completed', 'cancelled', 'refunded'],
      default: 'confirmed'
    },
    qrPayload: {
      type: String,
      default: ''
    },
    gate: {
      type: String,
      default: 'Gate 2'
    },
    vessel: {
      type: String,
      default: 'MV Sam McBride'
    }
  },
  {
    timestamps: true,
    collection: 'bookings'
  }
);

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

import express from 'express';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Route from '../models/Route.js';
import PricingSettings from '../models/PricingSettings.js';
import AuditLog from '../models/AuditLog.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { getOrCreatePricingSettings } from './pricing.js';

const router = express.Router();

// Generate unique Ticket Code and Booking Reference
const generateTicketCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

const generateBookingReference = () => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `TO-BK-${num}`;
};

// GET /api/bookings/my - Get authenticated user's bookings
router.get('/my', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('schedule')
      .populate('route')
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    return res.status(500).json({ error: 'Failed to retrieve your tickets and bookings.' });
  }
});

// GET /api/bookings/:id - Get single booking details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('schedule')
      .populate('route')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Check ownership or admin role
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'staff';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this booking.' });
    }

    return res.json({ booking });
  } catch (err) {
    console.error('Error fetching booking:', err);
    return res.status(500).json({ error: 'Failed to retrieve booking details.' });
  }
});

// POST /api/bookings - Create and persist a new booking
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      from,
      to,
      date,
      departureTime,
      tripType,
      scheduleId,
      routeId,
      adults = 1,
      seniors = 0,
      youth = 0,
      juniors = 0,
      infants = 0,
      bicycles = 0,
      contactName,
      contactEmail,
      contactPhone,
      passengerDetails = [],
      paymentMethod = 'test-simulator'
    } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Travel date is required.' });
    }

    if (from && to && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      return res.status(400).json({ error: 'Origin and destination terminals cannot be the same.' });
    }

    // Duplicate submission prevention (within 4 seconds for same user and slot)
    const recentDuplicate = await Booking.findOne({
      user: req.user._id,
      date,
      departureTime: departureTime || '15:45',
      createdAt: { $gte: new Date(Date.now() - 4000) }
    });
    if (recentDuplicate) {
      return res.status(409).json({ error: 'A duplicate booking submission was detected. Please check your existing tickets.' });
    }

    const adultCount = Math.max(0, parseInt(adults, 10) || 0);
    const seniorCount = Math.max(0, parseInt(seniors, 10) || 0);
    const youthCount = Math.max(0, parseInt(youth, 10) || 0);
    const juniorCount = Math.max(0, parseInt(juniors, 10) || 0);
    const infantCount = Math.max(0, parseInt(infants, 10) || 0);
    const bicycleCount = Math.max(0, parseInt(bicycles, 10) || 0);

    const totalPassengerCount = adultCount + seniorCount + youthCount + juniorCount + infantCount;
    if (totalPassengerCount === 0) {
      return res.status(400).json({ error: 'At least one passenger ticket is required.' });
    }

    // Capacity verification against vessel capacity limits
    let targetCapacity = 750; // standard passenger ferry capacity default
    if (scheduleId) {
      const matchedSchedule = await Schedule.findById(scheduleId).populate('ferry');
      if (matchedSchedule?.ferry?.capacity) {
        targetCapacity = matchedSchedule.ferry.capacity;
      }
    } else if (departureTime) {
      const matchedSchedule = await Schedule.findOne({
        departure: departureTime.split(' ')[0],
        active: { $ne: false }
      }).populate('ferry');
      if (matchedSchedule?.ferry?.capacity) {
        targetCapacity = matchedSchedule.ferry.capacity;
      }
    }

    // Check currently booked passenger count for this specific sailing slot
    const slotBookings = await Booking.find({
      date,
      departureTime: departureTime || '15:45',
      status: { $in: ['confirmed', 'active'] }
    });
    const currentBookedSeats = slotBookings.reduce((sum, b) => sum + (b.passengers || 1), 0);
    if (currentBookedSeats + totalPassengerCount > targetCapacity) {
      return res.status(400).json({
        error: `Selected sailing departure is at full capacity (${currentBookedSeats}/${targetCapacity} seats booked). Please select an alternate sailing time.`
      });
    }

    // Fetch official server pricing and tax settings from MongoDB
    const settings = await getOrCreatePricingSettings();
    const fares = settings.fares;
    const taxPercent = settings.taxPercent || 5.0;
    const taxLabel = settings.taxLabel || 'GST';
    const currency = settings.currency || 'CAD';
    const harbourFee = settings.harbourFee !== undefined ? settings.harbourFee : 0.75;

    // Calculate fare safely on backend
    const tripMultiplier = tripType === 'round' ? 2 : 1;
    const singleTripBase = (
      (adultCount * (fares.adult?.price || 9.11)) +
      (seniorCount * (fares.senior?.price || 5.86)) +
      (youthCount * (fares.youth?.price || 5.86)) +
      (juniorCount * (fares.junior?.price || 4.29)) +
      (infantCount * (fares.infant?.price || 0))
    );
    const baseFare = parseFloat((singleTripBase * tripMultiplier).toFixed(2));
    const taxAmount = parseFloat((baseFare * (taxPercent / 100)).toFixed(2));
    const totalAmount = parseFloat((baseFare + taxAmount + (baseFare > 0 ? harbourFee : 0)).toFixed(2));

    // Generate verified ticket code and unique reference
    const ticketCode = generateTicketCode();
    const bookingReference = generateBookingReference();

    // Verifiable QR payload
    const qrPayload = `TORONTO-ISLAND-FERRY:TICKET:${ticketCode}:${bookingReference}:${req.user._id}`;

    // Format passenger details and contact identity
    const leadName = (contactName || (passengerDetails[0] && passengerDetails[0].fullName) || req.user.name || '').trim();
    const leadEmail = (contactEmail || req.user.email || '').trim().toLowerCase();
    const leadPhone = (contactPhone || req.user.phone || '').trim();

    let formattedPassengers = [];
    if (Array.isArray(passengerDetails) && passengerDetails.length > 0) {
      formattedPassengers = passengerDetails.map((p, idx) => ({
        fullName: (p.fullName || '').trim() || (idx === 0 ? leadName : `${leadName} (Guest ${idx + 1})`),
        type: p.type || 'Adult',
        isLead: idx === 0
      }));
    } else {
      formattedPassengers.push({
        fullName: leadName,
        type: 'Adult',
        isLead: true
      });
    }

    const newBooking = await Booking.create({
      bookingReference,
      ticketCode,
      user: req.user._id,
      contactName: leadName,
      contactEmail: leadEmail,
      contactPhone: leadPhone,
      schedule: scheduleId || null,
      route: routeId || null,
      from: from || 'Jack Layton Ferry Terminal',
      to: to || 'Centre Island',
      date,
      departureTime: departureTime || '15:45',
      tripType: tripType === 'single' ? 'single' : 'round',
      passengers: totalPassengerCount,
      passengerBreakdown: {
        adult: adultCount,
        senior: seniorCount,
        youth: youthCount,
        junior: juniorCount,
        infant: infantCount,
        bicycle: bicycleCount
      },
      passengerDetails: formattedPassengers,
      pricing: {
        baseFare,
        taxRatePercent: taxPercent,
        taxAmount,
        taxLabel,
        harbourFee: baseFare > 0 ? harbourFee : 0,
        totalAmount,
        currency
      },
      payment: {
        provider: paymentMethod === 'presto' ? 'PRESTO Card Transit Simulator' : 'Test Mode Instant Clearance (Simulator)',
        status: 'paid',
        transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        paidAt: new Date()
      },
      status: 'confirmed',
      qrPayload,
      gate: (from && from.includes('Jack Layton')) ? 'Gate 2' : 'Island Dock Slip',
      vessel: 'MV Sam McBride'
    });

    const populated = await Booking.findById(newBooking._id)
      .populate('schedule')
      .populate('route')
      .populate('user', 'name email phone');

    return res.status(201).json({
      message: 'Booking confirmed and ticket generated successfully.',
      booking: populated
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    return res.status(500).json({ error: 'Failed to process booking. Please try again.' });
  }
});

// POST /api/bookings/:id/cancel - Cancel booking
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'staff';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to cancel this booking.' });
    }

    if (booking.status === 'cancelled' || booking.status === 'refunded') {
      return res.status(400).json({ error: 'This booking has already been cancelled.' });
    }

    booking.status = 'cancelled';
    booking.payment.status = 'refunded';
    await booking.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'CANCEL_BOOKING',
      targetEntity: 'Booking',
      targetId: booking._id.toString(),
      details: {
        ticketCode: booking.ticketCode,
        bookingReference: booking.bookingReference,
        cancelledBy: isAdmin ? 'Admin' : 'Customer'
      }
    });

    return res.json({ message: 'Booking has been cancelled and refunded.', booking });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    return res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

export default router;

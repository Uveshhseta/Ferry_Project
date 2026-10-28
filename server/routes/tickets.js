import express from 'express';
import Booking from '../models/Booking.js';
import { requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/tickets/verify/:code - Verify ticket code or QR payload
router.get('/verify/:code', async (req, res) => {
  try {
    const rawCode = req.params.code.trim();
    // Support either clean ticketCode e.g. 1BEE61AD or full QR payload TORONTO-ISLAND-FERRY:TICKET:1BEE61AD:...
    let codeToSearch = rawCode;
    if (rawCode.includes(':')) {
      const parts = rawCode.split(':');
      codeToSearch = parts[2] || parts[1] || rawCode;
    }

    const booking = await Booking.findOne({
      $or: [
        { ticketCode: new RegExp(`^${codeToSearch}$`, 'i') },
        { bookingReference: new RegExp(`^${codeToSearch}$`, 'i') }
      ]
    })
      .populate('user', 'name email phone')
      .populate('route')
      .populate('schedule');

    if (!booking) {
      return res.status(404).json({
        valid: false,
        status: 'NOT_FOUND',
        message: 'No active transit ticket found for this code in the City Registry.'
      });
    }

    let validity = 'VALID';
    if (booking.status === 'cancelled') validity = 'CANCELLED';
    if (booking.status === 'refunded') validity = 'REFUNDED';
    if (booking.status === 'completed') validity = 'ALREADY_USED';

    return res.json({
      valid: validity === 'VALID',
      status: validity,
      ticketCode: booking.ticketCode,
      bookingReference: booking.bookingReference,
      passengerName: booking.user?.name || 'Ferry Passenger',
      passengerEmail: booking.user?.email || '',
      passengers: booking.passengers,
      passengerBreakdown: booking.passengerBreakdown,
      route: `${booking.from} ➔ ${booking.to}`,
      date: booking.date,
      departureTime: booking.departureTime,
      gate: booking.gate,
      vessel: booking.vessel,
      pricing: booking.pricing
    });
  } catch (err) {
    console.error('Error verifying ticket:', err);
    return res.status(500).json({ error: 'Failed to verify ticket.' });
  }
});

// POST /api/tickets/scan - Record gate turnstile scan (Admin/Staff)
router.post('/scan', requireAdmin, async (req, res) => {
  try {
    const { ticketCode, gate = 'Gate 2' } = req.body;
    if (!ticketCode) {
      return res.status(400).json({ error: 'Ticket code is required for scan.' });
    }

    const cleanCode = ticketCode.trim();
    let search = cleanCode;
    if (cleanCode.includes(':')) {
      const parts = cleanCode.split(':');
      search = parts[2] || parts[1] || cleanCode;
    }

    const booking = await Booking.findOne({
      $or: [
        { ticketCode: new RegExp(`^${search}$`, 'i') },
        { bookingReference: new RegExp(`^${search}$`, 'i') }
      ]
    }).populate('user', 'name email');

    const scanRecord = {
      id: `SCN-${Date.now().toString().slice(-4)}`,
      passId: search,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gate,
      timestamp: new Date()
    };

    if (!booking) {
      scanRecord.status = 'INVALID';
      scanRecord.details = 'Not registered in Waterfront Transit Database';
      return res.status(404).json({ scan: scanRecord, error: 'Ticket not found.' });
    }

    if (booking.status === 'cancelled' || booking.status === 'refunded') {
      scanRecord.status = 'REJECTED';
      scanRecord.details = `Ticket is ${booking.status.toUpperCase()}`;
      return res.status(400).json({ scan: scanRecord, error: scanRecord.details });
    }

    // Mark as active or completed
    scanRecord.status = 'VALID';
    scanRecord.details = `${booking.user?.name} • ${booking.passengers} Passenger(s)`;
    booking.status = 'active';
    await booking.save();

    return res.json({ scan: scanRecord, booking });
  } catch (err) {
    console.error('Scan error:', err);
    return res.status(500).json({ error: 'Gate scanner error.' });
  }
});

export default router;

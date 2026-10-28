import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Ferry from '../models/Ferry.js';
import Alert from '../models/Alert.js';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply requireAdmin to all admin routes
router.use(requireAdmin);

// GET /api/admin/stats - Overview metrics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const activeAlerts = await Alert.countDocuments({ active: { $ne: false } });
    const operationalFerries = await Ferry.countDocuments({ status: { $in: ['operational', 'in-service'] } });
    const totalFerries = await Ferry.countDocuments();
    const scheduledRuns = await Schedule.countDocuments({ active: { $ne: false } });

    // Aggregate passengers and revenue from confirmed bookings
    const bookings = await Booking.find({ status: { $in: ['confirmed', 'active', 'completed'] } });
    const totalPassengers = bookings.reduce((sum, b) => sum + (b.passengers || 1), 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);
    const totalTaxCollected = bookings.reduce((sum, b) => sum + (b.pricing?.taxAmount || 0), 0);

    return res.json({
      stats: {
        totalUsers,
        totalBookings,
        totalPassengers,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalTaxCollected: parseFloat(totalTaxCollected.toFixed(2)),
        activeAlerts,
        operationalFerries,
        totalFerries,
        scheduledRuns
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin stats.' });
  }
});

// GET /api/admin/users - User management list & search
router.get('/users', async (req, res) => {
  try {
    const { search, role } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// PUT /api/admin/users/:id - Edit user role or toggle active state
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { role, isActive, name, phone } = req.body;
    if (role && ['citizen', 'staff', 'admin'].includes(role)) {
      user.role = role;
    }
    if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
    }
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_USER_ACCOUNT',
      targetEntity: 'User',
      targetId: user._id.toString(),
      details: { email: user.email, role: user.role, isActive: user.isActive }
    });

    return res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ error: 'Failed to update user account.' });
  }
});

// GET /api/admin/bookings - List all bookings with search and filters
router.get('/bookings', async (req, res) => {
  try {
    const { search, status, date } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (date) {
      filter.date = date;
    }

    if (search) {
      const usersMatching = await User.find({
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      }).select('_id');

      filter.$or = [
        { ticketCode: new RegExp(search, 'i') },
        { bookingReference: new RegExp(search, 'i') },
        { contactName: new RegExp(search, 'i') },
        { contactEmail: new RegExp(search, 'i') },
        { 'passengerDetails.fullName': new RegExp(search, 'i') },
        { user: { $in: usersMatching.map(u => u._id) } }
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('schedule')
      .populate('route')
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({ bookings });
  } catch (err) {
    console.error('Error fetching admin bookings:', err);
    return res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

// GET /api/admin/audit-logs - Audit trail
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('adminUser', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({ logs });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
});

export default router;

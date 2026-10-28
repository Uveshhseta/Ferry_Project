import express from 'express';
import Alert from '../models/Alert.js';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/alerts - List active alerts (Public)
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ active: { $ne: false } }).sort({ createdAt: -1 });
    return res.json({ alerts });
  } catch (err) {
    console.error('Error fetching alerts:', err);
    return res.status(500).json({ error: 'Failed to retrieve service alerts.' });
  }
});

// GET /api/alerts/all - List all alerts (Admin)
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    return res.json({ alerts });
  } catch (err) {
    console.error('Error fetching all alerts:', err);
    return res.status(500).json({ error: 'Failed to retrieve all alerts.' });
  }
});

// POST /api/alerts - Create alert (Admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, message, body, severity, route } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Alert title is required.' });
    }

    const newAlert = await Alert.create({
      title: title.trim(),
      message: (message || body || '').trim(),
      body: (body || message || '').trim(),
      severity: severity || 'advisory',
      route: route || 'System-Wide',
      active: true
    });

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'BROADCAST_ALERT',
      targetEntity: 'Alert',
      targetId: newAlert._id.toString(),
      details: { title: newAlert.title, severity: newAlert.severity }
    });

    return res.status(201).json({ message: 'Service alert broadcast successfully', alert: newAlert });
  } catch (err) {
    console.error('Error broadcasting alert:', err);
    return res.status(500).json({ error: 'Failed to broadcast alert.' });
  }
});

// PUT /api/alerts/:id - Update alert (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found.' });
    }

    const { title, message, body, severity, route, active } = req.body;
    if (title !== undefined) alert.title = title.trim();
    if (message !== undefined) alert.message = message.trim();
    if (body !== undefined) alert.body = body.trim();
    if (severity !== undefined) alert.severity = severity;
    if (route !== undefined) alert.route = route;
    if (active !== undefined) alert.active = Boolean(active);

    await alert.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_ALERT',
      targetEntity: 'Alert',
      targetId: alert._id.toString(),
      details: { title: alert.title, active: alert.active }
    });

    return res.json({ message: 'Alert updated successfully', alert });
  } catch (err) {
    console.error('Error updating alert:', err);
    return res.status(500).json({ error: 'Failed to update alert.' });
  }
});

// DELETE /api/alerts/:id - Delete alert (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found.' });
    }

    await Alert.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'DELETE_ALERT',
      targetEntity: 'Alert',
      targetId: req.params.id,
      details: { title: alert.title }
    });

    return res.json({ message: 'Service alert removed.' });
  } catch (err) {
    console.error('Error deleting alert:', err);
    return res.status(500).json({ error: 'Failed to remove alert.' });
  }
});

export default router;

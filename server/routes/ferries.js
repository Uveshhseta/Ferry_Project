import express from 'express';
import Ferry from '../models/Ferry.js';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/ferries - List fleet
router.get('/', async (req, res) => {
  try {
    const ferries = await Ferry.find().sort({ name: 1 });
    return res.json({ ferries });
  } catch (err) {
    console.error('Error fetching ferries:', err);
    return res.status(500).json({ error: 'Failed to retrieve fleet vessels.' });
  }
});

// POST /api/ferries - Create vessel (Admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, capacity, status, assignedRoute, captain, type, yearBuilt } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Vessel name is required.' });
    }

    const newFerry = await Ferry.create({
      name: name.trim(),
      capacity: parseInt(capacity, 10) || 750,
      status: status || 'operational',
      assignedRoute: assignedRoute || 'Centre Island',
      captain: captain || 'Capt. R. Campbell',
      type: type || 'Double-Ended Passenger',
      yearBuilt: parseInt(yearBuilt, 10) || 1939
    });

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'CREATE_VESSEL',
      targetEntity: 'Ferry',
      targetId: newFerry._id.toString(),
      details: { name: newFerry.name, capacity: newFerry.capacity }
    });

    return res.status(201).json({ message: 'Vessel added successfully', ferry: newFerry });
  } catch (err) {
    console.error('Error adding vessel:', err);
    return res.status(500).json({ error: 'Failed to add vessel.' });
  }
});

// PUT /api/ferries/:id - Update vessel (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ferry = await Ferry.findById(req.params.id);
    if (!ferry) {
      return res.status(404).json({ error: 'Vessel not found.' });
    }

    const { name, capacity, status, currentLoad, assignedRoute, captain, type, yearBuilt } = req.body;
    if (name) ferry.name = name.trim();
    if (capacity !== undefined) ferry.capacity = parseInt(capacity, 10) || ferry.capacity;
    if (status !== undefined) ferry.status = status;
    if (currentLoad !== undefined) ferry.currentLoad = parseInt(currentLoad, 10) || 0;
    if (assignedRoute !== undefined) ferry.assignedRoute = assignedRoute;
    if (captain !== undefined) ferry.captain = captain;
    if (type !== undefined) ferry.type = type;
    if (yearBuilt !== undefined) ferry.yearBuilt = parseInt(yearBuilt, 10) || ferry.yearBuilt;

    await ferry.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_VESSEL',
      targetEntity: 'Ferry',
      targetId: ferry._id.toString(),
      details: { name: ferry.name, status: ferry.status, currentLoad: ferry.currentLoad }
    });

    return res.json({ message: 'Vessel updated successfully', ferry });
  } catch (err) {
    console.error('Error updating vessel:', err);
    return res.status(500).json({ error: 'Failed to update vessel.' });
  }
});

// DELETE /api/ferries/:id - Delete vessel (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const ferry = await Ferry.findById(req.params.id);
    if (!ferry) {
      return res.status(404).json({ error: 'Vessel not found.' });
    }

    // Set to maintenance or remove if unused
    ferry.status = 'maintenance';
    await ferry.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'DECOMMISSION_VESSEL',
      targetEntity: 'Ferry',
      targetId: ferry._id.toString(),
      details: { name: ferry.name }
    });

    return res.json({ message: 'Vessel decommissioned / set to maintenance.' });
  } catch (err) {
    console.error('Error decommissioning vessel:', err);
    return res.status(500).json({ error: 'Failed to update vessel.' });
  }
});

export default router;

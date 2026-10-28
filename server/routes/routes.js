import express from 'express';
import Route from '../models/Route.js';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/routes - List all active routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find({ active: { $ne: false } }).sort({ name: 1 });
    return res.json({ routes });
  } catch (err) {
    console.error('Error fetching routes:', err);
    return res.status(500).json({ error: 'Failed to retrieve ferry routes.' });
  }
});

// POST /api/routes - Create new route (Admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, terminals, seasonal, notes, durationMinutes, distanceKm } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Route name is required.' });
    }

    const newRoute = await Route.create({
      name: name.trim(),
      terminals: terminals || [],
      seasonal: Boolean(seasonal),
      notes: notes || '',
      durationMinutes: durationMinutes || 15,
      distanceKm: distanceKm || 2.1
    });

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'CREATE_ROUTE',
      targetEntity: 'Route',
      targetId: newRoute._id.toString(),
      details: { name: newRoute.name }
    });

    return res.status(201).json({ message: 'Route created successfully', route: newRoute });
  } catch (err) {
    console.error('Error creating route:', err);
    return res.status(500).json({ error: 'Failed to create route.' });
  }
});

// PUT /api/routes/:id - Update route (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    const { name, terminals, seasonal, notes, durationMinutes, distanceKm, active } = req.body;
    if (name) route.name = name.trim();
    if (terminals) route.terminals = terminals;
    if (seasonal !== undefined) route.seasonal = seasonal;
    if (notes !== undefined) route.notes = notes;
    if (durationMinutes !== undefined) route.durationMinutes = durationMinutes;
    if (distanceKm !== undefined) route.distanceKm = distanceKm;
    if (active !== undefined) route.active = active;

    await route.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_ROUTE',
      targetEntity: 'Route',
      targetId: route._id.toString(),
      details: { name: route.name }
    });

    return res.json({ message: 'Route updated successfully', route });
  } catch (err) {
    console.error('Error updating route:', err);
    return res.status(500).json({ error: 'Failed to update route.' });
  }
});

// DELETE /api/routes/:id - Soft-deactivate route (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found.' });
    }

    // Soft delete to protect existing bookings
    route.active = false;
    await route.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'DEACTIVATE_ROUTE',
      targetEntity: 'Route',
      targetId: route._id.toString(),
      details: { name: route.name }
    });

    return res.json({ message: 'Route deactivated successfully' });
  } catch (err) {
    console.error('Error deleting route:', err);
    return res.status(500).json({ error: 'Failed to deactivate route.' });
  }
});

export default router;

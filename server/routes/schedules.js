import express from 'express';
import mongoose from 'mongoose';
import Schedule from '../models/Schedule.js';
import Route from '../models/Route.js';
import Ferry from '../models/Ferry.js';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/schedules - List schedules
router.get('/', async (req, res) => {
  try {
    const { routeId, status } = req.query;
    const filter = { active: { $ne: false } };

    if (routeId) filter.route = routeId;
    if (status) filter.status = status;

    const schedules = await Schedule.find(filter)
      .populate('route')
      .populate('ferry')
      .sort({ departure: 1 });

    return res.json({ schedules });
  } catch (err) {
    console.error('Error fetching schedules:', err);
    return res.status(500).json({ error: 'Failed to retrieve ferry schedules.' });
  }
});

// POST /api/schedules - Create new schedule / relief run (Admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { route, ferry, departure, departureTime, peak, status, delayMinutes, gate, destination, origin, vessel } = req.body;
    const depTime = departure || departureTime;

    if (!depTime) {
      return res.status(400).json({ error: 'Departure time is required.' });
    }

    let resolvedRouteId = null;
    if (route && mongoose.Types.ObjectId.isValid(route)) {
      resolvedRouteId = route;
    } else if (route) {
      const found = await Route.findOne({
        $or: [
          { name: new RegExp(route.trim(), 'i') },
          { destination: new RegExp(route.trim(), 'i') }
        ]
      });
      if (found) resolvedRouteId = found._id;
    }

    if (!resolvedRouteId && destination) {
      const found = await Route.findOne({
        destination: new RegExp(destination.trim(), 'i')
      });
      if (found) resolvedRouteId = found._id;
    }

    if (!resolvedRouteId) {
      const firstRoute = await Route.findOne();
      resolvedRouteId = firstRoute?._id;
    }

    let resolvedFerryId = ferry || null;
    if (!resolvedFerryId && vessel) {
      const foundVessel = await Ferry.findOne({ name: new RegExp(vessel.trim(), 'i') });
      if (foundVessel) resolvedFerryId = foundVessel._id;
    }

    const newSchedule = await Schedule.create({
      route: resolvedRouteId,
      ferry: resolvedFerryId,
      departure: depTime,
      peak: Boolean(peak),
      status: status || 'on-time',
      delayMinutes: delayMinutes || 0,
      gate: gate || 'Gate 2'
    });

    const populated = await Schedule.findById(newSchedule._id)
      .populate('route')
      .populate('ferry');

    const scheduleObj = populated.toObject();
    scheduleObj.departureTime = populated.departure;

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'CREATE_SCHEDULE',
      targetEntity: 'Schedule',
      targetId: newSchedule._id.toString(),
      details: { departure: depTime, status, gate }
    });

    return res.status(201).json({
      message: 'Schedule created successfully',
      schedule: scheduleObj
    });
  } catch (err) {
    console.error('Error creating schedule:', err);
    return res.status(500).json({ error: 'Failed to create schedule departure.' });
  }
});

// PUT /api/schedules/:id - Update schedule departure / status (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    const { departure, ferry, status, delayMinutes, gate, peak } = req.body;
    if (departure !== undefined) schedule.departure = departure;
    if (ferry !== undefined) schedule.ferry = ferry;
    if (status !== undefined) schedule.status = status;
    if (delayMinutes !== undefined) schedule.delayMinutes = parseInt(delayMinutes, 10) || 0;
    if (gate !== undefined) schedule.gate = gate;
    if (peak !== undefined) schedule.peak = Boolean(peak);

    await schedule.save();

    const populated = await Schedule.findById(schedule._id)
      .populate('route')
      .populate('ferry');

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_SCHEDULE',
      targetEntity: 'Schedule',
      targetId: schedule._id.toString(),
      details: { status: schedule.status, delayMinutes: schedule.delayMinutes, gate: schedule.gate }
    });

    return res.json({ message: 'Schedule updated successfully', schedule: populated });
  } catch (err) {
    console.error('Error updating schedule:', err);
    return res.status(500).json({ error: 'Failed to update schedule.' });
  }
});

// DELETE /api/schedules/:id - Deactivate schedule (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    schedule.active = false;
    await schedule.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'DEACTIVATE_SCHEDULE',
      targetEntity: 'Schedule',
      targetId: schedule._id.toString(),
      details: { departure: schedule.departure }
    });

    return res.json({ message: 'Schedule departure deactivated.' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    return res.status(500).json({ error: 'Failed to deactivate schedule.' });
  }
});

export default router;

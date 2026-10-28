import express from 'express';
import Park from '../models/Park.js';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/parks - List parks and attractions
router.get('/', async (req, res) => {
  try {
    const parks = await Park.find({ active: { $ne: false } }).sort({ rating: -1 });
    return res.json({ parks });
  } catch (err) {
    console.error('Error fetching parks:', err);
    return res.status(500).json({ error: 'Failed to retrieve parks and trails.' });
  }
});

// POST /api/parks - Create park/attraction (Admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { 
      name, title, category, destination, location, area, description, 
      features, amenities, hours, rating, image, distanceFromDock, accessible, active 
    } = req.body;

    const parkName = (name || title || '').trim();
    if (!parkName) {
      return res.status(400).json({ error: 'Park or attraction name is required.' });
    }

    const featureList = Array.isArray(features) && features.length > 0 
      ? features 
      : (Array.isArray(amenities) ? amenities : []);

    const newPark = await Park.create({
      name: parkName,
      category: category || 'Family Attractions',
      destination: destination || location || 'Centre Island',
      area: area || 'Toronto Island',
      description: description || '',
      features: featureList,
      amenities: featureList,
      hours: hours || 'Dawn to Dusk',
      rating: parseFloat(rating) || 4.8,
      image: image || '/images/centre-island.jpg',
      distanceFromDock: distanceFromDock || '5 min walk from Ferry Dock',
      accessible: accessible !== undefined ? Boolean(accessible) : true,
      active: active !== undefined ? Boolean(active) : true
    });

    const parkObj = newPark.toObject();
    parkObj.title = newPark.name;

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'CREATE_PARK_CONTENT',
      targetEntity: 'Park',
      targetId: newPark._id.toString(),
      details: { name: newPark.name, destination: newPark.destination }
    });

    return res.status(201).json({ message: 'Park attraction created successfully', park: parkObj });
  } catch (err) {
    console.error('Error creating park:', err);
    return res.status(500).json({ error: 'Failed to create park attraction.' });
  }
});

// PUT /api/parks/:id - Update park (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const park = await Park.findById(req.params.id);
    if (!park) {
      return res.status(404).json({ error: 'Park or attraction not found.' });
    }

    const { 
      name, category, destination, area, description, 
      features, hours, rating, image, distanceFromDock, accessible, active 
    } = req.body;

    if (name) park.name = name.trim();
    if (category) park.category = category;
    if (destination) park.destination = destination;
    if (area) park.area = area;
    if (description !== undefined) park.description = description;
    if (features) park.features = Array.isArray(features) ? features : [];
    if (hours) park.hours = hours;
    if (rating !== undefined) park.rating = parseFloat(rating) || park.rating;
    if (image) park.image = image;
    if (distanceFromDock) park.distanceFromDock = distanceFromDock;
    if (accessible !== undefined) park.accessible = Boolean(accessible);
    if (active !== undefined) park.active = Boolean(active);

    await park.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_PARK_CONTENT',
      targetEntity: 'Park',
      targetId: park._id.toString(),
      details: { name: park.name }
    });

    return res.json({ message: 'Park attraction updated successfully', park });
  } catch (err) {
    console.error('Error updating park:', err);
    return res.status(500).json({ error: 'Failed to update park.' });
  }
});

// DELETE /api/parks/:id - Soft-deactivate park (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const park = await Park.findById(req.params.id);
    if (!park) {
      return res.status(404).json({ error: 'Park not found.' });
    }

    park.active = false;
    await park.save();

    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'DEACTIVATE_PARK_CONTENT',
      targetEntity: 'Park',
      targetId: park._id.toString(),
      details: { name: park.name }
    });

    return res.json({ message: 'Park attraction deactivated.' });
  } catch (err) {
    console.error('Error deleting park:', err);
    return res.status(500).json({ error: 'Failed to deactivate park.' });
  }
});

export default router;

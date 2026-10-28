import express from 'express';
import PricingSettings from '../models/PricingSettings.js';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper to ensure default pricing settings record exists
export const getOrCreatePricingSettings = async () => {
  let settings = await PricingSettings.findOne().sort({ updatedAt: -1 });
  if (!settings) {
    settings = await PricingSettings.create({
      taxLabel: 'GST',
      taxPercent: 5.0,
      currency: 'CAD',
      harbourFee: 0.75,
      fares: {
        adult: { title: 'Adult', subtitle: 'Ages 20 – 64', price: 9.11 },
        senior: { title: 'Senior', subtitle: 'Ages 65+', price: 5.86 },
        youth: { title: 'Youth', subtitle: 'Ages 15 – 19', price: 5.86 },
        junior: { title: 'Junior / Child', subtitle: 'Ages 2 – 14', price: 4.29 },
        infant: { title: 'Infant', subtitle: 'Under 2 years', price: 0.0 },
        bicycle: { title: 'Bicycle / Stroller', subtitle: 'Free transport with passenger', price: 0.0 }
      },
      effectiveDate: new Date().toISOString().split('T')[0]
    });
  }
  return settings;
};

// GET /api/pricing (Public)
router.get('/', async (req, res) => {
  try {
    const settings = await getOrCreatePricingSettings();
    return res.json({ settings });
  } catch (err) {
    console.error('Error fetching pricing:', err);
    return res.status(500).json({ error: 'Failed to retrieve pricing and tax settings.' });
  }
});

// PUT /api/pricing (Admin only)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const { taxLabel, taxPercent, currency, fares, harbourFee, effectiveDate } = req.body;

    let settings = await PricingSettings.findOne().sort({ updatedAt: -1 });
    if (!settings) {
      settings = new PricingSettings();
    }

    const oldValues = {
      taxLabel: settings.taxLabel,
      taxPercent: settings.taxPercent,
      harbourFee: settings.harbourFee,
      fares: settings.fares
    };

    if (taxLabel !== undefined) settings.taxLabel = taxLabel.trim();
    if (taxPercent !== undefined) {
      const parsedTax = parseFloat(taxPercent);
      if (isNaN(parsedTax) || parsedTax < 0 || parsedTax > 50) {
        return res.status(400).json({ error: 'Tax percentage must be a valid number between 0% and 50%.' });
      }
      settings.taxPercent = parsedTax;
    }
    if (currency !== undefined) settings.currency = currency.trim().toUpperCase();
    if (harbourFee !== undefined) {
      const parsedFee = parseFloat(harbourFee);
      if (!isNaN(parsedFee) && parsedFee >= 0) {
        settings.harbourFee = parsedFee;
      }
    }
    if (fares) {
      settings.fares = {
        ...settings.fares,
        ...fares
      };
    }
    if (effectiveDate) {
      settings.effectiveDate = effectiveDate;
    }

    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    // Create Audit Log entry
    await AuditLog.create({
      adminUser: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_PRICING_SETTINGS',
      targetEntity: 'PricingSettings',
      targetId: settings._id.toString(),
      details: {
        previous: oldValues,
        updated: {
          taxLabel: settings.taxLabel,
          taxPercent: settings.taxPercent,
          harbourFee: settings.harbourFee,
          fares: settings.fares
        }
      },
      ipAddress: req.ip || ''
    });

    return res.json({
      message: 'Pricing and tax settings updated successfully.',
      settings
    });
  } catch (err) {
    console.error('Error updating pricing:', err);
    return res.status(500).json({ error: 'Failed to update pricing settings.' });
  }
});

export default router;

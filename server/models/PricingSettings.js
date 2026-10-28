import mongoose from 'mongoose';

const pricingSettingsSchema = new mongoose.Schema(
  {
    taxLabel: {
      type: String,
      default: 'GST'
    },
    taxPercent: {
      type: Number,
      required: true,
      default: 5.0
    },
    currency: {
      type: String,
      default: 'CAD'
    },
    harbourFee: {
      type: Number,
      default: 0.75
    },
    fares: {
      adult: {
        title: { type: String, default: 'Adult' },
        subtitle: { type: String, default: 'Ages 20 – 64' },
        price: { type: Number, default: 9.11 }
      },
      senior: {
        title: { type: String, default: 'Senior' },
        subtitle: { type: String, default: 'Ages 65+' },
        price: { type: Number, default: 5.86 }
      },
      youth: {
        title: { type: String, default: 'Youth' },
        subtitle: { type: String, default: 'Ages 15 – 19' },
        price: { type: Number, default: 5.86 }
      },
      junior: {
        title: { type: String, default: 'Junior / Child' },
        subtitle: { type: String, default: 'Ages 2 – 14' },
        price: { type: Number, default: 4.29 }
      },
      infant: {
        title: { type: String, default: 'Infant' },
        subtitle: { type: String, default: 'Under 2 years' },
        price: { type: Number, default: 0.0 }
      },
      bicycle: {
        title: { type: String, default: 'Bicycle / Stroller' },
        subtitle: { type: String, default: 'Free transport with passenger' },
        price: { type: Number, default: 0.0 }
      }
    },
    effectiveDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    collection: 'pricingSettings'
  }
);

export default mongoose.models.PricingSettings || mongoose.model('PricingSettings', pricingSettingsSchema);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfr_ferry';

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log('[Migration] Connected to MongoDB');

  const bookingsCollection = mongoose.connection.db.collection('bookings');
  const usersCollection = mongoose.connection.db.collection('users');

  const bookings = await bookingsCollection.find({}).toArray();
  console.log(`[Migration] Processing ${bookings.length} historical bookings...`);

  for (const b of bookings) {
    const leadName = (b.passengerDetails && b.passengerDetails[0] && b.passengerDetails[0].fullName)
      ? b.passengerDetails[0].fullName
      : 'Uvesh';

    const updates = {};
    if (!b.contactName) {
      updates.contactName = leadName;
    }

    if (!b.contactEmail && b.user) {
      const u = await usersCollection.findOne({ _id: b.user });
      if (u) {
        updates.contactEmail = u.email;
        if (!b.contactPhone && u.phone) {
          updates.contactPhone = u.phone;
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      await bookingsCollection.updateOne({ _id: b._id }, { $set: updates });
      console.log(`[Migration] Updated booking ${b.ticketCode}:`, updates);
    }
  }

  console.log('[Migration] Historical booking data migration completed safely.');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('[Migration Error]', err);
  process.exit(1);
});

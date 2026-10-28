import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Route from '../models/Route.js';
import Ferry from '../models/Ferry.js';
import Schedule from '../models/Schedule.js';
import Alert from '../models/Alert.js';
import Park from '../models/Park.js';
import PricingSettings from '../models/PricingSettings.js';

export const syncInitialData = async () => {
  try {
    console.log('[Safe Sync] Verifying MongoDB collections in pfr_ferry...');

    // 1. Verify / Provision Admin User safely
    const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || 'admin@pfr.test').toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(initialPassword, salt);
      await User.create({
        name: 'City Ferry Administrator',
        email: adminEmail,
        passwordHash: hash,
        role: 'admin',
        phone: '416-392-CITY'
      });
      console.log(`[Safe Sync] Initial administrator provisioned: ${adminEmail}`);
    } else {
      console.log(`[Safe Sync] Existing administrator account verified: ${existingAdmin.email} (role: ${existingAdmin.role})`);
    }

    // 2. Verify Pricing Settings
    const pricingCount = await PricingSettings.countDocuments();
    if (pricingCount === 0) {
      await PricingSettings.create({
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
      console.log('[Safe Sync] Initial Toronto Island Ferry pricing & 5% GST settings created.');
    } else {
      console.log(`[Safe Sync] Existing pricing settings verified (${pricingCount} record).`);
    }

    // 3. Verify Parks & Island Attractions
    const parksCount = await Park.countDocuments();
    if (parksCount === 0) {
      const defaultParks = [
        {
          name: 'Centreville Amusement Park',
          category: 'Family Attractions',
          destination: 'Centre Island',
          area: 'Toronto Island',
          image: '/images/centre-island.jpg',
          hours: '10:30 AM – 7:00 PM',
          rating: 4.8,
          reviewsCount: 3420,
          description: 'Over 30 vintage rides, historic carousel, roller coasters, swan pedal boats, and sweet treat shops nestled in lush gardens.',
          features: ['30+ Rides & Carousel', 'Far Enough Farm Petting Zoo', 'Food & Ice Cream', 'Family Restrooms'],
          accessible: true,
          distanceFromDock: '3 min walk from Centre Island Dock'
        },
        {
          name: "Hanlan's Point Beach & Dunes",
          category: 'Beaches & Waterfront',
          destination: "Hanlan's Point",
          area: 'Western Toronto Island',
          image: '/images/hanlan-beach.jpg',
          hours: 'Dawn to 11:00 PM',
          rating: 4.9,
          reviewsCount: 2890,
          description: 'Famous sandy beach with soft dunes, sunset views over Lake Ontario, and both family recreational and clothing-optional areas.',
          features: ['Soft Sandy Shoreline', 'Lifeguards on Duty (Summer)', 'Beach Volleyball Nets', 'Clothing-Optional Area'],
          accessible: true,
          distanceFromDock: '8 min walk from Hanlan’s Dock'
        },
        {
          name: 'Gibraltar Point Lighthouse',
          category: 'Historic Landmarks',
          destination: "Hanlan's Point",
          area: 'Toronto Island',
          image: '/images/hanlan-beach.jpg',
          hours: 'Open 24/7 (Exterior Grounds)',
          rating: 4.7,
          reviewsCount: 1540,
          description: 'Constructed in 1808, this is the oldest surviving stone structure in Toronto and oldest operating lighthouse on the Great Lakes.',
          features: ['Heritage 1808 Stone Tower', 'Ghost Legend of J.P. Radelmüller', 'Interpretive Plaques', 'Paved Cycling Path'],
          accessible: true,
          distanceFromDock: '12 min walk / 4 min cycle'
        },
        {
          name: 'The Great Island Boardwalk Trail',
          category: 'Scenic Trails',
          destination: "Ward's Island",
          area: 'Toronto Island',
          image: '/images/hero-ferry.jpg',
          hours: 'Open 24/7',
          rating: 4.9,
          reviewsCount: 4210,
          description: 'Scenic 5.5-kilometre paved and wooden boardwalk running along the south shore of Lake Ontario with panoramic lake and skyline vistas.',
          features: ['5.5 km Scenic Walking Route', 'Lake Ontario Breeze & Sunsets', 'Rest Benches every 200m', 'Dog Friendly on Leash'],
          accessible: true,
          distanceFromDock: 'Directly at Ward’s & Centre Docks'
        },
        {
          name: 'Franklin Children’s Garden',
          category: 'Family Attractions',
          destination: 'Centre Island',
          area: 'Toronto Island',
          image: '/images/centre-island.jpg',
          hours: 'Dawn to Dusk',
          rating: 4.8,
          reviewsCount: 1890,
          description: 'Based on the beloved Franklin the Turtle book series, featuring interactive story stations, frog ponds, and hands-on pollinator gardens.',
          features: ['Turtle Pond & Statues', 'Pollinator Conservatory', 'Storybook Trail', 'Free Admission'],
          accessible: true,
          distanceFromDock: '5 min walk from Centre Island Dock'
        },
        {
          name: "Ward's Island Heritage Cottages & Riviera Cafe",
          category: 'Dining & Heritage',
          destination: "Ward's Island",
          area: 'Toronto Island',
          image: '/images/hero-ferry.jpg',
          hours: '11:00 AM – 9:00 PM',
          rating: 4.9,
          reviewsCount: 2150,
          description: 'Unique car-free bohemian community of 1920s heritage cottage gardens, artisan studios, and the iconic patio of The Island Cafe and Riviera.',
          features: ['Car-free Peaceful Streets', 'Lakeside Patio Dining', 'Local Artisans', 'Historic 1920s Architecture'],
          accessible: true,
          distanceFromDock: '2 min walk from Ward’s Dock'
        }
      ];

      await Park.insertMany(defaultParks);
      console.log(`[Safe Sync] Populated ${defaultParks.length} Toronto Island park destinations.`);
    } else {
      console.log(`[Safe Sync] Existing parks verified (${parksCount} records).`);
    }

    const routeCount = await Route.countDocuments();
    const ferryCount = await Ferry.countDocuments();
    const scheduleCount = await Schedule.countDocuments();
    const alertCount = await Alert.countDocuments();
    console.log(`[Safe Sync] Summary: ${routeCount} Routes, ${ferryCount} Ferries, ${scheduleCount} Schedules, ${alertCount} Alerts verified in pfr_ferry.`);
  } catch (err) {
    console.error('[Safe Sync Error]', err);
  }
};

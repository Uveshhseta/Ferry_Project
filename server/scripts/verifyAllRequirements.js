import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';

async function runVerification() {
  console.log('================================================================');
  console.log('   FULL REGRESSION & MULTI-ACCOUNT VERIFICATION TEST SUITE     ');
  console.log('   City of Toronto PF&R — Toronto Island Ferry Services         ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  const test = (name, cond, details = '') => {
    if (cond) {
      console.log(`[PASS] ${name}${details ? ` -> ${details}` : ''}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}${details ? ` -> ${details}` : ''}`);
      failed++;
    }
  };

  try {
    // -------------------------------------------------------------
    // TEST 1: Health & Public Endpoints (Accessible without login)
    // -------------------------------------------------------------
    const health = await fetch(`${BASE_URL}/api/health`).then(r => r.json());
    test('Public Health & MongoDB Connection', health.status === 'ok' && health.database.status === 'connected');

    const publicRoutes = await fetch(`${BASE_URL}/api/routes`).then(r => r.json());
    test('Public Ferry Routes Accessible Without Login', Array.isArray(publicRoutes.routes) && publicRoutes.routes.length >= 3, `${publicRoutes.routes.length} routes`);

    const publicSchedules = await fetch(`${BASE_URL}/api/schedules`).then(r => r.json());
    test('Public Ferry Schedules Accessible Without Login', Array.isArray(publicSchedules.schedules) && publicSchedules.schedules.length >= 20, `${publicSchedules.schedules.length} schedules`);

    const publicParks = await fetch(`${BASE_URL}/api/parks`).then(r => r.json());
    test('Public Parks & Attractions Accessible Without Login', Array.isArray(publicParks.parks) && publicParks.parks.length >= 6, `${publicParks.parks.length} parks`);

    const publicPricing = await fetch(`${BASE_URL}/api/pricing`).then(r => r.json());
    test('Public Pricing & GST Configuration Accessible Without Login', publicPricing.settings?.taxLabel === 'GST', `${publicPricing.settings?.taxPercent}% GST`);

    // -------------------------------------------------------------
    // TEST 2: Admin Authentication (Separate Dedicated Login)
    // -------------------------------------------------------------
    const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@pfr.test', password: 'admin123' })
    }).then(r => r.json());

    test('Admin Dedicated Login Successful', adminLogin.token && adminLogin.user?.role === 'admin', `Role: ${adminLogin.user?.role}`);
    const adminToken = adminLogin.token;

    // -------------------------------------------------------------
    // TEST 3: User A Registration, Login & Booking Creation
    // -------------------------------------------------------------
    const userAEmail = `user_a_${Date.now()}@toronto.test`;
    const userAReg = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Maya Patel',
        email: userAEmail,
        password: 'Password123!',
        phone: '416-555-1101'
      })
    }).then(r => r.json());

    test('User A (Maya Patel) Registration', userAReg.token && userAReg.user?.name === 'Maya Patel', userAEmail);
    const userAToken = userAReg.token;

    // User A books a round-trip ticket with 2 passengers
    const userABookingRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({
        from: 'Jack Layton Ferry Terminal',
        to: 'Centre Island',
        date: '2026-10-25',
        departureTime: '15:45 (Scheduled Run)',
        tripType: 'round',
        adults: 1,
        youth: 1,
        seniors: 0,
        juniors: 0,
        infants: 0,
        bicycles: 1,
        contactName: 'Maya Patel',
        contactEmail: userAEmail,
        contactPhone: '416-555-1101',
        passengerDetails: [
          { fullName: 'Maya Patel', type: 'Lead / Adult', isLead: true },
          { fullName: 'Aarav Patel', type: 'Youth', isLead: false }
        ],
        paymentMethod: 'card-simulator'
      })
    }).then(r => r.json());

    const bookingA = userABookingRes.booking;
    test('User A Booking Creation', bookingA && bookingA.ticketCode && bookingA.contactName === 'Maya Patel', `Code: ${bookingA?.ticketCode}, Contact: ${bookingA?.contactName}`);

    // -------------------------------------------------------------
    // TEST 4: User B Registration, Login & Booking Creation
    // -------------------------------------------------------------
    const userBEmail = `user_b_${Date.now()}@toronto.test`;
    const userBReg = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'David Chen',
        email: userBEmail,
        password: 'Password456!',
        phone: '416-555-2202'
      })
    }).then(r => r.json());

    test('User B (David Chen) Registration', userBReg.token && userBReg.user?.name === 'David Chen', userBEmail);
    const userBToken = userBReg.token;

    // User B books a single ticket with 1 senior
    const userBBookingRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userBToken}`
      },
      body: JSON.stringify({
        from: 'Jack Layton Ferry Terminal',
        to: "Ward's Island",
        date: '2026-10-26',
        departureTime: '16:00 (Scheduled Run)',
        tripType: 'single',
        adults: 0,
        seniors: 1,
        youth: 0,
        juniors: 0,
        infants: 0,
        bicycles: 0,
        contactName: 'David Chen',
        contactEmail: userBEmail,
        contactPhone: '416-555-2202',
        passengerDetails: [
          { fullName: 'David Chen', type: 'Senior Lead', isLead: true }
        ],
        paymentMethod: 'presto'
      })
    }).then(r => r.json());

    const bookingB = userBBookingRes.booking;
    test('User B Booking Creation', bookingB && bookingB.ticketCode && bookingB.contactName === 'David Chen', `Code: ${bookingB?.ticketCode}, Contact: ${bookingB?.contactName}`);

    // -------------------------------------------------------------
    // TEST 5: Booking Ownership & Data Isolation Verification
    // -------------------------------------------------------------
    const userABookings = await fetch(`${BASE_URL}/api/bookings/my`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    }).then(r => r.json());

    const userBBookings = await fetch(`${BASE_URL}/api/bookings/my`, {
      headers: { Authorization: `Bearer ${userBToken}` }
    }).then(r => r.json());

    const userASeesOnlyA = userABookings.bookings?.some(b => b.ticketCode === bookingA.ticketCode) &&
      !userABookings.bookings?.some(b => b.ticketCode === bookingB.ticketCode);

    const userBSeesOnlyB = userBBookings.bookings?.some(b => b.ticketCode === bookingB.ticketCode) &&
      !userBBookings.bookings?.some(b => b.ticketCode === bookingA.ticketCode);

    test("User A Sees ONLY User A's Bookings (Data Isolation)", userASeesOnlyA);
    test("User B Sees ONLY User B's Bookings (Data Isolation)", userBSeesOnlyB);

    // -------------------------------------------------------------
    // TEST 6: Admin Passenger Registry Verification (No False 'Admin' Names)
    // -------------------------------------------------------------
    const adminBookingsRes = await fetch(`${BASE_URL}/api/admin/bookings`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());

    const adminBookingA = adminBookingsRes.bookings?.find(b => b.ticketCode === bookingA.ticketCode);
    const adminBookingB = adminBookingsRes.bookings?.find(b => b.ticketCode === bookingB.ticketCode);

    test('Admin Booking Registry Shows User A Name (Maya Patel)', 
      adminBookingA && adminBookingA.contactName === 'Maya Patel' && adminBookingA.contactEmail === userAEmail,
      `Displayed Name: ${adminBookingA?.contactName}, Email: ${adminBookingA?.contactEmail}`
    );

    test('Admin Booking Registry Shows User B Name (David Chen)', 
      adminBookingB && adminBookingB.contactName === 'David Chen' && adminBookingB.contactEmail === userBEmail,
      `Displayed Name: ${adminBookingB?.contactName}, Email: ${adminBookingB?.contactEmail}`
    );

    test('Lead Passenger Manifest Details Intact', 
      adminBookingA?.passengerDetails?.[1]?.fullName === 'Aarav Patel',
      `Accompanying: ${adminBookingA?.passengerDetails?.[1]?.fullName}`
    );

    // -------------------------------------------------------------
    // TEST 7: Role-Based Access Control (RBAC)
    // -------------------------------------------------------------
    const rbacUserList = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    test('Citizen Blocked (HTTP 403) from Admin User List', rbacUserList.status === 403);

    const rbacAuditLogs = await fetch(`${BASE_URL}/api/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    test('Citizen Blocked (HTTP 403) from Admin Audit Logs', rbacAuditLogs.status === 403);

    const rbacPricing = await fetch(`${BASE_URL}/api/pricing`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({ taxPercent: 12.0 })
    });
    test('Citizen Blocked (HTTP 403) from Modifying Pricing', rbacPricing.status === 403);

    // -------------------------------------------------------------
    // TEST 8: Validation (Same Origin and Destination Blocked)
    // -------------------------------------------------------------
    const invalidBooking = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({
        from: 'Jack Layton Ferry Terminal',
        to: 'Jack Layton Ferry Terminal', // Same!
        date: '2026-10-25',
        departureTime: '15:45',
        tripType: 'single',
        adults: 1
      })
    });
    test('Server Rejects Identical Origin and Destination (HTTP 400)', invalidBooking.status === 400);

    // -------------------------------------------------------------
    // TEST 9: Admin CRUD Tab Functionality
    // -------------------------------------------------------------
    // Schedules CRUD
    const newSchedule = await fetch(`${BASE_URL}/api/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        route: 'City - Centre Island',
        origin: 'Jack Layton Ferry Terminal',
        destination: 'Centre Island',
        departureTime: '19:45',
        vessel: 'MV Sam McBride',
        gate: 'Gate 2',
        status: 'On Time'
      })
    }).then(r => r.json());
    test('Admin Create Schedule', newSchedule.schedule && newSchedule.schedule.departureTime === '19:45', `ID: ${newSchedule.schedule?._id}`);

    // Update schedule
    if (newSchedule.schedule?._id) {
      const updateSched = await fetch(`${BASE_URL}/api/schedules/${newSchedule.schedule._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: 'Boarding' })
      }).then(r => r.json());
      test('Admin Update Schedule Status', updateSched.schedule?.status === 'Boarding');

      // Deactivate/delete schedule
      const delSched = await fetch(`${BASE_URL}/api/schedules/${newSchedule.schedule._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      test('Admin Deactivate/Delete Schedule', delSched.status === 200);
    }

    // Fleet & Vessels CRUD
    const newVessel = await fetch(`${BASE_URL}/api/ferries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'MV Island Breeze (Test Vessel)',
        capacity: 450,
        status: 'operational',
        assignedRoute: 'Centre Island',
        captain: 'Capt. Test Pilot',
        type: 'Single-Deck Passenger',
        yearBuilt: 2024
      })
    }).then(r => r.json());
    test('Admin Create Fleet Vessel', newVessel.ferry && newVessel.ferry.name.includes('Island Breeze'), `ID: ${newVessel.ferry?._id}`);

    if (newVessel.ferry?._id) {
      const updateVessel = await fetch(`${BASE_URL}/api/ferries/${newVessel.ferry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: 'maintenance' })
      }).then(r => r.json());
      test('Admin Update Fleet Vessel Status', updateVessel.ferry?.status === 'maintenance');

      const delVessel = await fetch(`${BASE_URL}/api/ferries/${newVessel.ferry._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      test('Admin Deactivate/Delete Fleet Vessel', delVessel.status === 200);
    }

    // Parks & Attractions CRUD
    const newPark = await fetch(`${BASE_URL}/api/parks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Centreville Amusement Park East Pavilion',
        category: 'Attractions',
        description: 'New seasonal recreation facility with accessible picnic areas.',
        location: 'Centre Island',
        amenities: ['Picnic Tables', 'Washrooms', 'Shaded Gazebo'],
        active: true
      })
    }).then(r => r.json());
    test('Admin Create Park Attraction', newPark.park && newPark.park.title.includes('Centreville'), `ID: ${newPark.park?._id}`);

    if (newPark.park?._id) {
      const delPark = await fetch(`${BASE_URL}/api/parks/${newPark.park._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      test('Admin Deactivate/Delete Park Attraction', delPark.status === 200);
    }


    // Service Alerts CRUD
    const newAlert = await fetch(`${BASE_URL}/api/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'High Wave Advisory on Hanlan Dock',
        message: 'Southwest winds creating moderate swell at Hanlan Point dock. Board with care.',
        severity: 'warning',
        route: 'City - Hanlan\'s Point',
        active: true
      })
    }).then(r => r.json());
    test('Admin Create Service Alert', newAlert.alert && newAlert.alert.title.includes('High Wave Advisory'), `ID: ${newAlert.alert?._id}`);

    if (newAlert.alert?._id) {
      const delAlert = await fetch(`${BASE_URL}/api/alerts/${newAlert.alert._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      test('Admin Delete Service Alert', delAlert.status === 200);
    }

    // Turnstile Optical Scanner Verification
    const scanValid = await fetch(`${BASE_URL}/api/tickets/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ ticketCode: bookingA.ticketCode, gate: 'Gate 2' })
    }).then(r => r.json());
    test('Turnstile Optical Reader Scans Valid Pass', scanValid.scan?.status === 'VALID', `Turnstile Status: ${scanValid.scan?.status}`);

    const scanInvalid = await fetch(`${BASE_URL}/api/tickets/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ ticketCode: 'TOR-FAKE-9999', gate: 'Gate 1' })
    }).then(r => r.json());
    test('Turnstile Optical Reader Detects Invalid Pass', scanInvalid.scan?.status === 'INVALID', `Turnstile Status: ${scanInvalid.scan?.status}`);

    // -------------------------------------------------------------
    // TEST 10: MongoDB Data Preservation Verification
    // -------------------------------------------------------------
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfr_ferry';
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;

    const usersCount = await db.collection('users').countDocuments();
    const bookingsCount = await db.collection('bookings').countDocuments();
    const schedulesCount = await db.collection('schedules').countDocuments();
    const ferriesCount = await db.collection('ferries').countDocuments();
    const routesCount = await db.collection('routes').countDocuments();
    const parksCount = await db.collection('parks').countDocuments();

    test('Preserved MongoDB Users Collection', usersCount >= 5, `${usersCount} user documents`);
    test('Preserved MongoDB Bookings Collection (No Historical Deletions)', bookingsCount >= 6, `${bookingsCount} booking documents`);
    test('Preserved MongoDB Schedules Collection', schedulesCount >= 24, `${schedulesCount} schedule documents`);
    test('Preserved MongoDB Fleet/Ferries Collection', ferriesCount >= 4, `${ferriesCount} vessel documents`);
    test('Preserved MongoDB Routes Collection', routesCount >= 3, `${routesCount} route documents`);
    test('Preserved MongoDB Parks Collection', parksCount >= 6, `${parksCount} park documents`);

    await mongoose.disconnect();

    console.log('\n================================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution fatal error:', err);
    process.exit(1);
  }
}

runVerification();

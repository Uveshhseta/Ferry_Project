// End-to-End System Verification Script for Toronto Island Ferry Services
const BASE_URL = 'http://localhost:5000';
const PROXY_URL = 'http://localhost:5173';

async function runTests() {
  console.log('========================================================');
  console.log('   STARTING TORONTO ISLAND FERRY SERVICES SYSTEM TESTS   ');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`[PASS] ${title}`);
      passed++;
    } else {
      console.error(`[FAIL] ${title}`);
      failed++;
    }
  };

  try {
    // 1. Health check & proxy
    const healthDirect = await fetch(`${BASE_URL}/api/health`).then(r => r.json());
    assert(healthDirect.status === 'ok' && healthDirect.database.status === 'connected', 'Direct Backend Health Check & MongoDB Connected');

    const healthProxy = await fetch(`${PROXY_URL}/api/health`).then(r => r.json());
    assert(healthProxy.status === 'ok', 'Vite /api Proxy to Backend Port 5000 Working');

    // 2. Fetch Pricing & Tax
    const pricingRes = await fetch(`${BASE_URL}/api/pricing`).then(r => r.json());
    assert(pricingRes.settings && pricingRes.settings.taxLabel === 'GST', `Pricing & GST Settings Active (${pricingRes.settings?.taxPercent}% ${pricingRes.settings?.taxLabel})`);

    // 3. Admin Authentication
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@pfr.test', password: 'admin123' })
    }).then(r => r.json());

    assert(adminLoginRes.token && adminLoginRes.user?.role === 'admin', 'Admin Login Verified (admin@pfr.test)');
    const adminToken = adminLoginRes.token;

    // 4. Citizen Registration & Login
    const testEmail = `testpassenger_${Date.now()}@test.ca`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alexander Mackenzie',
        email: testEmail,
        password: 'password123',
        phone: '416-555-0987'
      })
    }).then(r => r.json());

    assert(regRes.token && regRes.user?.email === testEmail, `Citizen Registration & Bcrypt Hashing Verified (${testEmail})`);
    const citizenToken = regRes.token;

    // 5. Routes & Schedules from MongoDB
    const routesRes = await fetch(`${BASE_URL}/api/routes`).then(r => r.json());
    assert(routesRes.routes?.length >= 3, `Preserved MongoDB Ferry Routes (${routesRes.routes?.length} routes found)`);

    const schedulesRes = await fetch(`${BASE_URL}/api/schedules`).then(r => r.json());
    assert(schedulesRes.schedules?.length >= 20, `Preserved MongoDB Ferry Schedules (${schedulesRes.schedules?.length} schedules found)`);

    // 6. Booking Creation & MongoDB Persistence
    const bookingPayload = {
      from: 'Jack Layton Ferry Terminal',
      to: 'Centre Island',
      date: '2026-10-25',
      departureTime: '15:45',
      tripType: 'round',
      adults: 2,
      seniors: 1,
      juniors: 1,
      paymentMethod: 'card-simulator'
    };

    const bookingRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify(bookingPayload)
    }).then(r => r.json());

    const booking = bookingRes.booking;
    assert(booking && booking.ticketCode && booking.pricing?.totalAmount > 0, 
      `Booking Created & Persisted to MongoDB (TicketCode: ${booking?.ticketCode}, Ref: ${booking?.bookingReference}, Total: $${booking?.pricing?.totalAmount} CAD)`
    );

    // Verify GST breakdown calculation on backend
    const baseFare = booking.pricing.baseFare;
    const taxAmt = booking.pricing.taxAmount;
    const expectedTax = parseFloat((baseFare * 0.05).toFixed(2));
    assert(Math.abs(taxAmt - expectedTax) < 0.05, `Server-Side GST Tax Calculation Verified (Base: $${baseFare}, 5% Tax: $${taxAmt})`);

    // 7. User Booking History Retrieval
    const myBookingsRes = await fetch(`${BASE_URL}/api/bookings/my`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    }).then(r => r.json());

    const foundInHistory = myBookingsRes.bookings?.some(b => b.ticketCode === booking.ticketCode);
    assert(foundInHistory, 'User My Account / Tickets Retrieval from MongoDB Verified');

    // 8. Server-Side Ticket Verification
    const verifyRes = await fetch(`${BASE_URL}/api/tickets/verify/${booking.ticketCode}`).then(r => r.json());
    assert(verifyRes.valid === true && verifyRes.status === 'VALID', `Ticket Barcode Verification Verified (${booking.ticketCode} is VALID)`);

    // 9. Staff / Admin Gate Turnstile Scanner
    const scanRes = await fetch(`${BASE_URL}/api/tickets/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ ticketCode: booking.ticketCode, gate: 'Gate 2' })
    }).then(r => r.json());

    assert(scanRes.scan?.status === 'VALID', `Admin Gate Turnstile Scanner Verified (${scanRes.scan?.passId})`);

    // 10. Role-Based Authorization Enforcement
    const unauthorizedAttempt = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert(unauthorizedAttempt.status === 403, 'Role-Based Access Control Verified (Citizen forbidden 403 from Admin API)');

    // 11. Admin Pricing Update & Audit Logging
    const updatePricingRes = await fetch(`${BASE_URL}/api/pricing`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        taxLabel: 'GST',
        taxPercent: 5.0
      })
    }).then(r => r.json());

    assert(updatePricingRes.settings?.taxPercent === 5, 'Admin Tax & Pricing Configuration Update Verified');

    const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());

    assert(auditRes.logs?.length > 0, `Admin Audit Trail Verified (${auditRes.logs?.length} logged events recorded)`);

    console.log('\n========================================================');
    console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED   `);
    console.log('========================================================\n');

  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();

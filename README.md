# Toronto Island Ferry Services — Enterprise Portal & Management System

Official, production-oriented web portal and operations management system for **Toronto Parks, Forestry & Recreation (PF&R) — Toronto Island Ferry Services**.

Connected to local MongoDB (`mongodb://127.0.0.1:27017/pfr_ferry`) with full authentication, persistent ticketing, interactive Leaflet & OpenStreetMap harbour navigation, configurable GST/HST pricing, and secure administrator controls.

---

## 🌟 Key Architecture & Features

### 1. Database & Persistence (Local MongoDB)
- **Target Database**: `pfr_ferry` on `mongodb://127.0.0.1:27017`
- **Preserved Collections**:
  - `users`: Citizen, Staff, and Administrator profiles with bcrypt password hashing (`$2a$10$...`).
  - `routes`: Verified geographic terminals and harbour crossing paths (Jack Layton Terminal, Centre Island, Hanlan's Point, Ward's Island).
  - `ferries`: Fleet vessels (`Sam McBride`, `Thomas Rennie`, `William Inglis`, `Ongiara`).
  - `schedules`: Scheduled departures with status, delay minutes, and gate assignments.
  - `alerts`: Public notices and marine weather advisories.
  - `bookings`: Complete historical and active booking records with passenger breakdowns, tax amounts, and ticket identifiers.
  - `pricingSettings`: Dynamic GST / tax rate, base fares, and currency configuration.
  - `parks`: Toronto Island attractions and park landmarks.
  - `adminAuditLogs`: Audit trail for administrative actions.

### 2. Full Authentication & Session Security
- Citizen account registration with validation and password hashing (`bcryptjs`).
- Secure session tokens (`JWT`) with role-based access control (`citizen`, `staff`, `admin`).
- Unauthenticated users can freely browse schedules, route maps, alerts, and park guides.
- Clicking **Book Ferry Now** automatically prompts sign-in/registration and returns the user to the booking form upon login.
- Real user profile in the header with one-click **Log Out** that terminates the session on both client and server.

### 3. Interactive Route Map (Leaflet + OpenStreetMap)
- Real geographic GPS coordinates:
  - **Jack Layton Ferry Terminal**: `43.6407°N, 79.3754°W`
  - **Centre Island Dock**: `43.6204°N, 79.3763°W`
  - **Hanlan's Point Dock**: `43.6188°N, 79.3921°W`
  - **Ward's Island Dock**: `43.6277°N, 79.3597°W`
- Interactive zoom, pan, marker selection, nautical route paths, and island boardwalk line.
- **Book Pass to Selected Dock** automatically prefills origin and destination.

### 4. End-to-End Booking & Verified QR Pass Generation
- 4-step booking workflow with dynamic fare and tax calculation.
- Server-side calculation prevents client tampering:
  $$\text{Total} = \text{Base Fare} + (\text{Base Fare} \times \text{GST \%}) + \text{Harbour Fee}$$
- Persistent unique `ticketCode` (e.g. `1BEE61AD`) and `bookingReference` (e.g. `TO-BK-98214`).
- Scannable QR code generated using SVG linked to the server-verified ticket ID.
- Printable pass and cancellation/refund capability from **My Account**.

### 5. Dedicated Admin Operations Console
- Secure gate: requires `admin` or `staff` credential
- **Overview Dashboard**: Real-time revenue, passenger counts, active fleet, and departure telemetry.
- **User Management**: Search, filter, change roles, and deactivate/activate accounts.
- **Booking & Passenger Management**: Inspect bookings, passengers, GST collected, and issue refunds.
- **Schedule Management**: Create relief departures, update delays, and assign gates.
- **Fleet Management**: Monitor vessel load, capacity, and operational status.
- **Service Alerts**: Broadcast live advisories to the public website.
- **Pricing & Tax Settings**: Admin-configurable tax label (e.g. GST/HST), tax percentage, and base fares.
- **Gate Turnstile Scanner**: Real server-side optical scanner simulation for terminal boarding.
- **Audit Logs**: Immutable record of all pricing and administrative updates.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ (tested on Node v22.16.0)
- Local MongoDB Server running on `mongodb://127.0.0.1:27017`

### 1. Start the Express + MongoDB Backend
```bash
cd server
npm install
node index.js
```
The server will start at `http://localhost:5000` and automatically verify existing `pfr_ferry` collections non-destructively.

### 2. Start the React + Vite Frontend
```bash
# In the root directory:
npm install
npm run dev
```
The frontend application will be live at `http://localhost:5173/`. All `/api/*` requests proxy to `http://localhost:5000`.

---

## 🧪 Running System Verification Tests

To run the automated end-to-end verification suite:
```bash
node server/scripts/testE2E.js
```
Tests all critical workflows: healthcheck, authentication, MongoDB booking creation, server-side GST calculation, QR verification, turnstile scanning, admin RBAC, and audit logging.

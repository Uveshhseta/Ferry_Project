# Toronto Island Ferry Services — System Setup & Handover Guide
**City of Toronto — Parks, Forestry & Recreation Division (PF&R)**

---

## 1. Project Overview & Technology Stack

The **Toronto Island Ferry Services** web portal and operations console provides citizen transit booking, real-time departure schedules, interactive harbour navigation, service alerts, island park guides, and administrator fleet/dispatch management.

### Technology Stack
- **Frontend**:
  - React.js (v19) with React DOM
  - Vite (v8.3.4) as build tool and dev server
  - Tailwind CSS (v4) with vanilla CSS utilities
  - Leaflet.js (v1.9.4) for interactive GPS GIS mapping with OpenStreetMap tiles
  - Lucide React (v1.16) for accessible icons
  - Canvas Confetti & QRCodeSVG for ticket pass rendering
- **Backend**:
  - Node.js (ES Modules, `type: "module"`)
  - Express.js (v4.21.2) REST API
  - MongoDB (v7+) with Mongoose ODM (v8.9.5)
  - JWT (`jsonwebtoken` v9.0.2) & `bcryptjs` (v2.4.3) for role-based authentication
  - CORS, Morgan logging, and environment variable isolation (`dotenv`)

---

## 2. Directory & Architecture Structure

```
Ferry_Project/
├── .env.example              # Sample environment configuration template
├── package.json              # Frontend dependencies and build scripts
├── vite.config.js            # Vite bundler configuration with API reverse proxy
├── index.html                # HTML5 root with Toronto branding & meta tags
├── public/                   # Public static assets & photographic scenery
│   ├── images/               # High-res photography (Centre Island, Hanlan, Ferry)
│   └── favicon.ico
├── src/                      # Frontend Application Source
│   ├── main.jsx              # React DOM entry point
│   ├── App.jsx               # Main application routing and shell
│   ├── index.css             # Design system styling, tokens, print media queries
│   ├── components/           # Reusable UI Components
│   │   ├── Header.jsx        # Navigation bar, language switcher, auth trigger
│   │   ├── Footer.jsx        # Bilingual footer, 311 helpline, city resources
│   │   ├── BookingCard.jsx   # Hero trip selector and quick checkout widget
│   │   ├── GlobalSearchModal.jsx # Multi-category site-wide search
│   │   └── MobileBottomNav.jsx   # Mobile bottom navigation bar
│   ├── context/
│   │   └── AppContext.jsx    # Global state (auth, language, data cache, routing)
│   ├── pages/                # Website Pages
│   │   ├── HomePage.jsx               # Home portal with quick booking & portals
│   │   ├── BookingPage.jsx            # 5-step booking and ticket issuance flow
│   │   ├── SchedulesPage.jsx          # Live departure boards & vessel telemetry
│   │   ├── RouteMapsPage.jsx          # Interactive Leaflet harbour map
│   │   ├── ParksTrailsPage.jsx        # Parks, trails & attractions directory
│   │   ├── RecreationProgramsPage.jsx # Sailing, SUP, eco-camps registration
│   │   ├── PermitsPage.jsx            # BBQ, fire pit, ceremony permit applications
│   │   ├── EventsNewsPage.jsx         # Regattas, concerts & fleet news
│   │   ├── ContactSupportPage.jsx     # 311 helpline, lost & found, feedback
│   │   ├── AlertsPage.jsx             # Service bulletins & weather advisories
│   │   ├── CustomerDashboardPage.jsx  # Passenger account with digital passes
│   │   └── AdminPage.jsx              # Harbour Operations & Fleet Management
│   ├── services/
│   │   └── api.js            # Unified REST client with JWT interceptor
│   └── utils/
│       ├── translations.js   # Complete English / French language dictionaries
│       └── ticketPdf.js      # Client-side printable PDF generator
├── server/                   # Backend Express & MongoDB Service
│   ├── index.js              # Express app bootstrap, CORS, and route registration
│   ├── package.json          # Server dependencies
│   ├── .env                  # Local server environment configuration
│   ├── middleware/
│   │   └── auth.js           # JWT verification, citizen/staff/admin RBAC
│   ├── models/               # Mongoose Data Models
│   │   ├── User.js           # User credentials, roles, phone, active state
│   │   ├── Booking.js        # Ticket codes, pricing breakdown, passenger details
│   │   ├── Schedule.js       # Departure times, route link, vessel, delay
│   │   ├── Ferry.js          # Vessel specifications, capacity, load, captain
│   │   ├── Route.js          # Terminal pairs, crossing duration, distance
│   │   ├── Alert.js          # Service alerts, severity, affected route
│   │   ├── Park.js           # Island attractions, features, hours, rating
│   │   ├── PricingSettings.js# Tax jurisdiction, percentage, passenger base fares
│   │   └── AuditLog.js       # Administrative action audit trail
│   ├── routes/               # API Endpoints
│   │   ├── auth.js           # Register, login, me, profile updates
│   │   ├── bookings.js       # Customer & admin booking management, refunds
│   │   ├── schedules.js      # Timetable CRUD & delay dispatch
│   │   ├── ferries.js        # Fleet vessel CRUD & load monitoring
│   │   ├── routes.js         # Nautical routes & terminal data
│   │   ├── alerts.js         # Service advisory broadcasts
│   │   ├── parks.js          # Park attraction directory CRUD
│   │   ├── pricing.js        # GST and base fare management
│   │   ├── tickets.js        # Optical barcode verification & scanner simulator
│   │   └── admin.js          # Admin dashboard metrics, user registry, audit logs
│   └── scripts/              # Automated verification & data utilities
│       ├── verifyAllRequirements.js # 37/37 automated test suite
│       ├── testE2E.js               # E2E integration verification
│       ├── syncInitialData.js       # Non-destructive data synchronizer
│       └── migrateContactFields.js  # Passenger contact data normalization
└── docs/                     # Project Handover & Research Documentation
    ├── SETUP_HANDOVER.md
    └── RESEARCH_PAPER_EDA_INSIGHTS.md
```

---

## 3. Environment Variables

Create `.env` in the `server/` directory:

```env
# Server Port
PORT=5000

# MongoDB Connection String (Local or Cloud)
MONGO_URI=mongodb://127.0.0.1:27017/pfr_ferry

# JWT Signing Secret (Use a cryptographically secure random string in production)
JWT_SECRET=your_jwt_secret_key_here

# Frontend Application Origin
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

> [!CAUTION]
> Never commit `.env` or production credentials to version control. The `.gitignore` file is configured to exclude all `.env` files.

---

## 4. Local Installation & Startup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or later (Node v20+ recommended)
- **MongoDB**: Community Server v7.0+ running on `mongodb://127.0.0.1:27017`

### Step 1: Start MongoDB
Ensure MongoDB service is running locally:
```powershell
# Windows Service check:
Get-Service -Name MongoDB
```
Or start via mongod command:
```powershell
mongod --dbpath "C:\data\db"
```

### Step 2: Start the Backend Express API
```powershell
cd server
npm install
node index.js
```
The server will initialize on port 5000 and log:
```
Server listening on port 5000 in development mode
MongoDB connected: mongodb://127.0.0.1:27017/pfr_ferry
```

### Step 3: Start the Frontend Vite Development Server
In the project root directory:
```powershell
npm install
npm run dev
```
The application will be accessible at **`http://localhost:5173`**.

---

## 5. Administrative Access & Credentials

The application uses role-based access control (RBAC). Protected administrative routes require an account with `role: "admin"` or `role: "staff"`.

### Built-in Administrator Provisioning
- **Admin Portal URL**: Navigate to `/admin` or click "Harbour Admin" in the footer/header.
- **Email**: `admin@pfr.test`
- **Password**: `admin123`
- **Role**: `admin`

### Citizen / Test Passenger Provisioning
- **Email**: `sarah.jenkins@example.com`
- **Password**: `passenger123`
- **Role**: `citizen`

> [!NOTE]
> Ordinary citizen accounts attempting to invoke administrative endpoints (e.g. `POST /api/schedules`, `PUT /api/pricing`, `GET /api/admin/users`) receive an HTTP `403 Forbidden` response.

---

## 6. Available REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new citizen account |
| POST | `/api/auth/login` | Public | Authenticate user and issue JWT |
| GET | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| PUT | `/api/auth/profile` | Authenticated | Update name or phone |
| POST | `/api/auth/logout` | Authenticated | Terminate session |

### Ferry Schedules (`/api/schedules`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| GET | `/api/schedules` | Public | List active scheduled departures (filterable by route/status) |
| POST | `/api/schedules` | Admin | Create new schedule or relief sailing |
| PUT | `/api/schedules/:id` | Admin | Update departure time, delay minutes, status, or gate |
| DELETE | `/api/schedules/:id` | Admin | Deactivate a scheduled departure |

### Fleet & Vessels (`/api/ferries`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| GET | `/api/ferries` | Public | List fleet vessels with current load and specs |
| POST | `/api/ferries` | Admin | Commission new vessel to fleet |
| PUT | `/api/ferries/:id` | Admin | Update status, load, captain, or route |
| DELETE | `/api/ferries/:id` | Admin | Set vessel to maintenance / decommission |

### Ticketing & Bookings (`/api/bookings`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| GET | `/api/bookings/my` | Authenticated | Retrieve authenticated user's digital passes |
| GET | `/api/bookings/:id` | Authenticated | View booking details (owner or admin only) |
| POST | `/api/bookings` | Authenticated | Create booking with capacity & duplicate checks |
| POST | `/api/bookings/:id/cancel` | Authenticated | Cancel booking and process refund |

### Service Alerts (`/api/alerts`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| GET | `/api/alerts` | Public | Get active public service alerts |
| GET | `/api/alerts/all` | Admin | Get all active and archived alerts |
| POST | `/api/alerts` | Admin | Broadcast new service advisory |
| PUT | `/api/alerts/:id` | Admin | Toggle active status or update message |
| DELETE | `/api/alerts/:id` | Admin | Permanently delete service alert |

### Parks & Attractions (`/api/parks`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| GET | `/api/parks` | Public | List parks, beaches, and attractions |
| POST | `/api/parks` | Admin | Add new park or attraction |
| PUT | `/api/parks/:id` | Admin | Update attraction details or amenities |
| DELETE | `/api/parks/:id` | Admin | Delete park attraction |

### Pricing & GST (`/api/pricing`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| GET | `/api/pricing` | Public | Get current fares, GST rate, and currency |
| PUT | `/api/pricing` | Admin | Update tax percentage and fare structure |

### Turnstile Scanner (`/api/tickets`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| GET | `/api/tickets/verify/:code` | Public | Validate ticket code status |
| POST | `/api/tickets/scan` | Admin/Staff | Scan optical barcode at turnstile |

### Administration & Metrics (`/api/admin`)
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Aggregate revenue, passenger counts, fleet stats |
| GET | `/api/admin/users` | Admin | List and search registered users |
| PUT | `/api/admin/users/:id` | Admin | Change role (`citizen`/`staff`/`admin`) or toggle active |
| GET | `/api/admin/bookings` | Admin | List all bookings with search and filters |
| GET | `/api/admin/audit-logs` | Admin | View immutable administrative audit trail |

---

## 7. Testing & Verification

### Run the Full 37-Test Suite
```powershell
node server/scripts/verifyAllRequirements.js
```
This script executes non-destructive tests covering:
- Database connectivity and data preservation
- Admin panel endpoints (Schedules, Fleet, Alerts, Parks, Pricing, Users, Bookings)
- RBAC protection (verifying 403 Forbidden for non-admins)
- Booking creation and server-side GST calculations
- Turnstile barcode scanner simulation
- Capacity limit enforcement and duplicate submission prevention
- Contact name mapping verification

### Build for Production
```powershell
npm run build
```
Generates optimized static assets in the `dist/` directory.

---

## 8. Known Limitations & Future External Integrations

1. **City of Toronto Open Data Live Vessel Tracking**:
   - The City of Toronto Open Data portal currently publishes static schedules and general facility assets. A real-time GPS telemetry feed (e.g. NMEA / AIS transponder broadcast) for Toronto Island ferries is not publicly exposed by PortsToronto without private port authority credentials.
   - The system gracefully provides verified scheduled departure tracking and displays telemetry based on verified vessel parameters rather than simulating artificial vessel movement.
2. **Payment Gateway**:
   - The platform includes a PRESTO Card and Credit Card simulation clearance engine. Production deployment requires plugging in Moneris, Stripe, or Chase Paymentech merchant gateway credentials.
3. **SMS Alerts**:
   - The alerts system is ready for Twilio or AWS SNS integration for outbound SMS subscriber alerts.

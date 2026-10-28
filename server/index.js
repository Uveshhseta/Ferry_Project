import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

// Routes
import authRoutes from './routes/auth.js';
import routeRoutes from './routes/routes.js';
import scheduleRoutes from './routes/schedules.js';
import ferryRoutes from './routes/ferries.js';
import alertRoutes from './routes/alerts.js';
import parkRoutes from './routes/parks.js';
import pricingRoutes from './routes/pricing.js';
import bookingRoutes from './routes/bookings.js';
import ticketRoutes from './routes/tickets.js';
import adminRoutes from './routes/admin.js';

import { syncInitialData } from './scripts/syncInitialData.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pfr_ferry';

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    service: 'Toronto Island Ferry Services API',
    database: {
      status: states[dbState] || 'unknown',
      name: mongoose.connection.name || 'pfr_ferry',
      host: mongoose.connection.host || '127.0.0.1'
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/ferries', ferryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/parks', parkRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[API Server Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log(`[MongoDB Connected] Successfully connected to: ${MONGODB_URI}`);
    await syncInitialData();
    app.listen(PORT, () => {
      console.log(`[Toronto Ferry API Server] Listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB Connection Error] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import eventRoutes from './routes/event.routes.js';
import queryRoutes from './routes/query.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import activityRoutes from './routes/activity.routes.js';
import fileRoutes from './routes/file.routes.js';
import healthRoutes from './routes/health.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || 'http://localhost:5173';

// ===============================
// CORS
// ===============================
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin
      // and allow frontend requests
      if (
        !origin ||
        origin.includes('localhost') ||
        origin === FRONTEND_URL
      ) {
        callback(null, true);
      } else {
        // Flexible fallback for deployment
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// ===============================
// BODY PARSERS
// ===============================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ===============================
// ROOT ROUTE
// ===============================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NotifyHub Backend is running',
    service: 'NotifyHub API',
    health: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// ===============================
// API ROUTES
// ===============================

// Health check
app.use('/api', healthRoutes);

// Authentication
app.use('/api/auth', authRoutes);

// Announcements
app.use('/api/announcements', announcementRoutes);

// Events
app.use('/api/events', eventRoutes);

// Queries
app.use('/api/queries', queryRoutes);

// Notifications
app.use('/api/notifications', notificationRoutes);

// Activity logs
app.use('/api/activity', activityRoutes);

// Files
app.use('/api/files', fileRoutes);

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `🚀 NotifyHub Backend Server running on port ${PORT}`
  );

  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`❤️ Health: /api/health`);
  console.log(`📢 Announcements: /api/announcements`);
  console.log(`📅 Events: /api/events`);
  console.log(`❓ Queries: /api/queries`);
  console.log(`🔔 Notifications: /api/notifications`);
});
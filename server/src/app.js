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

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: true,
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
  res.json({
    success: true,
    message: 'NotifyHub Backend API is running 🚀',
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'NotifyHub Backend is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// ===============================
// API ROUTES
// ===============================

app.use('/api/auth', authRoutes);

app.use('/api/announcements', announcementRoutes);

app.use('/api/events', eventRoutes);

app.use('/api/queries', queryRoutes);

app.use('/api/notifications', notificationRoutes);

app.use('/api/activity', activityRoutes);

app.use('/api/files', fileRoutes);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NotifyHub Backend Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`❤️ Health: /api/health`);
});
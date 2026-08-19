import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Ping database
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      status: 'OK',
      service: 'NotifyHub API',
      timestamp: new Date().toISOString(),
      database: 'Connected',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'ERROR',
      service: 'NotifyHub API',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: err.message,
    });
  }
});

export default router;

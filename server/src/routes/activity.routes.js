import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/activity - Retrieve system activity logs
router.get('/', requireAuth, requireRole('ADMIN', 'HOD'), async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
      },
    });

    return res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch activity logs' });
  }
});

export default router;

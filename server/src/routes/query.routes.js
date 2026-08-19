import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/authMiddleware.js';
import { logActivity } from '../lib/activityLogger.js';

const router = express.Router();

// GET /api/queries - Fetch queries
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, category, studentId, search } = req.query;

    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (studentId) {
      where.OR = [
        { studentId: studentId },
        { studentEmail: studentId },
      ];
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { subject: { contains: q } },
            { description: { contains: q } },
            { studentName: { contains: q } },
            { studentId: { contains: q } },
          ],
        },
      ];
    }

    // Role-based scoping for HOD / Faculty
    if (req.user) {
      if (req.user.role === 'FACULTY') {
        where.OR = [
          ...(where.OR || []),
          { assignedToId: req.user.id },
          { category: 'ACADEMIC' },
          { category: 'EXAM' },
        ];
      }
    }

    const queries = await prisma.query.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
      },
    });

    return res.json({ success: true, count: queries.length, data: queries });
  } catch (err) {
    console.error('Fetch queries error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch student queries' });
  }
});

// GET /api/queries/:id
router.get('/:id', async (req, res) => {
  try {
    const query = await prisma.query.findUnique({
      where: { id: req.params.id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
      },
    });

    if (!query) {
      return res.status(404).json({ success: false, error: 'Query not found' });
    }

    return res.json({ success: true, data: query });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching query details' });
  }
});

// POST /api/queries - Create a new student query (Public)
router.post('/', async (req, res) => {
  try {
    const { subject, description, category = 'GENERAL', studentName, studentEmail, studentId } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ success: false, error: 'Subject and description are required' });
    }

    const query = await prisma.query.create({
      data: {
        subject,
        description,
        category,
        studentName: studentName || 'Anonymous Student',
        studentEmail: studentEmail || null,
        studentId: studentId || null,
        status: 'OPEN',
      },
    });

    // Create Notification for admin staff
    await prisma.notification.create({
      data: {
        title: '💬 NEW STUDENT QUERY',
        message: `Query #${query.id.substring(0, 8)}: "${subject}" submitted by ${query.studentName}`,
        type: 'QUERY',
        relatedId: query.id,
      },
    });

    return res.status(201).json({
      success: true,
      data: query,
      message: 'Query submitted successfully! You can track status using your Student ID or Query ID.',
    });
  } catch (err) {
    console.error('Submit query error:', err);
    return res.status(500).json({ success: false, error: 'Failed to submit query' });
  }
});

// PUT /api/queries/:id - Admin/HOD/Faculty update response or status
router.put('/:id', requireAuth, requireRole('ADMIN', 'HOD', 'FACULTY'), async (req, res) => {
  try {
    const existing = await prisma.query.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Query ticket not found' });
    }

    const { status, response, assignedToId } = req.body;

    const dataToUpdate = {
      ...(status && { status }),
      ...(response !== undefined && { response }),
      ...(assignedToId !== undefined && { assignedToId }),
    };

    if (status === 'RESOLVED' && existing.status !== 'RESOLVED') {
      dataToUpdate.resolvedAt = new Date();
    }

    const updated = await prisma.query.update({
      where: { id: req.params.id },
      data: dataToUpdate,
      include: {
        assignedTo: {
          select: { id: true, name: true, role: true, department: true },
        },
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        title: `💬 QUERY RESPONSE [${updated.status}]`,
        message: `Response updated for query: "${updated.subject}"`,
        type: 'QUERY_RESPONSE',
        relatedId: updated.id,
      },
    });

    await logActivity(
      req.user.id,
      status === 'RESOLVED' ? 'RESOLVE_QUERY' : 'UPDATE_QUERY',
      'Query',
      updated.id,
      `Updated query #${updated.id.substring(0, 8)} status to ${updated.status}`
    );

    return res.json({ success: true, data: updated, message: 'Query updated successfully' });
  } catch (err) {
    console.error('Update query error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update query ticket' });
  }
});

export default router;

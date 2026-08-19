import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/authMiddleware.js';
import { logActivity } from '../lib/activityLogger.js';

const router = express.Router();

// GET /api/events - Fetch campus events
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { department, year, registrationStatus, search } = req.query;

    const where = {};

    if (registrationStatus && registrationStatus !== 'ALL') {
      where.registrationStatus = registrationStatus;
    }

    if (department && department !== 'ALL') {
      where.OR = [
        { targetDepartment: 'ALL' },
        { targetDepartment: department },
      ];
    }

    if (year && year !== 'ALL') {
      where.targetYear = { in: ['ALL', year] };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { venue: { contains: q } },
            { organizer: { contains: q } },
          ],
        },
      ];
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
      },
    });

    return res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    console.error('Fetch events error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    return res.json({ success: true, data: event });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error retrieving event' });
  }
});

// POST /api/events - Create new campus event
router.post('/', requireAuth, requireRole('ADMIN', 'HOD', 'FACULTY'), async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      venue,
      organizer,
      registrationDeadline,
      registrationStatus = 'OPEN',
      targetDepartment = 'ALL',
      targetYear = 'ALL',
      attachmentName,
      attachmentType,
      attachmentData,
    } = req.body;

    if (!title || !description || !startDate || !venue) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, start date, and venue are required',
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(startDate),
        venue,
        organizer: organizer || req.user.name,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        registrationStatus,
        targetDepartment,
        targetYear,
        attachmentName,
        attachmentType,
        attachmentData,
        createdById: req.user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        title: '🚀 NEW CAMPUS EVENT',
        message: `${title} at ${venue}`,
        type: 'EVENT',
        relatedId: event.id,
      },
    });

    await logActivity(
      req.user.id,
      'CREATE_EVENT',
      'Event',
      event.id,
      `Created event: "${title}"`
    );

    return res.status(201).json({ success: true, data: event, message: 'Event created successfully' });
  } catch (err) {
    console.error('Create event error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', requireAuth, requireRole('ADMIN', 'HOD', 'FACULTY'), async (req, res) => {
  try {
    const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (req.user.role === 'FACULTY' && existing.createdById !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Faculty can only edit their own events' });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      venue,
      organizer,
      registrationDeadline,
      registrationStatus,
      targetDepartment,
      targetYear,
      attachmentName,
      attachmentType,
      attachmentData,
    } = req.body;

    const updated = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(venue && { venue }),
        ...(organizer && { organizer }),
        ...(registrationDeadline !== undefined && {
          registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        }),
        ...(registrationStatus && { registrationStatus }),
        ...(targetDepartment && { targetDepartment }),
        ...(targetYear && { targetYear }),
        ...(attachmentName !== undefined && { attachmentName }),
        ...(attachmentType !== undefined && { attachmentType }),
        ...(attachmentData !== undefined && { attachmentData }),
      },
    });

    await logActivity(
      req.user.id,
      'UPDATE_EVENT',
      'Event',
      updated.id,
      `Updated event: "${updated.title}"`
    );

    return res.json({ success: true, data: updated, message: 'Event updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', requireAuth, requireRole('ADMIN', 'HOD', 'FACULTY'), async (req, res) => {
  try {
    const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (req.user.role === 'FACULTY' && existing.createdById !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Faculty can only delete their own events' });
    }

    await prisma.event.delete({ where: { id: req.params.id } });

    await logActivity(
      req.user.id,
      'DELETE_EVENT',
      'Event',
      req.params.id,
      `Deleted event: "${existing.title}"`
    );

    return res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
});

export default router;

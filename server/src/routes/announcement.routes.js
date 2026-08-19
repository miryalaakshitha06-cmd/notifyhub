import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/authMiddleware.js';
import { logActivity } from '../lib/activityLogger.js';

const router = express.Router();

// GET /api/announcements - Fetch announcements with search & filter
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, priority, status, department, year, search, sort } = req.query;

    const where = {};

    // For public students, show PUBLISHED by default unless admin requests specific status
    if (status) {
      where.status = status;
    } else if (!req.user) {
      where.status = 'PUBLISHED';
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (priority && priority !== 'ALL') {
      where.priority = priority;
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
          ],
        },
      ];
    }

    const orderBy = sort === 'oldest' ? { publishedAt: 'asc' } : { publishedAt: 'desc' };

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
      },
    });

    return res.json({ success: true, count: announcements.length, data: announcements });
  } catch (err) {
    console.error('Fetch announcements error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch announcements' });
  }
});

// GET /api/announcements/:id
router.get('/:id', async (req, res) => {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
      },
    });

    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    return res.json({ success: true, data: announcement });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error retrieving announcement' });
  }
});

// POST /api/announcements - Create announcement (ADMIN, HOD, FACULTY)
router.post('/', requireAuth, requireRole('ADMIN', 'HOD', 'FACULTY'), async (req, res) => {
  try {
    const {
      title,
      description,
      category = 'GENERAL',
      priority = 'NORMAL',
      status = 'PUBLISHED',
      targetDepartment = 'ALL',
      targetYear = 'ALL',
      attachmentName,
      attachmentType,
      attachmentData,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    // Role scoping: HOD/FACULTY department check if specified
    let dept = targetDepartment;
    if (req.user.role === 'HOD' || req.user.role === 'FACULTY') {
      if (req.user.department && targetDepartment === 'ALL') {
        dept = req.user.department;
      }
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        category,
        priority,
        status,
        targetDepartment: dept,
        targetYear,
        attachmentName,
        attachmentType,
        attachmentData,
        createdById: req.user.id,
        publishedAt: new Date(),
      },
      include: {
        createdBy: {
          select: { id: true, name: true, role: true, department: true },
        },
      },
    });

    // Create Notification if URGENT or IMPORTANT
    if (priority === 'URGENT' || priority === 'IMPORTANT') {
      await prisma.notification.create({
        data: {
          title: priority === 'URGENT' ? '🚨 URGENT ANNOUNCEMENT' : '📌 IMPORTANT ANNOUNCEMENT',
          message: title,
          type: priority === 'URGENT' ? 'URGENT' : 'ANNOUNCEMENT',
          relatedId: announcement.id,
        },
      });
    }

    await logActivity(
      req.user.id,
      'CREATE_ANNOUNCEMENT',
      'Announcement',
      announcement.id,
      `Created [${priority}] announcement: "${title}"`
    );

    return res.status(201).json({ success: true, data: announcement, message: 'Announcement created successfully' });
  } catch (err) {
    console.error('Create announcement error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create announcement' });
  }
});

// PUT /api/announcements/:id - Update announcement
router.put('/:id', requireAuth, requireRole('ADMIN', 'HOD', 'FACULTY'), async (req, res) => {
  try {
    const existing = await prisma.announcement.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    // Faculty can only edit their own announcement, HOD/ADMIN can edit department/all
    if (req.user.role === 'FACULTY' && existing.createdById !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Faculty can only edit their own announcements' });
    }

    const {
      title,
      description,
      category,
      priority,
      status,
      targetDepartment,
      targetYear,
      attachmentName,
      attachmentType,
      attachmentData,
    } = req.body;

    const updated = await prisma.announcement.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(targetDepartment && { targetDepartment }),
        ...(targetYear && { targetYear }),
        ...(attachmentName !== undefined && { attachmentName }),
        ...(attachmentType !== undefined && { attachmentType }),
        ...(attachmentData !== undefined && { attachmentData }),
      },
    });

    await logActivity(
      req.user.id,
      'UPDATE_ANNOUNCEMENT',
      'Announcement',
      updated.id,
      `Updated announcement: "${updated.title}"`
    );

    return res.json({ success: true, data: updated, message: 'Announcement updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update announcement' });
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', requireAuth, requireRole('ADMIN', 'HOD', 'FACULTY'), async (req, res) => {
  try {
    const existing = await prisma.announcement.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    if (req.user.role === 'FACULTY' && existing.createdById !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Faculty can only delete their own announcements' });
    }

    await prisma.announcement.delete({ where: { id: req.params.id } });

    await logActivity(
      req.user.id,
      'DELETE_ANNOUNCEMENT',
      'Announcement',
      req.params.id,
      `Deleted announcement: "${existing.title}"`
    );

    return res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete announcement' });
  }
});

export default router;

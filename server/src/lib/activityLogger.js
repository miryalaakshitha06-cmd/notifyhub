import prisma from './prisma.js';

export async function logActivity(userId, action, entity, entityId = null, details = null) {
  try {
    if (!userId) return;
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        details: details ? String(details) : null,
      },
    });
  } catch (err) {
    console.error('Failed to record activity log:', err.message);
  }
}

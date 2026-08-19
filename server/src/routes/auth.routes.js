import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { logActivity } from '../lib/activityLogger.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'notifyhub_secret_jwt_key_2026_super_secure';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Role check if login route specified role
    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        error: `Account role '${user.role}' is not authorized to log in via ${expectedRole} portal`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('notifyhub_token', token, {
      httpOnly: true,
      secure: false, // development environment
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logActivity(user.id, 'LOGIN', 'User', user.id, `User logged in as ${user.role}`);

    const { passwordHash: _, ...userData } = user;

    return res.json({
      success: true,
      user: userData,
      token,
      message: 'Login successful',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during login' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  try {
    if (req.user) {
      await logActivity(req.user.id, 'LOGOUT', 'User', req.user.id, 'User logged out');
    }
    res.clearCookie('notifyhub_token');
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Logout error' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

export default router;

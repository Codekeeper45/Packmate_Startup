import { Router } from 'express';
import { redirectToGoogle, googleCallback, logout, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Initiate Google OAuth flow
router.get('/google', redirectToGoogle);

// Google redirects back here with ?code=
router.get('/google/callback', googleCallback);

// Invalidate session
router.post('/logout', logout);

// Return current user info (protected)
router.get('/me', requireAuth, getMe);

export default router;

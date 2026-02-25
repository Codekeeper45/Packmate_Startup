import { Request, Response, NextFunction } from 'express';
import { getGoogleAuthUrl, exchangeCodeForUser } from '../services/authService';
import { signToken, JWT_COOKIE_MAX_AGE } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';

// GET /auth/google
export function redirectToGoogle(_req: Request, res: Response): void {
  res.redirect(getGoogleAuthUrl());
}

// GET /auth/google/callback?code=...
export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const code = req.query.code as string | undefined;
    if (!code) throw new AppError('Missing authorization code.', 400);

    const user = await exchangeCodeForUser(code);

    const token = signToken({ userId: user.id, email: user.email });

    // HTTP-only cookie – inaccessible from JS
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_COOKIE_MAX_AGE,
    });

    // Redirect back to frontend
    res.redirect(`${process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'}/dashboard`);
  } catch (err) {
    next(err);
  }
}

// POST /auth/logout
export function logout(_req: Request, res: Response): void {
  res.clearCookie('token');
  res.json({ success: true, data: null });
}

// GET /auth/me
export function getMe(req: AuthenticatedRequest, res: Response): void {
  res.json({ success: true, data: req.user });
}

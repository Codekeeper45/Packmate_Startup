/**
 * Stub auth middleware — no JWT/cookies needed.
 * Reads optional ?userId= query param, falls back to the seeded test user.
 * In real mode this file is NOT used.
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { db } from './store';

export function stubRequireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const userId = (req.query.userId as string | undefined) ?? db.user.getTestUser().id;
  const user = db.user.findUnique(userId) ?? db.user.getTestUser();
  req.user = { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
  next();
}

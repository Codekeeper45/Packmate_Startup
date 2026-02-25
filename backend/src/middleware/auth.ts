import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../lib/prisma';
import { AppError } from './errorHandler';
import { AuthenticatedRequest } from '../types';

export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Accept token from HTTP-only cookie OR Authorization: Bearer header
    const token: string | undefined =
      req.cookies?.token ??
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : undefined);

    if (!token) throw new AppError('Authentication required.', 401);

    const payload = verifyToken(token);

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, avatar: true },
    });
    if (!user) throw new AppError('User not found.', 401);

    req.user = user;
    next();
  } catch (err) {
    // Any JWT error (expired, invalid signature, etc.)
    if (err instanceof AppError) return next(err);
    next(new AppError('Invalid or expired token.', 401));
  }
}

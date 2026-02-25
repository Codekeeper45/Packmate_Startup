import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Custom application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
    return;
  }

  // Prisma unique constraint violation (P2002)
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2002'
  ) {
    res.status(409).json({ success: false, error: 'Resource already exists.' });
    return;
  }

  // Generic fallback
  const message = err instanceof Error ? err.message : 'Internal server error';
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err);
  }
  res.status(500).json({ success: false, error: message });
}

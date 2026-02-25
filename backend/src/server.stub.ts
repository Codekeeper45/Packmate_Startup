/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║               PACKMATE  —  STUB SERVER                ║
 * ║   Runs entirely in-memory. No DB / OpenAI / Google.   ║
 * ║   Start:  npm run dev:stub                            ║
 * ╚═══════════════════════════════════════════════════════╝
 */
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { db } from './stub/store';
import { getMockWeatherForecast } from './stub/mockWeather';
import { getMockPackingList } from './stub/mockAI';
import { stubRequireAuth } from './stub/stubAuth';
import { tripSchema, updateListSchema, templateSchema } from './middleware/validate';
import { errorHandler, AppError } from './middleware/errorHandler';
import { AuthenticatedRequest } from './types';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', mode: 'STUB', timestamp: new Date().toISOString() });
});

// ─── Auth (stub) ─────────────────────────────────────────────────────────────

// GET /auth/me
app.get('/auth/me', stubRequireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: req.user });
});

// GET /auth/google  → In stub mode just log in the test user
app.get('/auth/google', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      message: '[STUB] Google OAuth not active. Use GET /auth/me directly.',
      testUser: db.user.getTestUser(),
    },
  });
});

// POST /auth/logout
app.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, data: null });
});

// ─── Generate ─────────────────────────────────────────────────────────────────

app.post('/api/generate', stubRequireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tripInput = tripSchema.parse(req.body);
    const shouldSave: boolean = req.body.save === true;

    // Mock weather
    const weather = getMockWeatherForecast(
      tripInput.location,
      new Date(tripInput.startDate),
      new Date(tripInput.endDate),
    );

    // Mock AI
    const packingList = getMockPackingList(tripInput, weather);

    // Optionally persist
    let savedTrip = null;
    if (shouldSave && req.user) {
      savedTrip = db.trip.create({
        userId: req.user.id,
        location: tripInput.location,
        startDate: new Date(tripInput.startDate),
        endDate: new Date(tripInput.endDate),
        accommodation: tripInput.accommodation,
        activityLevel: tripInput.activityLevel,
        weatherContext: weather,
      });
      db.packingList.upsertForTrip(savedTrip.id, req.user.id, packingList);
      savedTrip = db.trip.findOne(savedTrip.id, req.user.id);
    }

    res.json({ success: true, data: { packingList, weather, trip: savedTrip } });
  } catch (err) {
    next(err);
  }
});

// ─── Trips ────────────────────────────────────────────────────────────────────

// POST /api/trips
app.post('/api/trips', stubRequireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = tripSchema.parse(req.body);
    const trip = db.trip.create({
      userId: req.user!.id,
      location: body.location,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      accommodation: body.accommodation,
      activityLevel: body.activityLevel,
      weatherContext: null,
    });
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
});

// GET /api/trips
app.get('/api/trips', stubRequireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: db.trip.findMany(req.user!.id) });
});

// GET /api/trips/:id
app.get('/api/trips/:id', stubRequireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const trip = db.trip.findOne(id, req.user!.id);
    if (!trip) throw new AppError('Trip not found.', 404);
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
});

// PUT /api/trips/:id/list
app.put('/api/trips/:id/list', stubRequireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { content } = updateListSchema.parse(req.body);
    const trip = db.trip.findOne(id, req.user!.id);
    if (!trip) throw new AppError('Trip not found.', 404);
    const list = db.packingList.upsertForTrip(id, req.user!.id, content);
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/trips/:id
app.delete('/api/trips/:id', stubRequireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const trip = db.trip.findOne(id, req.user!.id);
    if (!trip) throw new AppError('Trip not found.', 404);
    db.trip.delete(id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
});

// ─── Templates ────────────────────────────────────────────────────────────────

// POST /api/templates
app.post('/api/templates', stubRequireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, content } = templateSchema.parse(req.body);
    const template = db.packingList.createTemplate(req.user!.id, name, content);
    res.status(201).json({ success: true, data: template });
  } catch (err) {
    next(err);
  }
});

// GET /api/templates
app.get('/api/templates', stubRequireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: db.packingList.findTemplates(req.user!.id) });
});

// GET /api/templates/:id
app.get('/api/templates/:id', stubRequireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const template = db.packingList.findTemplateById(id, req.user!.id);
    if (!template) throw new AppError('Template not found.', 404);
    res.json({ success: true, data: template });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/templates/:id
app.delete('/api/templates/:id', stubRequireAuth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const template = db.packingList.findTemplateById(id, req.user!.id);
    if (!template) throw new AppError('Template not found.', 404);
    db.packingList.delete(id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║     PACKMATE STUB SERVER IS RUNNING       ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`\n  URL    : http://localhost:${PORT}`);
  console.log(`  Health : http://localhost:${PORT}/health`);
  console.log(`  Auth   : http://localhost:${PORT}/auth/me`);
  console.log('\n  No DB / No OpenAI / No Google OAuth needed.');
  console.log('  All requests auto-authenticate as: test@packmate.dev\n');
});

export default app;

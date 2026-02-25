import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import generateRoutes from './routes/generate';
import templateRoutes from './routes/templates';
import { errorHandler } from './middleware/errorHandler';

// ─────────────────────────────────────────────
//  App setup
// ─────────────────────────────────────────────
const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // required for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ─────────────────────────────────────────────
//  Health check
// ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/templates', templateRoutes);

// ─────────────────────────────────────────────
//  404 handler
// ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ─────────────────────────────────────────────
//  Global error handler (must be last)
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
//  Start server
// ─────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 4000);

app.listen(PORT, () => {
  console.log(`\n🚀 Packmate API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`   Client CORS  : ${CLIENT_ORIGIN}\n`);
});

export default app;

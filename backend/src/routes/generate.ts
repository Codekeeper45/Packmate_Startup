import { Router } from 'express';
import { generate } from '../controllers/generateController';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * POST /api/generate
 * Body: TripInput + optional { save: boolean }
 * Protected — user context used to optionally persist the trip.
 */
router.post('/', requireAuth, generate);

export default router;

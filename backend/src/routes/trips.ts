import { Router } from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updatePackingList,
  deleteTrip,
} from '../controllers/tripController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id/list', updatePackingList);
router.delete('/:id', deleteTrip);

export default router;

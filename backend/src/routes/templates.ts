import { Router } from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  deleteTemplate,
} from '../controllers/templateController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/', createTemplate);
router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.delete('/:id', deleteTemplate);

export default router;

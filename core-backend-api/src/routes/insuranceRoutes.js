import { Router } from 'express';
import {
  getAdjustmentLogs,
  getPlanById,
  getPlans,
} from '../controllers/insuranceController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/plans', getPlans);
router.get('/plans/:id', getPlanById);
router.get('/adjustments', requireAuth, requireAdmin, getAdjustmentLogs);

export default router;

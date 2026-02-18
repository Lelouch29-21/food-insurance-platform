import { Router } from 'express';
import {
  createFood,
  deleteFood,
  getFood,
  getFoodById,
  updateFood,
} from '../controllers/foodController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { foodUpsertValidator } from '../validators/foodValidators.js';

const router = Router();

router.get('/', getFood);
router.get('/:id', getFoodById);
router.post('/', requireAuth, requireAdmin, foodUpsertValidator, validate, createFood);
router.put('/:id', requireAuth, requireAdmin, foodUpsertValidator, validate, updateFood);
router.delete('/:id', requireAuth, requireAdmin, deleteFood);

export default router;

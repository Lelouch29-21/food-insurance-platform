import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderValidator } from '../validators/orderValidators.js';

const router = Router();

router.use(requireAuth);
router.post('/', createOrderValidator, validate, createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.delete('/:id', deleteOrder);

export default router;

import { Router } from 'express';
import authRoutes from './authRoutes.js';
import foodRoutes from './foodRoutes.js';
import orderRoutes from './orderRoutes.js';
import insuranceRoutes from './insuranceRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/food', foodRoutes);
router.use('/orders', orderRoutes);
router.use('/insurance', insuranceRoutes);

export default router;

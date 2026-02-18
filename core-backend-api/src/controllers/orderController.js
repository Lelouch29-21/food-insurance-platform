import mongoose from 'mongoose';
import FoodItem from '../models/FoodItem.js';
import Order from '../models/Order.js';
import {
  applyInterestAdjustment,
  computeAdjustment,
  reverseInterestAdjustmentForOrder,
  withTransaction,
} from '../services/interestEngine.js';

function createHttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function calculateHealthyPercentage(orderLines) {
  const totalQty = orderLines.reduce((sum, row) => sum + row.quantity, 0);
  if (!totalQty) return 0;

  const weightedHealth = orderLines.reduce((sum, row) => sum + row.healthScore * row.quantity, 0);
  return Number(((weightedHealth / (totalQty * 100)) * 100).toFixed(2));
}

export async function createOrder(req, res, next) {
  try {
    const { items, planId } = req.body;

    const ids = items.map((item) => item.foodItemId);
    const foodItems = await Promise.all(
      ids.map((id) => FoodItem.findOne({ _id: id, isActive: true }).lean()),
    );
    if (foodItems.some((item) => !item)) {
      throw createHttpError(400, 'Some food items are invalid or inactive');
    }

    const foodMap = new Map(foodItems.map((fi) => [fi._id.toString(), fi]));

    const normalizedItems = items.map((entry) => {
      const food = foodMap.get(entry.foodItemId);
      return {
        foodItemId: entry.foodItemId,
        quantity: entry.quantity,
        priceAtPurchase: food.price,
        healthScore: food.healthScore,
      };
    });

    const totalAmount = Number(
      normalizedItems.reduce((sum, row) => sum + row.priceAtPurchase * row.quantity, 0).toFixed(2),
    );

    const healthyPercentage = calculateHealthyPercentage(normalizedItems);

    const result = await withTransaction(async (session) => {
      const [order] = await Order.create(
        [
          {
            userId: req.user.id,
            items: normalizedItems.map((row) => ({
              foodItemId: row.foodItemId,
              quantity: row.quantity,
              priceAtPurchase: row.priceAtPurchase,
            })),
            totalAmount,
            healthyPercentage,
          },
        ],
        { session },
      );

      const { adjustment, reason } = await computeAdjustment({
        userId: req.user.id,
        totalAmount,
        healthyPercentage,
        session,
      });

      const plan = await applyInterestAdjustment({
        userId: req.user.id,
        orderId: order._id,
        planId,
        adjustment,
        reason,
        session,
      });

      return {
        order,
        interest: {
          adjustment,
          reason,
          newRate: plan.currentInterestRate,
        },
      };
    });

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
  return res.json({ orders });
}

export async function getOrderById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const isOwner = order.userId.toString() === req.user.id;
  if (!isOwner && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.json({ order });
}

export async function deleteOrder(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.userId.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await withTransaction(async (session) => {
      await reverseInterestAdjustmentForOrder({ orderId: order._id, session });
      await Order.deleteOne({ _id: order._id }).session(session);
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

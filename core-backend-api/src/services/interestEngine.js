import mongoose from 'mongoose';
import Order from '../models/Order.js';
import InsurancePlan from '../models/InsurancePlan.js';
import InterestAdjustmentLog from '../models/InterestAdjustmentLog.js';

function clampAdjustment(value) {
  return Math.min(2, Math.max(-1, Number(value.toFixed(2))));
}

export function calculateAdjustment({ totalAmount, healthyPercentage, recentOrderCount }) {
  let adjustment = 0;
  const reasons = [];

  if (totalAmount > 1000) {
    adjustment += 0.5;
    reasons.push('Order amount > 1000 (+0.5%)');
  }

  if (recentOrderCount > 5) {
    adjustment += 0.25;
    reasons.push('More than 5 orders in last 30 days (+0.25%)');
  }

  if (healthyPercentage > 60) {
    adjustment += 0.4;
    reasons.push('Healthy percentage > 60 (+0.4%)');
  }

  if (healthyPercentage < 30) {
    adjustment -= 0.3;
    reasons.push('Healthy percentage < 30 (-0.3%)');
  }

  return {
    adjustment: clampAdjustment(adjustment),
    reason: reasons.length ? reasons.join(' | ') : 'No adjustment',
  };
}

export async function computeAdjustment({ userId, totalAmount, healthyPercentage, now = new Date(), session }) {
  const since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentOrderCount = await Order.countDocuments({
    userId,
    createdAt: { $gte: since, $lte: now },
  }).session(session || null);

  return calculateAdjustment({ totalAmount, healthyPercentage, recentOrderCount });
}

export async function applyInterestAdjustment({ userId, orderId, planId, adjustment, reason, session }) {
  const plan = await InsurancePlan.findById(planId).session(session);
  if (!plan) {
    const err = new Error('Insurance plan not found');
    err.status = 404;
    throw err;
  }

  plan.currentInterestRate = Number((plan.currentInterestRate + adjustment).toFixed(4));
  plan.lastUpdated = new Date();
  await plan.save({ session });

  await InterestAdjustmentLog.create(
    [
      {
        userId,
        orderId,
        planId,
        adjustment,
        reason,
      },
    ],
    { session },
  );

  return plan;
}

export async function reverseInterestAdjustmentForOrder({ orderId, session }) {
  const log = await InterestAdjustmentLog.findOne({ orderId }).session(session);
  if (!log) return null;

  const plan = await InsurancePlan.findById(log.planId).session(session);
  if (!plan) return null;

  plan.currentInterestRate = Number((plan.currentInterestRate - log.adjustment).toFixed(4));
  plan.lastUpdated = new Date();
  await plan.save({ session });

  await InterestAdjustmentLog.deleteOne({ _id: log._id }).session(session);
  return plan;
}

export async function withTransaction(work) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

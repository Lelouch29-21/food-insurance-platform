import mongoose from 'mongoose';
import InsurancePlan from '../models/InsurancePlan.js';
import InterestAdjustmentLog from '../models/InterestAdjustmentLog.js';

export async function getPlans(req, res) {
  const plans = await InsurancePlan.find().sort({ createdAt: -1 }).lean();
  return res.json({ plans });
}

export async function getPlanById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const plan = await InsurancePlan.findById(req.params.id).lean();
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  return res.json({ plan });
}

export async function getAdjustmentLogs(req, res) {
  const logs = await InterestAdjustmentLog.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .populate('userId', 'name email')
    .populate('orderId', 'totalAmount healthyPercentage createdAt')
    .populate('planId', 'name currentInterestRate')
    .lean();

  return res.json({ logs });
}

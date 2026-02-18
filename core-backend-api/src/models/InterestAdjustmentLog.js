import mongoose from 'mongoose';

const interestAdjustmentLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePlan', required: true },
    adjustment: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model('InterestAdjustmentLog', interestAdjustmentLogSchema);

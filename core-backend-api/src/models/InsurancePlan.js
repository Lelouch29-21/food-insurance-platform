import mongoose from 'mongoose';

const insurancePlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    provider: {
      type: String,
      enum: ['Aditya Birla Sun Life Insurance (Demo Data)'],
      default: 'Aditya Birla Sun Life Insurance (Demo Data)',
    },
    baseInterestRate: { type: Number, required: true },
    currentInterestRate: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model('InsurancePlan', insurancePlanSchema);

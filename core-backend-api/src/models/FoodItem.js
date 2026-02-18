import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['VEG', 'NON_VEG', 'BEVERAGE', 'DESSERT'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    healthScore: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model('FoodItem', foodItemSchema);

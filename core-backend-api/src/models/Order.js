import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], validate: [(arr) => arr.length > 0, 'items required'] },
    totalAmount: { type: Number, required: true, min: 0 },
    healthyPercentage: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model('Order', orderSchema);

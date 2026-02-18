import mongoose from 'mongoose';
import FoodItem from '../models/FoodItem.js';

export async function getFood(req, res) {
  const items = await FoodItem.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  return res.json({ items });
}

export async function getFoodById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const item = await FoodItem.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: 'Food item not found' });
  return res.json({ item });
}

export async function createFood(req, res) {
  const item = await FoodItem.create(req.body);
  return res.status(201).json({ item });
}

export async function updateFood(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: 'Food item not found' });
  return res.json({ item });
}

export async function deleteFood(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const item = await FoodItem.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!item) return res.status(404).json({ message: 'Food item not found' });
  return res.status(204).send();
}

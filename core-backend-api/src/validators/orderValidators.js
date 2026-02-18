import { body } from 'express-validator';

export const createOrderValidator = [
  body('items').isArray({ min: 1 }),
  body('items.*.foodItemId').isMongoId(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('planId').isMongoId(),
];

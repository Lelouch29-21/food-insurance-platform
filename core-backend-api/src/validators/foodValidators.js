import { body } from 'express-validator';

export const foodUpsertValidator = [
  body('name').isString().trim().notEmpty(),
  body('category').isIn(['VEG', 'NON_VEG', 'BEVERAGE', 'DESSERT']),
  body('price').isFloat({ min: 0 }),
  body('healthScore').isInt({ min: 0, max: 100 }),
  body('isActive').optional().isBoolean(),
];

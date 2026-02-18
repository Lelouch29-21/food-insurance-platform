import { z } from 'zod';

export const calculatorSchema = z.object({
  principal: z.coerce.number().positive(),
  years: z.coerce.number().int().positive().max(50),
  rate: z.coerce.number().min(0).max(100),
});

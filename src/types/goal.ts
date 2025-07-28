import { z } from 'zod';

export const GoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalAmount: z.number(),
  currentAmount: z.number(),
  deadline: z.string(), // ISO date string
  userId: z.string(),
});

export type Goal = z.infer<typeof GoalSchema>;

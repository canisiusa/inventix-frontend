import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional().refine((val) => val !== '', {
    message: 'Name cannot be empty',
  }),

  terms: z.boolean().optional().refine((val) => val === true, {
    message: 'Terms must be true',
  }),

  analyticsTerms: z.boolean().optional(),

  marketingTerms: z.boolean().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

// app/lobbies/create/validations.ts
import { z } from 'zod';

export const createLobbySchema = z.object({
  title: z.string().min(3).max(60),
  game: z.enum(['CS2', 'COD Mobile', 'PUBG Mobile', 'Mobile Legends']),
  type: z.enum(['عمومی', 'خصوصی']),
  ageRange: z
    .enum(['12-18', '18-26', '26-35', '35+'])
    .optional()
    .default('18-26'),
  max: z.coerce.number().int().min(2).max(10),
  isPaid: z.string().optional(), // 'on' | undefined
  entryFee: z.coerce.number().min(0), // از رشته به عدد
  durationMins: z.coerce.number().min(5).max(360).default(60),
  description: z.string().max(300).optional().default(''),
  genderConstraint: z.enum(['any', 'male', 'female']).default('any'),
  allowedGender: z.enum(['any', 'male', 'female']).default('any'), // ✅
});
export type CreateLobbyInput = z.infer<typeof createLobbySchema>;

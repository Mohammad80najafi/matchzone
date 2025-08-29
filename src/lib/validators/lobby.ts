import { z } from 'zod';

export const zCreateLobby = z.object({
  title: z.string().min(3).max(60),
  game: z.enum(['CS2', 'COD Mobile', 'PUBG Mobile', 'Mobile Legends']),
  type: z.enum(['عمومی', 'خصوصی']),
  max: z.coerce.number().int().min(2).max(10),

  isPaid: z.coerce.boolean().default(false),
  entryFee: z.coerce.number().int().min(0).default(0),

  description: z.string().max(2000).optional(),
  ageRange: z.enum(['12-18', '18-26', '26-35', '35+']).default('18-26'),
  genderConstraint: z.enum(['any', 'male', 'female']).default('any'),

  durationMins: z.coerce.number().int().min(5).max(360).default(60),
});
export type CreateLobbyInput = z.infer<typeof zCreateLobby>;

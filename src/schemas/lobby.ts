import { z } from 'zod';

export const createLobbySchema = z.object({
  gameId: z.string().min(1),
  hostId: z.string().min(1),
  title: z.string().min(3).max(80),
  description: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  capacity: z.number().int().min(1).max(20).default(4),
  priceToman: z.number().int().min(0).default(0),
  tags: z.array(z.string().min(1)).max(10).default([]),
});

export type CreateLobbyInput = z.infer<typeof createLobbySchema>;

export const listLobbiesQuerySchema = z.object({
  gameId: z.string().optional(),
  q: z.string().optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  openOnly: z.coerce.boolean().default(true),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

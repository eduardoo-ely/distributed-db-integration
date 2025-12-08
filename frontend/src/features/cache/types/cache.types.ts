/**
 * Redis Cache Types
 */

import { z } from 'zod';

export interface CacheEntry {
  key: string;
  value: string;
  ttl?: number; // Time to live in seconds
  type?: string;
}

export interface CacheFilters {
  pattern?: string;
}

export const cacheEntrySchema = z.object({
  key: z.string().min(1, 'Key é obrigatória').max(255, 'Key muito longa'),
  value: z.string().min(1, 'Value é obrigatório'),
  ttl: z.number().int().min(-1).max(2592000).optional(), // Max 30 days or -1 for no expiry
});

export type CacheEntryFormData = z.infer<typeof cacheEntrySchema>;

export interface CacheEntriesResponse {
  entries: CacheEntry[];
  total: number;
}

export interface RedisStats {
  totalKeys: number;
  usedMemory: string;
  uptime: number;
  version: string;
}

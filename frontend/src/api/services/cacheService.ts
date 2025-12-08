/**
 * Redis Cache Service
 */

import apiClient from '../axios.config';
import { ENDPOINTS } from '../endpoints';
import type { CacheEntry, CacheEntryFormData, CacheEntriesResponse, RedisStats } from '@/features/cache/types/cache.types';

export const cacheService = {
  async getAll(pattern?: string): Promise<CacheEntriesResponse> {
    const response = await apiClient.get<CacheEntriesResponse>(ENDPOINTS.REDIS.KEYS.LIST, {
      params: { pattern },
    });
    return response.data;
  },

  async getByKey(key: string): Promise<CacheEntry> {
    const response = await apiClient.get<CacheEntry>(ENDPOINTS.REDIS.KEYS.BY_KEY(key));
    return response.data;
  },

  async create(data: CacheEntryFormData): Promise<CacheEntry> {
    const response = await apiClient.post<CacheEntry>(ENDPOINTS.REDIS.KEYS.CREATE, data);
    return response.data;
  },

  async update(key: string, data: CacheEntryFormData): Promise<CacheEntry> {
    const response = await apiClient.put<CacheEntry>(ENDPOINTS.REDIS.KEYS.UPDATE(key), data);
    return response.data;
  },

  async delete(key: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.REDIS.KEYS.DELETE(key));
  },

  async getStats(): Promise<RedisStats> {
    const response = await apiClient.get<RedisStats>(ENDPOINTS.REDIS.KEYS.STATS);
    return response.data;
  },

  async flushAll(): Promise<void> {
    await apiClient.post(ENDPOINTS.REDIS.KEYS.FLUSH);
  },
};

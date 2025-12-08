export interface RedisStats {
  used_memory_human: string;
  connected_clients: string;
  uptime_in_days: string;
  total_keys: string;
}

export interface RedisKey {
  key: string;
  value: string;
  ttl: number;
}

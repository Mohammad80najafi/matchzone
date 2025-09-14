import Redis from "ioredis";
import type { KVStore, TTLSeconds } from "./kv";

export class RedisKVStore implements KVStore {
  private readonly client: Redis;
  constructor(client: Redis) {
    this.client = client;
  }
  async set(key: string, value: string, ttlSeconds?: TTLSeconds): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, "EX", ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }
  async get(key: string): Promise<string | null> {
    const v = await this.client.get(key);
    return v ?? null;
  }
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

import type { KVStore, TTLSeconds } from "./kv";

type Entry = { value: string; expiresAt: number | null };

export class MemoryKVStore implements KVStore {
  private readonly map = new Map<string, Entry>();

  async set(key: string, value: string, ttlSeconds?: TTLSeconds): Promise<void> {
    const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.map.set(key, { value, expiresAt });
  }
  async get(key: string): Promise<string | null> {
    const e = this.map.get(key);
    if (!e) return null;
    if (e.expiresAt !== null && Date.now() > e.expiresAt) {
      this.map.delete(key);
      return null;
    }
    return e.value;
  }
  async del(key: string): Promise<void> {
    this.map.delete(key);
  }
}

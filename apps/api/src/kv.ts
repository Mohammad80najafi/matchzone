export type TTLSeconds = number;

export interface KVStore {
  set(key: string, value: string, ttlSeconds?: TTLSeconds): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
}

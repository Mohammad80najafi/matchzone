import Redis from "ioredis";
import { env } from "./env";

export function connectRedis(): Redis {
  return new Redis({ host: env.REDIS_HOST, port: env.REDIS_PORT });
}

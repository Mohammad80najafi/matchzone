import { buildApp } from "./app";
import { env } from "./env";
import { connectRedis } from "./redis";
import { RedisKVStore } from "./kv.redis";

const redis = connectRedis();
const kv = new RedisKVStore(redis);

const app = buildApp(kv, env.CORS_ORIGIN, {
  apiKey: env.SMSIR_API_KEY,
  templateId: env.SMSIR_TEMPLATE_ID,
  baseUrl: env.SMSIR_BASE_URL ?? undefined,
  testMode: env.SMS_TEST_MODE
});

app.listen({ host: env.API_HOST, port: env.API_PORT }).then((addr) => {
  app.log.info(`API listening on ${addr}`);
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

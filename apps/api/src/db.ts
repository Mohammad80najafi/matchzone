import { Client } from "pg";
import { env } from "./env";

export async function connectPg(): Promise<Client> {
  const client = new Client({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB
  });
  await client.connect();
  return client;
}

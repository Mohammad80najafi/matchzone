type Env = {
  API_PORT: number;
  API_HOST: string;
  CORS_ORIGIN: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  SMSIR_API_KEY: string | null;
  SMSIR_TEMPLATE_ID: number | null;
  SMSIR_BASE_URL: string | null;
  SMS_TEST_MODE: boolean;
};

function readEnv(): Env {
  const int = (v: string | undefined, d: number): number => Number(v ?? d);
  const str = (v: string | undefined, d: string): string => String(v ?? d);
  const bool = (v: string | undefined, d: boolean): boolean => {
    if (v === undefined) return d;
    return v === "1" || v.toLowerCase() === "true";
  };

  return {
    API_PORT: int(process.env.API_PORT, 4000),
    API_HOST: str(process.env.API_HOST, "0.0.0.0"),
    CORS_ORIGIN: str(process.env.CORS_ORIGIN, "http://localhost:3000"),
    POSTGRES_HOST: str(process.env.POSTGRES_HOST, "localhost"),
    POSTGRES_PORT: int(process.env.POSTGRES_PORT, 5432),
    POSTGRES_USER: str(process.env.POSTGRES_USER, "matchzone"),
    POSTGRES_PASSWORD: str(process.env.POSTGRES_PASSWORD, "matchzone"),
    POSTGRES_DB: str(process.env.POSTGRES_DB, "matchzone"),
    REDIS_HOST: str(process.env.REDIS_HOST, "localhost"),
    REDIS_PORT: int(process.env.REDIS_PORT, 6379),
    SMSIR_API_KEY: process.env.SMSIR_API_KEY ?? null,
    SMSIR_TEMPLATE_ID: process.env.SMSIR_TEMPLATE_ID ? Number(process.env.SMSIR_TEMPLATE_ID) : null,
    SMSIR_BASE_URL: process.env.SMSIR_BASE_URL ?? null,
    SMS_TEST_MODE: bool(process.env.SMS_TEST_MODE, true)
  };
}

export const env = readEnv();

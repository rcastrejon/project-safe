import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
  LOG_OUTPUT_PATH: z.string(),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

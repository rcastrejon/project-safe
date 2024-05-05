import { type Config } from "drizzle-kit";

import { env } from "./src/env";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: env.NODE_ENV !== "production",
} satisfies Config;

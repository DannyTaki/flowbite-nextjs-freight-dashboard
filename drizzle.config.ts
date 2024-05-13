import type { Config } from "drizzle-kit";

export default {
  schema: "./app/db/schema.ts",
  out: "./app/db/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgresql://neondb_owner:4QJXa9fwlHsD@ep-flat-queen-a56n27qv.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
} satisfies Config;

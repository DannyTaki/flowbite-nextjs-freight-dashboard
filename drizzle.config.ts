import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config();

export default {
  schema: "./app/db/drizzle/schema.ts",
  out: "./app/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:4QJXa9fwlHsD@ep-flat-queen-a56n27qv.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
} satisfies Config;

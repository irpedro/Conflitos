import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_PUBLIC_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_PUBLIC_URL is not defined");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

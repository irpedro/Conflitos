import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from "@shared/schema";

const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

if (!databaseUrl) {
  throw new Error("Database URL not found");
}

// Usar Pool do pg como no guia do Neon
const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool, { schema });

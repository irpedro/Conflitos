import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

// Tente DATABASE_URL primeiro (URL interna), depois PUBLIC_URL
const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_PUBLIC_URL is not defined");
}

// Log para debug (remova depois)
console.log('Using database URL:', databaseUrl.replace(/:[^:]*@/, ':***@'));

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

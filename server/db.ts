import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

// Construir a URL manualmente para evitar problemas
const DB_HOST = 'hopper.proxy.rlwy.net';
const DB_PORT = '25260';
const DB_USER = 'postgres';
const DB_PASS = 'hcFCYDBhsYoQxRSFVkkPiwOCIqjnyeLR';
const DB_NAME = 'railway';

const databaseUrl = `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require`;

console.log('Manual URL hostname:', DB_HOST);

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

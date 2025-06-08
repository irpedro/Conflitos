import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

// Durante o build, pode não ter DATABASE_URL, então usamos uma URL dummy
const databaseUrl = process.env.DATABASE_URL || 
                   process.env.POSTGRES_URL || 
                   'postgresql://dummy:dummy@dummy:5432/dummy';

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
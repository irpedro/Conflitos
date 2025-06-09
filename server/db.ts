import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

// Usar DATABASE_PUBLIC_URL que você tem configurada
const databaseUrl = process.env.DATABASE_PUBLIC_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_PUBLIC_URL is not defined. Please set it in your Railway environment variables.");
}

// Adicionar SSL se não estiver presente na URL
const urlWithSSL = databaseUrl.includes('sslmode=') 
  ? databaseUrl 
  : databaseUrl.includes('?') 
    ? `${databaseUrl}&sslmode=require` 
    : `${databaseUrl}?sslmode=require`;

// Debug logs (remova em produção se desejar)
console.log('🔗 Database connection status:', {
  hasUrl: !!databaseUrl,
  environment: process.env.NODE_ENV,
  urlPreview: databaseUrl?.substring(0, 30) + '...',
});

const sql = neon(urlWithSSL);
export const db = drizzle(sql, { schema });

// Teste de conexão opcional (útil para debug)
export const testConnection = async () => {
  try {
    const result = await sql`SELECT 1 as test, NOW() as timestamp`;
    console.log('✅ Database connection successful:', result[0]);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, error: error.message };
  }
};

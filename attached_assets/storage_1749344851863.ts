import { savedQueries, queryHistory, type SavedQuery, type QueryHistory, type InsertSavedQuery, type InsertQueryHistory } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

interface IStorage {
  executeQuery(query: string): Promise<{ rows: any[], fields: any[] }>;
  getDatabaseSchema(): Promise<any>;
  saveQuery(query: InsertSavedQuery & { createdAt: string }): Promise<SavedQuery>;
  getSavedQueries(): Promise<SavedQuery[]>;
  deleteSavedQuery(id: number): Promise<void>;
  addQueryHistory(history: InsertQueryHistory & { executedAt: string }): Promise<QueryHistory>;
  getQueryHistory(limit?: number): Promise<QueryHistory[]>;
}

export class DatabaseStorage implements IStorage {
  async executeQuery(query: string): Promise<{ rows: any[], fields: any[] }> {
    const result = await db.execute(query);
    return {
      rows: result.rows as any[],
      fields: result.fields || []
    };
  }

  async getDatabaseSchema(): Promise<any> {
    const tablesQuery = `
      SELECT 
        t.table_name,
        COUNT(c.column_name) as column_count,
        COALESCE(s.n_tup_ins, 0) as row_count
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
      LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
      WHERE t.table_schema = 'public' 
        AND t.table_type = 'BASE TABLE'
        AND t.table_name NOT LIKE 'pg_%'
        AND t.table_name NOT LIKE 'sql_%'
      GROUP BY t.table_name, s.n_tup_ins
      ORDER BY t.table_name;
    `;

    const columnsQuery = `
      SELECT 
        c.table_name,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default
      FROM information_schema.columns c
      WHERE c.table_schema = 'public'
        AND c.table_name IN (
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name NOT LIKE 'pg_%'
            AND table_name NOT LIKE 'sql_%'
        )
      ORDER BY c.table_name, c.ordinal_position;
    `;

    const [tablesResult, columnsResult] = await Promise.all([
      db.execute(tablesQuery),
      db.execute(columnsQuery)
    ]);

    const tables = (tablesResult.rows as any[]).map(table => ({
      name: table.table_name,
      rowCount: parseInt(table.row_count) || 0,
      columns: (columnsResult.rows as any[])
        .filter(col => col.table_name === table.table_name)
        .map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          default: col.column_default
        }))
    }));

    return { tables };
  }

  async saveQuery(query: InsertSavedQuery & { createdAt: string }): Promise<SavedQuery> {
    const [savedQuery] = await db
      .insert(savedQueries)
      .values(query)
      .returning();
    return savedQuery;
  }

  async getSavedQueries(): Promise<SavedQuery[]> {
    return await db
      .select()
      .from(savedQueries)
      .orderBy(desc(savedQueries.createdAt));
  }

  async deleteSavedQuery(id: number): Promise<void> {
    await db
      .delete(savedQueries)
      .where(eq(savedQueries.id, id));
  }

  async addQueryHistory(history: InsertQueryHistory & { executedAt: string }): Promise<QueryHistory> {
    const [historyRecord] = await db
      .insert(queryHistory)
      .values(history)
      .returning();
    return historyRecord;
  }

  async getQueryHistory(limit: number = 50): Promise<QueryHistory[]> {
    return await db
      .select()
      .from(queryHistory)
      .orderBy(desc(queryHistory.executedAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
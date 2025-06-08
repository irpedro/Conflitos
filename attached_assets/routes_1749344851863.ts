import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedQuerySchema, insertQueryHistorySchema } from "@shared/schema";
import { z } from "zod";

const executeQuerySchema = z.object({
  query: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Execute SQL query
  app.post("/api/query/execute", async (req, res) => {
    try {
      const { query } = executeQuerySchema.parse(req.body);
      const startTime = Date.now();
      
      try {
        const result = await storage.executeQuery(query);
        const executionTime = Date.now() - startTime;
        
        // Save to history
        await storage.addQueryHistory({
          query,
          executionTime,
          rowsReturned: result.rows.length,
          success: 1,
          errorMessage: null,
          executedAt: new Date().toISOString(),
        });
        
        res.json({
          success: true,
          data: result.rows,
          fields: result.fields,
          rowCount: result.rows.length,
          executionTime,
        });
      } catch (error) {
        const executionTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        // Save error to history
        await storage.addQueryHistory({
          query,
          executionTime,
          rowsReturned: 0,
          success: 0,
          errorMessage,
          executedAt: new Date().toISOString(),
        });
        
        res.status(400).json({
          success: false,
          error: errorMessage,
          executionTime,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  // Get database schema information
  app.get("/api/schema", async (req, res) => {
    try {
      const schema = await storage.getDatabaseSchema();
      res.json(schema);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to fetch schema",
      });
    }
  });

  // Save query
  app.post("/api/queries", async (req, res) => {
    try {
      const queryData = insertSavedQuerySchema.parse(req.body);
      const savedQuery = await storage.saveQuery({
        ...queryData,
        createdAt: new Date().toISOString(),
      });
      res.json(savedQuery);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid query data",
      });
    }
  });

  // Get saved queries
  app.get("/api/queries", async (req, res) => {
    try {
      const queries = await storage.getSavedQueries();
      res.json(queries);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to fetch queries",
      });
    }
  });

  // Delete saved query
  app.delete("/api/queries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSavedQuery(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to delete query",
      });
    }
  });

  // Get query history
  app.get("/api/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await storage.getQueryHistory(limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to fetch history",
      });
    }
  });

  // Get quick query templates
  app.get("/api/templates", async (req, res) => {
    const templates = [
      {
        name: "View All Conflicts",
        description: "Get all conflicts with basic information",
        query: "SELECT id, nome, lugar, total_mortos, total_feridos, causa FROM conflito ORDER BY total_mortos DESC LIMIT 10;",
      },
      {
        name: "Group Strength Analysis",
        description: "Analyze armed groups by division count and personnel",
        query: `SELECT 
    ga.nome AS grupo_nome,
    COUNT(d.numero_divisao) AS total_divisoes,
    SUM(d.numero_homens) AS total_homens,
    SUM(d.numero_baixas) AS total_baixas,
    ROUND((SUM(d.numero_baixas)::decimal / NULLIF(SUM(d.numero_homens), 0) * 100), 2) AS taxa_baixas_percent
FROM grupo_armado ga
LEFT JOIN divisao d ON ga.id = d.id_grupo_armado
GROUP BY ga.id, ga.nome
ORDER BY total_baixas DESC;`,
      },
      {
        name: "Major Conflicts Analysis",
        description: "Conflicts with high casualties and their details",
        query: `SELECT 
    c.nome AS conflict_name,
    c.lugar AS location,
    c.total_mortos AS deaths,
    c.total_feridos AS injured,
    c.causa AS cause
FROM conflito c
WHERE c.total_mortos > 50000
ORDER BY c.total_mortos DESC;`,
      },
      {
        name: "Weapon Distribution",
        description: "Most destructive weapons and their usage",
        query: `SELECT 
    a.nome AS weapon_name,
    a.capacidade_destrutiva AS destructive_capacity,
    COUNT(f.nome_arma) AS groups_using
FROM armas a
LEFT JOIN fornecimento f ON a.nome = f.nome_arma
GROUP BY a.nome, a.capacidade_destrutiva
ORDER BY a.capacidade_destrutiva DESC;`,
      },
      {
        name: "Leadership Hierarchy",
        description: "Military command structure by group",
        query: `SELECT 
    lp.nome AS political_leader,
    ga.nome AS armed_group,
    cm.faixa_hierarquica AS military_rank,
    cm.numero_divisao AS division
FROM lider_politico lp
JOIN grupo_armado ga ON lp.id_grupo_armado = ga.id
JOIN chefe_militar cm ON lp.nome = cm.nome_lider_politico
ORDER BY ga.nome, cm.faixa_hierarquica;`,
      },
    ];
    
    res.json(templates);
  });

  const httpServer = createServer(app);
  return httpServer;
}

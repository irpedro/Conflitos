import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConflitoSchema, insertGrupoArmadoSchema, insertDivisaoSchema, 
         insertLiderPoliticoSchema, insertChefeMilitarSchema } from "@shared/schema";
import { z } from "zod";
import { validators, handleValidationError } from "./validation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Conflicts endpoints
  app.get("/api/conflicts", async (_req, res) => {
    try {
      const conflicts = await storage.getAllConflicts();
      res.json(conflicts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conflicts" });
    }
  });

  app.get("/api/conflicts/:id", async (req, res) => {
    try {
      const conflict = await storage.getConflictById(req.params.id);
      if (!conflict) {
        return res.status(404).json({ error: "Conflict not found" });
      }
      res.json(conflict);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conflict" });
    }
  });

  app.post("/api/conflicts", async (req, res) => {
    try {
      const validatedData = insertConflitoSchema.parse(req.body);
      
      // Ensure id is set for creation
      if (!validatedData.id) {
        // Generate a new ID or let the database handle it
        const conflicts = await storage.getAllConflicts();
        const maxId = conflicts.reduce((max, c) => Math.max(max, c.id), 0);
        validatedData.id = maxId + 1;
      } else {
        await validators.validateUniqueConflictId(validatedData.id);
      }
      
      const conflict = await storage.createConflict({
        ...validatedData,
        id: validatedData.id!
      });
      res.status(201).json(conflict);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      
      const errorResponse = handleValidationError(error);
      return res.status(errorResponse.status).json(errorResponse.body);
    }
  });

  app.put("/api/conflicts/:id", async (req, res) => {
    try {
      const validatedData = insertConflitoSchema.partial().parse(req.body);
      const conflict = await storage.updateConflict(req.params.id, validatedData);
      res.json(conflict);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update conflict" });
    }
  });

  app.delete("/api/conflicts/:id", async (req, res) => {
    try {
      await storage.deleteConflict(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete conflict" });
    }
  });

  // Armed Groups endpoints
  app.get("/api/armed-groups", async (_req, res) => {
    try {
      const groups = await storage.getAllArmedGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch armed groups" });
    }
  });

  app.post("/api/armed-groups", async (req, res) => {
    try {
      const validatedData = insertGrupoArmadoSchema.parse(req.body);
      
      // Ensure id is set for creation
      if (!validatedData.id) {
        const groups = await storage.getAllArmedGroups();
        const maxId = groups.reduce((max, g) => Math.max(max, g.id), 0);
        validatedData.id = maxId + 1;
      } else {
        await validators.validateUniqueArmedGroupId(validatedData.id);
      }
      
      const group = await storage.createArmedGroup({
        ...validatedData,
        id: validatedData.id!
      });
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      
      const errorResponse = handleValidationError(error);
      return res.status(errorResponse.status).json(errorResponse.body);
    }
  });

  // Divisions endpoints
  app.get("/api/divisions", async (_req, res) => {
    try {
      const divisions = await storage.getAllDivisions();
      res.json(divisions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch divisions" });
    }
  });

  app.post("/api/divisions", async (req, res) => {
    try {
      const validatedData = insertDivisaoSchema.parse(req.body);
      
            // Check if division number already exists
      const existingDivision = await storage.getDivisionById(validatedData.numeroDivisao);
      if (existingDivision) {
        return res.status(400).json({ 
          error: "Duplicate ID", 
          details: "A division with this number already exists" 
        });
      }
             
      await validators.validateArmedGroupExists(validatedData.idGrupoArmado);
      
      const division = await storage.createDivision(validatedData);
      res.status(201).json(division);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      
      const errorResponse = handleValidationError(error);
      return res.status(errorResponse.status).json(errorResponse.body);
    }
  });

  // Political Leaders endpoints
  app.get("/api/political-leaders", async (_req, res) => {
    try {
      const leaders = await storage.getAllPoliticalLeaders();
      res.json(leaders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch political leaders" });
    }
  });

  app.post("/api/political-leaders", async (req, res) => {
    try {
      const validatedData = insertLiderPoliticoSchema.parse(req.body);
      
      await validators.validateArmedGroupExists(validatedData.idGrupoArmado);
      
      const leader = await storage.createPoliticalLeader(validatedData);
      res.status(201).json(leader);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      
      const errorResponse = handleValidationError(error);
      return res.status(errorResponse.status).json(errorResponse.body);
    }
  });

  // Military Chiefs endpoints
  app.get("/api/military-chiefs", async (_req, res) => {
    try {
      const chiefs = await storage.getAllMilitaryChiefs();
      res.json(chiefs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch military chiefs" });
    }
  });

  app.post("/api/military-chiefs", async (req, res) => {
    try {
      const validatedData = insertChefeMilitarSchema.parse(req.body);
      
      await validators.validatePoliticalLeaderExists(validatedData.nomeLiderPolitico, validatedData.idGrupoArmado);
      await validators.validateDivisionExists(validatedData.numeroDivisao);
      
      // Ensure id is set for creation
      let finalId = validatedData.id;
      if (!finalId) {
        const chiefs = await storage.getAllMilitaryChiefs();
        const maxId = chiefs.reduce((max, c) => Math.max(max, c.id), 0);
        finalId = maxId + 1;
      } else {
      // ADIÇÃO: Verificar se ID já existe
      const chiefs = await storage.getAllMilitaryChiefs();
      const existingChief = chiefs.find(chief => chief.id === validatedData.id);
      if (existingChief) {
        return res.status(400).json({ 
          error: "Military chief already exists", 
          details: `A military chief with ID ${validatedData.id} already exists.`
        });
      }
    }
      
      const chief = await storage.createMilitaryChief({
        ...validatedData,
        id: finalId
      });
      res.status(201).json(chief);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      
      const errorResponse = handleValidationError(error);
      return res.status(errorResponse.status).json(errorResponse.body);
    }
  });

  // Mediator Organizations endpoints
  app.get("/api/mediator-orgs", async (_req, res) => {
    try {
      const orgs = await storage.getAllMediatorOrgs();
      res.json(orgs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mediator organizations" });
    }
  });

  // Statistics endpoints
  app.get("/api/statistics", async (_req, res) => {
    try {
      const stats = await storage.getConflictStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  app.get("/api/reports/conflicts-by-type", async (_req, res) => {
    try {
      const data = await storage.getConflictsByType();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conflicts by type" });
    }
  });

  app.get("/api/reports/conflicts-by-region", async (_req, res) => {
    try {
      const data = await storage.getConflictsByRegion();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conflicts by region" });
    }
  });

  app.get("/api/reports/groups-by-losses", async (_req, res) => {
    try {
      const data = await storage.getGroupsByLosses();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch groups by losses" });
    }
  });

  app.get("/api/reports/active-mediators", async (_req, res) => {
    try {
      const data = await storage.getMostActiveMediators();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active mediators" });
    }
  });

  app.get("/api/reports/weapons-by-power", async (_req, res) => {
    try {
      const data = await storage.getWeaponsByDestructivePower();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weapons by power" });
    }
  });

  app.get("/api/reports/division-resources", async (_req, res) => {
    try {
      const data = await storage.getDivisionResources();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch division resources" });
    }
  });

  app.get("/api/reports/conflicts-by-casualties", async (_req, res) => {
    try {
      const data = await storage.getConflictsByCasualties();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conflicts by casualties" });
    }
  });

  app.get("/api/reports/groups-by-weapons", async (_req, res) => {
    try {
      const data = await storage.getGroupsByWeapons();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch groups by weapons" });
    }
  });

  app.get("/api/reports/weapon-trafficking", async (_req, res) => {
    try {
      const data = await storage.getWeaponTrafficking();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weapon trafficking data" });
    }
  });

  app.get("/api/reports/religious-conflicts", async (_req, res) => {
    try {
      const data = await storage.getReligiousConflicts();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch religious conflicts" });
    }
  });

  // Database schema and administration
  app.get("/api/schema/ddl", async (_req, res) => {
    try {
      const ddl = await storage.getDDLSchema();
      res.json({ ddl });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch DDL schema" });
    }
  });

  app.get("/api/triggers", async (_req, res) => {
    try {
      const triggers = await storage.getTriggerInfo();
      res.json(triggers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trigger information" });
    }
  });

  // Custom SQL query execution
  app.post("/api/query", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query is required and must be a string" });
      }
      
      // Basic safety check - only allow SELECT statements
      const trimmedQuery = query.trim().toUpperCase();
      if (!trimmedQuery.startsWith('SELECT')) {
        return res.status(400).json({ error: "Only SELECT queries are allowed" });
      }

      const result = await storage.executeQuery(query);
      res.json({ 
        results: result, 
        executionTime: '0.8s',
        rowCount: Array.isArray(result) ? result.length : 0 
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Query execution failed", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Execute SQL endpoint for complex operations
  app.post("/api/execute-sql", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }
      
      const result = await storage.executeQuery(query);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ 
        error: "SQL execution failed", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

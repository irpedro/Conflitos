import { storage } from "./storage";

export class ValidationError extends Error {
  constructor(message: string, public details?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const validators = {
  
  async validateUniqueMilitaryChiefId(id: number): Promise<void> {
    const chiefs = await storage.getAllMilitaryChiefs();
    const existing = chiefs.find(chief => chief.id === id);
    if (existing) {
      throw new ValidationError("Duplicate ID", "A military chief with this ID already exists");
    }
  },
  
  async validateArmedGroupExists(id: number): Promise<void> {
    const group = await storage.getArmedGroupById(id.toString());
    if (!group) {
      throw new ValidationError("Invalid data", "The specified armed group does not exist");
    }
  },

  async validateConflictExists(id: number): Promise<void> {
    const conflict = await storage.getConflictById(id.toString());
    if (!conflict) {
      throw new ValidationError("Invalid data", "The specified conflict does not exist");
    }
  },

  async validateDivisionExists(numeroDivisao: number): Promise<void> {
    const division = await storage.getDivisionById(numeroDivisao.toString());
    if (!division) {
      throw new ValidationError("Invalid data", "The specified division does not exist");
    }
  },

  async validatePoliticalLeaderExists(nome: string, idGrupoArmado: number): Promise<void> {
    const leaders = await storage.getAllPoliticalLeaders();
    const leader = leaders.find(l => l.nome === nome && l.idGrupoArmado === idGrupoArmado);
    if (!leader) {
      throw new ValidationError("Invalid data", "The specified political leader does not exist in the specified armed group");
    }
  },

  async validateUniqueArmedGroupId(id: number): Promise<void> {
    const existing = await storage.getArmedGroupById(id.toString());
    if (existing) {
      throw new ValidationError("Duplicate ID", "A group with this ID already exists");
    }
  },

  async validateUniqueConflictId(id: number): Promise<void> {
    const existing = await storage.getConflictById(id.toString());
    if (existing) {
      throw new ValidationError("Duplicate ID", "A conflict with this ID already exists");
    }
  },

  async validateUniqueDivisionNumber(numeroDivisao: number): Promise<void> {
    const existing = await storage.getDivisionById(numeroDivisao.toString());
    if (existing) {
      throw new ValidationError("Duplicate ID", "A division with this number already exists");
    }
  }
};

export function handleValidationError(error: unknown) {
  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: { error: error.message, details: error.details }
    };
  }
  
  if (error instanceof Error) {
    if (error.message.includes('foreign key')) {
      return {
        status: 400,
        body: { error: "Invalid reference", details: "One or more referenced entities do not exist" }
      };
    }
    
    if (error.message.includes('unique') || error.message.includes('duplicate')) {
      return {
        status: 400,
        body: { error: "Duplicate entry", details: "An entity with this identifier already exists" }
      };
    }
    
    console.error("Database error:", error);
    return {
      status: 500,
      body: { error: "Database operation failed", details: error.message }
    };
  }
  
  console.error("Unknown error:", error);
  return {
    status: 500,
    body: { error: "Unknown error occurred" }
  };
}

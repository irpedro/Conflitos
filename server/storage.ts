import { 
  conflito, grupoArmado, divisao, liderPolitico, chefeMilitar, orgMediadora,
  religiao, territorio, economia, raca, paisesEmConflito, participacaoGrupoArmado,
  participacaoOrgMediadora, armas, traficantes, fornecimento, contrabandeia,
  type Conflito, type InsertConflito, type GrupoArmado, type InsertGrupoArmado,
  type Divisao, type InsertDivisao, type LiderPolitico, type InsertLiderPolitico,
  type ChefeMilitar, type InsertChefeMilitar, type OrgMediadora, type InsertOrgMediadora,
  users, type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, asc, count, sum, and } from "drizzle-orm";

export interface IStorage {
  // User methods (keeping for compatibility)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conflict methods
  getAllConflicts(): Promise<Conflito[]>;
  getConflictById(id: string): Promise<Conflito | undefined>;
  createConflict(conflict: InsertConflito): Promise<Conflito>;
  updateConflict(id: string, conflict: Partial<InsertConflito>): Promise<Conflito>;
  deleteConflict(id: string): Promise<void>;

  // Armed Group methods
  getAllArmedGroups(): Promise<GrupoArmado[]>;
  getArmedGroupById(id: string): Promise<GrupoArmado | undefined>;
  createArmedGroup(group: InsertGrupoArmado): Promise<GrupoArmado>;
  updateArmedGroup(id: string, group: Partial<InsertGrupoArmado>): Promise<GrupoArmado>;
  deleteArmedGroup(id: string): Promise<void>;

  // Division methods
  getAllDivisions(): Promise<Divisao[]>;
  getDivisionById(id: string): Promise<Divisao | undefined>;
  createDivision(division: InsertDivisao): Promise<Divisao>;
  updateDivision(id: string, division: Partial<InsertDivisao>): Promise<Divisao>;
  deleteDivision(id: string): Promise<void>;

  // Political Leader methods
  getAllPoliticalLeaders(): Promise<LiderPolitico[]>;
  createPoliticalLeader(leader: InsertLiderPolitico): Promise<LiderPolitico>;
  updatePoliticalLeader(nome: string, idGrupo: string, leader: Partial<InsertLiderPolitico>): Promise<LiderPolitico>;
  deletePoliticalLeader(nome: string, idGrupo: string): Promise<void>;

  // Military Chief methods
  getAllMilitaryChiefs(): Promise<ChefeMilitar[]>;
  getMilitaryChiefById(id: string): Promise<ChefeMilitar | undefined>;
  createMilitaryChief(chief: InsertChefeMilitar): Promise<ChefeMilitar>;
  updateMilitaryChief(id: string, chief: Partial<InsertChefeMilitar>): Promise<ChefeMilitar>;
  deleteMilitaryChief(id: string): Promise<void>;

  // Mediator Organization methods
  getAllMediatorOrgs(): Promise<OrgMediadora[]>;
  getMediatorOrgById(id: string): Promise<OrgMediadora | undefined>;
  createMediatorOrg(org: InsertOrgMediadora): Promise<OrgMediadora>;

  // Statistics and Reports
  getConflictStatistics(): Promise<{
    totalConflicts: number;
    totalArmedGroups: number;
    totalDeaths: number;
    totalMediatorOrgs: number;
  }>;
  getConflictsByType(): Promise<{ causa: string; count: number }[]>;
  getConflictsByRegion(): Promise<{ lugar: string; count: number }[]>;
  getGroupsByLosses(): Promise<{ nome: string; numeroBaixas: number }[]>;
  getMostActiveMediators(): Promise<{ nome: string; participacoes: number }[]>;
  getWeaponsByDestructivePower(): Promise<{ nome: string; capacidadeDestrutiva: number }[]>;
  getDivisionResources(): Promise<{ 
    totalTanques: number; 
    totalAvioes: number; 
    totalBarcos: number; 
    totalHomens: number;
  }>;

  // New reports
  getConflictsByCasualties(): Promise<{ nome: string; totalBaixas: number }[]>;
  getGroupsByWeapons(): Promise<{ nome: string; totalArmas: number }[]>;
  getWeaponTrafficking(): Promise<{ traficante: string; grupo: string }[]>;
  getReligiousConflicts(): Promise<{ pais: string; conflitos: number }[]>;

  // Custom queries
  executeQuery(query: string): Promise<any[]>;
  getDDLSchema(): Promise<string>;
  getTriggerInfo(): Promise<{ name: string; definition: string; active: boolean }[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Conflict methods
  async getAllConflicts(): Promise<Conflito[]> {
    try {
      return await db.select().from(conflito).orderBy(asc(conflito.id));
    } catch (error) {
      console.error('Error getting all conflicts:', error);
      throw error;
    }
  }

  async getConflictById(id: string): Promise<Conflito | undefined> {
    try {
      const [conflict] = await db.select().from(conflito).where(eq(conflito.id, id));
      return conflict || undefined;
    } catch (error) {
      console.error('Error getting conflict by id:', error);
      throw error;
    }
  }

  async createConflict(conflict: InsertConflito): Promise<Conflito> {
    try {
      const [created] = await db.insert(conflito).values(conflict).returning();
      return created;
    } catch (error) {
      console.error('Error creating conflict:', error);
      throw error;
    }
  }

  async updateConflict(id: string, conflict: Partial<InsertConflito>): Promise<Conflito> {
    try {
      const [updated] = await db
        .update(conflito)
        .set(conflict)
        .where(eq(conflito.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating conflict:', error);
      throw error;
    }
  }

  async deleteConflict(id: string): Promise<void> {
    try {
      await db.delete(conflito).where(eq(conflito.id, id));
    } catch (error) {
      console.error('Error deleting conflict:', error);
      throw error;
    }
  }

  // Armed Group methods
  async getAllArmedGroups(): Promise<GrupoArmado[]> {
    try {
      return await db.select().from(grupoArmado).orderBy(asc(grupoArmado.id));
    } catch (error) {
      console.error('Error getting all armed groups:', error);
      throw error;
    }
  }

  async getArmedGroupById(id: string): Promise<GrupoArmado | undefined> {
    try {
      const [group] = await db.select().from(grupoArmado).where(eq(grupoArmado.id, id));
      return group || undefined;
    } catch (error) {
      console.error('Error getting armed group by id:', error);
      throw error;
    }
  }

  async createArmedGroup(group: InsertGrupoArmado): Promise<GrupoArmado> {
    try {
      const [created] = await db.insert(grupoArmado).values(group).returning();
      return created;
    } catch (error) {
      console.error('Error creating armed group:', error);
      throw error;
    }
  }

  async updateArmedGroup(id: string, group: Partial<InsertGrupoArmado>): Promise<GrupoArmado> {
    try {
      const [updated] = await db
        .update(grupoArmado)
        .set(group)
        .where(eq(grupoArmado.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating armed group:', error);
      throw error;
    }
  }

  async deleteArmedGroup(id: string): Promise<void> {
    try {
      await db.delete(grupoArmado).where(eq(grupoArmado.id, id));
    } catch (error) {
      console.error('Error deleting armed group:', error);
      throw error;
    }
  }

  // Division methods
  async getAllDivisions(): Promise<Divisao[]> {
    try {
      return await db.select().from(divisao).orderBy(asc(divisao.numeroDivisao));
    } catch (error) {
      console.error('Error getting all divisions:', error);
      throw error;
    }
  }

  async getDivisionById(id: string): Promise<Divisao | undefined> {
    try {
      const [division] = await db.select().from(divisao).where(eq(divisao.numeroDivisao, id));
      return division || undefined;
    } catch (error) {
      console.error('Error getting division by id:', error);
      throw error;
    }
  }

  async createDivision(division: InsertDivisao): Promise<Divisao> {
    try {
      const [created] = await db.insert(divisao).values(division).returning();
      return created;
    } catch (error) {
      console.error('Error creating division:', error);
      throw error;
    }
  }

  async updateDivision(id: string, division: Partial<InsertDivisao>): Promise<Divisao> {
    try {
      const [updated] = await db
        .update(divisao)
        .set(division)
        .where(eq(divisao.numeroDivisao, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating division:', error);
      throw error;
    }
  }

  async deleteDivision(id: string): Promise<void> {
    try {
      await db.delete(divisao).where(eq(divisao.numeroDivisao, id));
    } catch (error) {
      console.error('Error deleting division:', error);
      throw error;
    }
  }

  // Political Leader methods
  async getAllPoliticalLeaders(): Promise<LiderPolitico[]> {
    try {
      return await db.select().from(liderPolitico).orderBy(asc(liderPolitico.nome));
    } catch (error) {
      console.error('Error getting all political leaders:', error);
      throw error;
    }
  }

  async createPoliticalLeader(leader: InsertLiderPolitico): Promise<LiderPolitico> {
    try {
      const [created] = await db.insert(liderPolitico).values(leader).returning();
      return created;
    } catch (error) {
      console.error('Error creating political leader:', error);
      throw error;
    }
  }

  async updatePoliticalLeader(nome: string, idGrupo: string, leader: Partial<InsertLiderPolitico>): Promise<LiderPolitico> {
    try {
      const [updated] = await db
        .update(liderPolitico)
        .set(leader)
        .where(and(eq(liderPolitico.nome, nome), eq(liderPolitico.idGrupoArmado, idGrupo)))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating political leader:', error);
      throw error;
    }
  }

  async deletePoliticalLeader(nome: string, idGrupo: string): Promise<void> {
    try {
      await db.delete(liderPolitico)
        .where(and(eq(liderPolitico.nome, nome), eq(liderPolitico.idGrupoArmado, idGrupo)));
    } catch (error) {
      console.error('Error deleting political leader:', error);
      throw error;
    }
  }

  // Military Chief methods
  async getAllMilitaryChiefs(): Promise<ChefeMilitar[]> {
    try {
      return await db.select().from(chefeMilitar).orderBy(asc(chefeMilitar.id));
    } catch (error) {
      console.error('Error getting all military chiefs:', error);
      throw error;
    }
  }

  async getMilitaryChiefById(id: string): Promise<ChefeMilitar | undefined> {
    try {
      const [chief] = await db.select().from(chefeMilitar).where(eq(chefeMilitar.id, id));
      return chief || undefined;
    } catch (error) {
      console.error('Error getting military chief by id:', error);
      throw error;
    }
  }

  async createMilitaryChief(chief: InsertChefeMilitar): Promise<ChefeMilitar> {
    try {
      const [created] = await db.insert(chefeMilitar).values(chief).returning();
      return created;
    } catch (error) {
      console.error('Error creating military chief:', error);
      throw error;
    }
  }

  async updateMilitaryChief(id: string, chief: Partial<InsertChefeMilitar>): Promise<ChefeMilitar> {
    try {
      const [updated] = await db
        .update(chefeMilitar)
        .set(chief)
        .where(eq(chefeMilitar.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating military chief:', error);
      throw error;
    }
  }

  async deleteMilitaryChief(id: string): Promise<void> {
    try {
      await db.delete(chefeMilitar).where(eq(chefeMilitar.id, id));
    } catch (error) {
      console.error('Error deleting military chief:', error);
      throw error;
    }
  }

  // Mediator Organization methods
  async getAllMediatorOrgs(): Promise<OrgMediadora[]> {
    try {
      return await db.select().from(orgMediadora).orderBy(asc(orgMediadora.id));
    } catch (error) {
      console.error('Error getting all mediator orgs:', error);
      throw error;
    }
  }

  async getMediatorOrgById(id: string): Promise<OrgMediadora | undefined> {
    try {
      const [org] = await db.select().from(orgMediadora).where(eq(orgMediadora.id, id));
      return org || undefined;
    } catch (error) {
      console.error('Error getting mediator org by id:', error);
      throw error;
    }
  }

  async createMediatorOrg(org: InsertOrgMediadora): Promise<OrgMediadora> {
    try {
      const [created] = await db.insert(orgMediadora).values(org).returning();
      return created;
    } catch (error) {
      console.error('Error creating mediator org:', error);
      throw error;
    }
  }

  // Statistics and Reports
  async getConflictStatistics(): Promise<{
    totalConflicts: number;
    totalArmedGroups: number;
    totalDeaths: number;
    totalMediatorOrgs: number;
  }> {
    try {
      const [conflictCount] = await db.select({ count: count() }).from(conflito);
      const [groupCount] = await db.select({ count: count() }).from(grupoArmado);
      const [deathSum] = await db.select({ sum: sum(conflito.totalMortos) }).from(conflito);
      const [orgCount] = await db.select({ count: count() }).from(orgMediadora);

      return {
        totalConflicts: Number(conflictCount.count),
        totalArmedGroups: Number(groupCount.count),
        totalDeaths: Number(deathSum.sum) || 0,
        totalMediatorOrgs: Number(orgCount.count),
      };
    } catch (error) {
      console.error('Error getting conflict statistics:', error);
      throw error;
    }
  }

  async getConflictsByType(): Promise<{ causa: string; count: number }[]> {
    try {
      return await db
        .select({
          causa: conflito.causa,
          count: count()
        })
        .from(conflito)
        .groupBy(conflito.causa)
        .orderBy(desc(count()));
    } catch (error) {
      console.error('Error getting conflicts by type:', error);
      throw error;
    }
  }

  async getConflictsByRegion(): Promise<{ lugar: string; count: number }[]> {
    try {
      return await db
        .select({
          lugar: conflito.lugar,
          count: count()
        })
        .from(conflito)
        .groupBy(conflito.lugar)
        .orderBy(desc(count()));
    } catch (error) {
      console.error('Error getting conflicts by region:', error);
      throw error;
    }
  }

  async getGroupsByLosses(): Promise<{ nome: string; numeroBaixas: number }[]> {
    try {
      return await db
        .select({
          nome: grupoArmado.nome,
          numeroBaixas: grupoArmado.numeroBaixas
        })
        .from(grupoArmado)
        .orderBy(desc(grupoArmado.numeroBaixas))
        .limit(10);
    } catch (error) {
      console.error('Error getting groups by losses:', error);
      throw error;
    }
  }

  async getMostActiveMediators(): Promise<{ nome: string; participacoes: number }[]> {
    try {
      return await db
        .select({
          nome: orgMediadora.nome,
          participacoes: count(participacaoOrgMediadora.idConflito)
        })
        .from(orgMediadora)
        .leftJoin(participacaoOrgMediadora, eq(orgMediadora.id, participacaoOrgMediadora.idOrgMediadora))
        .groupBy(orgMediadora.id, orgMediadora.nome)
        .orderBy(desc(count(participacaoOrgMediadora.idConflito)))
        .limit(10);
    } catch (error) {
      console.error('Error getting most active mediators:', error);
      throw error;
    }
  }

  async getWeaponsByDestructivePower(): Promise<{ nome: string; capacidadeDestrutiva: number }[]> {
    try {
      return await db
        .select({
          nome: armas.nome,
          capacidadeDestrutiva: armas.capacidadeDestrutiva
        })
        .from(armas)
        .orderBy(desc(armas.capacidadeDestrutiva))
        .limit(10);
    } catch (error) {
      console.error('Error getting weapons by destructive power:', error);
      throw error;
    }
  }

  async getDivisionResources(): Promise<{ 
    totalTanques: number; 
    totalAvioes: number; 
    totalBarcos: number; 
    totalHomens: number;
  }> {
    try {
      const [result] = await db
        .select({
          totalTanques: sum(divisao.numeroTanques),
          totalAvioes: sum(divisao.numeroAvioes),
          totalBarcos: sum(divisao.numeroBarcos),
          totalHomens: sum(divisao.numeroHomens)
        })
        .from(divisao);

      return {
        totalTanques: Number(result.totalTanques) || 0,
        totalAvioes: Number(result.totalAvioes) || 0,
        totalBarcos: Number(result.totalBarcos) || 0,
        totalHomens: Number(result.totalHomens) || 0,
      };
    } catch (error) {
      console.error('Error getting division resources:', error);
      throw error;
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    try {
      const result = await db.execute(sql.raw(query));
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDDLSchema(): Promise<string> {
    // This would typically come from information_schema
    // For now, return a static DDL based on our schema
    return `
-- ConflictDB Schema Definition
CREATE TABLE conflito (
    id VARCHAR(2) NOT NULL,
    total_mortos INT NOT NULL,
    total_feridos INT NOT NULL,
    causa VARCHAR(30) NOT NULL,
    lugar VARCHAR(30) NOT NULL,
    nome VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE grupo_armado (
    id VARCHAR(2) NOT NULL,
    nome VARCHAR(15) NOT NULL,
    numero_baixas INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE divisao (
    numero_divisao VARCHAR(2) NOT NULL,
    id_grupo_armado VARCHAR(2) NOT NULL,
    numero_barcos INT NOT NULL,
    numero_tanques INT NOT NULL,
    numero_avioes INT NOT NULL,
    numero_homens INT NOT NULL,
    numero_baixas INT NOT NULL,
    PRIMARY KEY(numero_divisao),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE org_mediadora (
    id VARCHAR(2) NOT NULL,
    nome VARCHAR(15) NOT NULL,
    tipo_org VARCHAR(10) NOT NULL,
    org_superior VARCHAR(10),
    numero_pessoas_sustentadas INT NOT NULL,
    tipo_ajuda VARCHAR(10) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(org_superior) REFERENCES org_mediadora(id)
);

CREATE TABLE lider_politico (
    nome VARCHAR(15) NOT NULL,
    id_grupo_armado VARCHAR(2) NOT NULL,
    apoio VARCHAR(30) NOT NULL,
    PRIMARY KEY(nome, id_grupo_armado),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE traficantes (
    nome VARCHAR(15) NOT NULL,
    PRIMARY KEY(nome)
);

CREATE TABLE armas (
    nome VARCHAR(15) NOT NULL,
    capacidade_destrutiva INT NOT NULL,
    PRIMARY KEY(nome)
);

CREATE TABLE chefe_militar (
    id VARCHAR(2) NOT NULL,
    faixa_hierarquica VARCHAR(15) NOT NULL,
    nome_lider_politico VARCHAR(15) NOT NULL,
    numero_divisao VARCHAR(15) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(nome_lider_politico) REFERENCES lider_politico(nome),
    FOREIGN KEY(numero_divisao) REFERENCES divisao(numero_divisao)
);

-- Specialized conflict type tables (not partitions)
CREATE TABLE religiao (
    id_conflito VARCHAR(2) NOT NULL,
    religiao_afetada VARCHAR(10) NOT NULL,
    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE territorio (
    id_conflito VARCHAR(2) NOT NULL,
    area_afetada VARCHAR(10) NOT NULL,
    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE economia (
    id_conflito VARCHAR(2) NOT NULL,
    materia_prima_disputada VARCHAR(10) NOT NULL,
    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE raca (
    id_conflito VARCHAR(2) NOT NULL,
    etnia_afetada VARCHAR(10) NOT NULL,
    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

-- Relationship tables
CREATE TABLE fornecimento (
    id_grupo_armado VARCHAR(2) NOT NULL,
    nome_traficante VARCHAR(15) NOT NULL,
    nome_arma VARCHAR(15) NOT NULL,
    quantidade_fornecida INT NOT NULL,
    PRIMARY KEY(id_grupo_armado, nome_traficante, nome_arma),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id),
    FOREIGN KEY(nome_traficante) REFERENCES traficantes(nome),
    FOREIGN KEY(nome_arma) REFERENCES armas(nome)
);

CREATE TABLE contrabandeia (
    nome_traficante VARCHAR(15) NOT NULL,
    nome_arma VARCHAR(15) NOT NULL,
    quantidade_possuida INT NOT NULL,
    PRIMARY KEY(nome_arma, nome_traficante),
    FOREIGN KEY(nome_arma) REFERENCES armas(nome),
    FOREIGN KEY(nome_traficante) REFERENCES traficantes(nome)
);

-- Active triggers and constraints ensure data integrity
    `;
  }

  async getTriggerInfo(): Promise<{ name: string; definition: string; active: boolean }[]> {
    return [
      {
        name: "limita_chefe_por_divisao",
        definition: `CREATE FUNCTION limita_chefe_por_divisao() RETURNS trigger AS $$
BEGIN
    IF(SELECT COUNT(*) FROM chefe_militar WHERE numero_divisao = NEW.numero_divisao) >= 3
        THEN RAISE EXCEPTION 'A divisão escolhida já tem o máximo de 3 chefes';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teste_limite_chefe_div
BEFORE INSERT ON chefe_militar
FOR EACH ROW
EXECUTE FUNCTION limita_chefe_por_divisao();`,
        active: true
      },
      {
        name: "hierarquia_de_conflitos",
        definition: `CREATE FUNCTION hierarquia_de_conflitos() RETURNS trigger AS $$
BEGIN
    -- Validação da hierarquia organizacional
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,
        active: true
      }
    ];
  }

  // New report methods
  async getConflictsByCasualties(): Promise<{ nome: string; totalBaixas: number }[]> {
    try {
      const result = await db.execute(sql`
        SELECT nome, (total_mortos + total_feridos) as totalBaixas 
        FROM conflito 
        ORDER BY totalBaixas DESC
      `);
      return result.rows as { nome: string; totalBaixas: number }[];
    } catch (error) {
      console.error('Error getting conflicts by casualties:', error);
      throw error;
    }
  }

  async getGroupsByWeapons(): Promise<{ nome: string; totalArmas: number }[]> {
    try {
      const result = await db.execute(sql`
        SELECT g.nome, COALESCE(SUM(f.quantidade_fornecida), 0) as totalArmas
        FROM grupo_armado g
        LEFT JOIN fornecimento f ON g.id = f.id_grupo_armado
        GROUP BY g.id, g.nome
        ORDER BY totalArmas DESC
      `);
      return result.rows as { nome: string; totalArmas: number }[];
    } catch (error) {
      console.error('Error getting groups by weapons:', error);
      throw error;
    }
  }

  async getWeaponTrafficking(): Promise<{ traficante: string; grupo: string }[]> {
    try {
      const result = await db.execute(sql`
        SELECT DISTINCT t.nome as traficante, g.nome as grupo
        FROM traficantes t
        JOIN fornecimento f ON t.nome = f.nome_traficante
        JOIN grupo_armado g ON f.id_grupo_armado = g.id
        WHERE f.nome_arma IN ('Barret M82', 'M200 interv')
        ORDER BY t.nome, g.nome
      `);
      return result.rows as { traficante: string; grupo: string }[];
    } catch (error) {
      console.error('Error getting weapon trafficking:', error);
      throw error;
    }
  }

  async getReligiousConflicts(): Promise<{ pais: string; conflitos: number }[]> {
    try {
      const result = await db.execute(sql`
        SELECT p.pais_envolvido as pais, COUNT(*) as conflitos
        FROM paises_em_conflito p
        JOIN religiao r ON p.id_conflito = r.id_conflito
        GROUP BY p.pais_envolvido
        ORDER BY conflitos DESC
      `);
      return result.rows as { pais: string; conflitos: number }[];
    } catch (error) {
      console.error('Error getting religious conflicts:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();

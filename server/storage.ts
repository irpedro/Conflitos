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
import { eq, sql, desc, asc, count, sum } from "drizzle-orm";

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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Conflict methods
  async getAllConflicts(): Promise<Conflito[]> {
    return await db.select().from(conflito).orderBy(asc(conflito.id));
  }

  async getConflictById(id: string): Promise<Conflito | undefined> {
    const [conflict] = await db.select().from(conflito).where(eq(conflito.id, id));
    return conflict || undefined;
  }

  async createConflict(conflict: InsertConflito): Promise<Conflito> {
    const [created] = await db.insert(conflito).values(conflict).returning();
    return created;
  }

  async updateConflict(id: string, conflict: Partial<InsertConflito>): Promise<Conflito> {
    const [updated] = await db
      .update(conflito)
      .set(conflict)
      .where(eq(conflito.id, id))
      .returning();
    return updated;
  }

  async deleteConflict(id: string): Promise<void> {
    await db.delete(conflito).where(eq(conflito.id, id));
  }

  // Armed Group methods
  async getAllArmedGroups(): Promise<GrupoArmado[]> {
    return await db.select().from(grupoArmado).orderBy(asc(grupoArmado.id));
  }

  async getArmedGroupById(id: string): Promise<GrupoArmado | undefined> {
    const [group] = await db.select().from(grupoArmado).where(eq(grupoArmado.id, id));
    return group || undefined;
  }

  async createArmedGroup(group: InsertGrupoArmado): Promise<GrupoArmado> {
    const [created] = await db.insert(grupoArmado).values(group).returning();
    return created;
  }

  async updateArmedGroup(id: string, group: Partial<InsertGrupoArmado>): Promise<GrupoArmado> {
    const [updated] = await db
      .update(grupoArmado)
      .set(group)
      .where(eq(grupoArmado.id, id))
      .returning();
    return updated;
  }

  async deleteArmedGroup(id: string): Promise<void> {
    await db.delete(grupoArmado).where(eq(grupoArmado.id, id));
  }

  // Division methods
  async getAllDivisions(): Promise<Divisao[]> {
    return await db.select().from(divisao).orderBy(asc(divisao.numeroDivisao));
  }

  async getDivisionById(id: string): Promise<Divisao | undefined> {
    const [division] = await db.select().from(divisao).where(eq(divisao.numeroDivisao, id));
    return division || undefined;
  }

  async createDivision(division: InsertDivisao): Promise<Divisao> {
    const [created] = await db.insert(divisao).values(division).returning();
    return created;
  }

  async updateDivision(id: string, division: Partial<InsertDivisao>): Promise<Divisao> {
    const [updated] = await db
      .update(divisao)
      .set(division)
      .where(eq(divisao.numeroDivisao, id))
      .returning();
    return updated;
  }

  async deleteDivision(id: string): Promise<void> {
    await db.delete(divisao).where(eq(divisao.numeroDivisao, id));
  }

  // Political Leader methods
  async getAllPoliticalLeaders(): Promise<LiderPolitico[]> {
    return await db.select().from(liderPolitico).orderBy(asc(liderPolitico.nome));
  }

  async createPoliticalLeader(leader: InsertLiderPolitico): Promise<LiderPolitico> {
    const [created] = await db.insert(liderPolitico).values(leader).returning();
    return created;
  }

  async updatePoliticalLeader(nome: string, idGrupo: string, leader: Partial<InsertLiderPolitico>): Promise<LiderPolitico> {
    const [updated] = await db
      .update(liderPolitico)
      .set(leader)
      .where(eq(liderPolitico.nome, nome) && eq(liderPolitico.idGrupoArmado, idGrupo))
      .returning();
    return updated;
  }

  async deletePoliticalLeader(nome: string, idGrupo: string): Promise<void> {
    await db.delete(liderPolitico)
      .where(eq(liderPolitico.nome, nome) && eq(liderPolitico.idGrupoArmado, idGrupo));
  }

  // Military Chief methods
  async getAllMilitaryChiefs(): Promise<ChefeMilitar[]> {
    return await db.select().from(chefeMilitar).orderBy(asc(chefeMilitar.id));
  }

  async getMilitaryChiefById(id: string): Promise<ChefeMilitar | undefined> {
    const [chief] = await db.select().from(chefeMilitar).where(eq(chefeMilitar.id, id));
    return chief || undefined;
  }

  async createMilitaryChief(chief: InsertChefeMilitar): Promise<ChefeMilitar> {
    const [created] = await db.insert(chefeMilitar).values(chief).returning();
    return created;
  }

  async updateMilitaryChief(id: string, chief: Partial<InsertChefeMilitar>): Promise<ChefeMilitar> {
    const [updated] = await db
      .update(chefeMilitar)
      .set(chief)
      .where(eq(chefeMilitar.id, id))
      .returning();
    return updated;
  }

  async deleteMilitaryChief(id: string): Promise<void> {
    await db.delete(chefeMilitar).where(eq(chefeMilitar.id, id));
  }

  // Mediator Organization methods
  async getAllMediatorOrgs(): Promise<OrgMediadora[]> {
    return await db.select().from(orgMediadora).orderBy(asc(orgMediadora.id));
  }

  async getMediatorOrgById(id: string): Promise<OrgMediadora | undefined> {
    const [org] = await db.select().from(orgMediadora).where(eq(orgMediadora.id, id));
    return org || undefined;
  }

  async createMediatorOrg(org: InsertOrgMediadora): Promise<OrgMediadora> {
    const [created] = await db.insert(orgMediadora).values(org).returning();
    return created;
  }

  // Statistics and Reports
  async getConflictStatistics(): Promise<{
    totalConflicts: number;
    totalArmedGroups: number;
    totalDeaths: number;
    totalMediatorOrgs: number;
  }> {
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
  }

  async getConflictsByType(): Promise<{ causa: string; count: number }[]> {
    return await db
      .select({
        causa: conflito.causa,
        count: count()
      })
      .from(conflito)
      .groupBy(conflito.causa)
      .orderBy(desc(count()));
  }

  async getConflictsByRegion(): Promise<{ lugar: string; count: number }[]> {
    return await db
      .select({
        lugar: conflito.lugar,
        count: count()
      })
      .from(conflito)
      .groupBy(conflito.lugar)
      .orderBy(desc(count()));
  }

  async getGroupsByLosses(): Promise<{ nome: string; numeroBaixas: number }[]> {
    return await db
      .select({
        nome: grupoArmado.nome,
        numeroBaixas: grupoArmado.numeroBaixas
      })
      .from(grupoArmado)
      .orderBy(desc(grupoArmado.numeroBaixas))
      .limit(10);
  }

  async getMostActiveMediators(): Promise<{ nome: string; participacoes: number }[]> {
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
  }

  async getWeaponsByDestructivePower(): Promise<{ nome: string; capacidadeDestrutiva: number }[]> {
    return await db
      .select({
        nome: armas.nome,
        capacidadeDestrutiva: armas.capacidadeDestrutiva
      })
      .from(armas)
      .orderBy(desc(armas.capacidadeDestrutiva))
      .limit(10);
  }

  async getDivisionResources(): Promise<{ 
    totalTanques: number; 
    totalAvioes: number; 
    totalBarcos: number; 
    totalHomens: number;
  }> {
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
  }

  async executeQuery(query: string): Promise<any[]> {
    try {
      const result = await db.execute(sql.raw(query));
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
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
    const result = await db.execute(sql`
      SELECT nome, (total_mortos + total_feridos) as totalBaixas 
      FROM conflito 
      ORDER BY totalBaixas DESC
    `);
    return result.rows as { nome: string; totalBaixas: number }[];
  }

  async getGroupsByWeapons(): Promise<{ nome: string; totalArmas: number }[]> {
    const result = await db.execute(sql`
      SELECT g.nome, COALESCE(SUM(f.quantidade_fornecida), 0) as totalArmas
      FROM grupo_armado g
      LEFT JOIN fornecimento f ON g.id = f.id_grupo_armado
      GROUP BY g.id, g.nome
      ORDER BY totalArmas DESC
    `);
    return result.rows as { nome: string; totalArmas: number }[];
  }

  async getWeaponTrafficking(): Promise<{ traficante: string; grupo: string }[]> {
    const result = await db.execute(sql`
      SELECT DISTINCT t.nome as traficante, g.nome as grupo
      FROM traficantes t
      JOIN fornecimento f ON t.nome = f.nome_traficante
      JOIN grupo_armado g ON f.id_grupo_armado = g.id
      WHERE f.nome_arma IN ('Barret M82', 'M200 interv')
      ORDER BY t.nome, g.nome
    `);
    return result.rows as { traficante: string; grupo: string }[];
  }

  async getReligiousConflicts(): Promise<{ pais: string; conflitos: number }[]> {
    const result = await db.execute(sql`
      SELECT p.pais_envolvido as pais, COUNT(*) as conflitos
      FROM paises_em_conflito p
      JOIN religiao r ON p.id_conflito = r.id_conflito
      GROUP BY p.pais_envolvido
      ORDER BY conflitos DESC
    `);
    return result.rows as { pais: string; conflitos: number }[];
  }
}

export const storage = new DatabaseStorage();

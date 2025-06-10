import { pgTable, text, serial, integer, varchar, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Core tables - Updated to match new SQL schema with INT IDs
export const conflito = pgTable("conflito", {
  id: integer("id").primaryKey(),
  totalMortos: integer("total_mortos").notNull(),
  totalFeridos: integer("total_feridos").notNull(),
  causa: varchar("causa", { length: 50 }).notNull(),
  lugar: varchar("lugar", { length: 50 }).notNull(),
  nome: varchar("nome", { length: 50 }).notNull(),
});

export const grupoArmado = pgTable("grupo_armado", {
  id: integer("id").primaryKey(),
  nome: varchar("nome", { length: 30 }).notNull(),
  numeroBaixas: integer("numero_baixas").notNull(),
});

export const divisao = pgTable("divisao", {
  numeroDivisao: integer("numero_divisao").primaryKey(),
  idGrupoArmado: integer("id_grupo_armado").notNull(),
  numeroBarcos: integer("numero_barcos").notNull(),
  numeroTanques: integer("numero_tanques").notNull(),
  numeroAvioes: integer("numero_avioes").notNull(),
  numeroHomens: integer("numero_homens").notNull(),
  numeroBaixas: integer("numero_baixas").notNull(),
}, (table) => ({
  grupoArmadoFk: foreignKey({
    columns: [table.idGrupoArmado],
    foreignColumns: [grupoArmado.id],
  }),
}));

export const orgMediadora = pgTable("org_mediadora", {
  id: integer("id").primaryKey(),
  nome: varchar("nome", { length: 30 }).notNull(),
  tipoOrg: varchar("tipo_org", { length: 20 }).notNull(),
  orgSuperior: varchar("org_superior", { length: 10 }),
  numeroPessoasSustentadas: integer("numero_pessoas_sustentadas").notNull(),
  tipoAjuda: varchar("tipo_ajuda", { length: 20 }).notNull(),
});

export const liderPolitico = pgTable("lider_politico", {
  nome: varchar("nome", { length: 30 }).notNull(),
  idGrupoArmado: integer("id_grupo_armado").notNull(),
  apoio: varchar("apoio", { length: 50 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.nome, table.idGrupoArmado] }),
  grupoArmadoFk: foreignKey({
    columns: [table.idGrupoArmado],
    foreignColumns: [grupoArmado.id],
  }),
}));

export const traficantes = pgTable("traficantes", {
  nome: varchar("nome", { length: 30 }).primaryKey(),
});

export const armas = pgTable("armas", {
  nome: varchar("nome", { length: 30 }).primaryKey(),
  capacidadeDestrutiva: integer("capacidade_destrutiva").notNull(),
});

export const chefeMilitar = pgTable("chefe_militar", {
  id: integer("id").primaryKey(),
  faixaHierarquica: varchar("faixa_hierarquica", { length: 30 }).notNull(),
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 30 }).notNull(),
  numeroDivisao: integer("numero_divisao").notNull(),
}, (table) => ({
  divisaoFk: foreignKey({
    columns: [table.numeroDivisao],
    foreignColumns: [divisao.numeroDivisao],
  }),
}));

// Conflict classification tables
export const religiao = pgTable("religiao", {
  idConflito: integer("id_conflito").primaryKey(),
  religiaoAfetada: varchar("religiao_afetada", { length: 10 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

export const territorio = pgTable("territorio", {
  idConflito: integer("id_conflito").primaryKey(),
  areaAfetada: varchar("area_afetada", { length: 10 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

export const economia = pgTable("economia", {
  idConflito: integer("id_conflito").primaryKey(),
  materiaPrimaDisputada: varchar("materia_prima_disputada", { length: 10 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

export const raca = pgTable("raca", {
  idConflito: integer("id_conflito").primaryKey(),
  etniaAfetada: varchar("etnia_afetada", { length: 10 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

export const paisesEmConflito = pgTable("paises_em_conflito", {
  idConflito: integer("id_conflito").notNull(),
  paisEnvolvido: varchar("pais_envolvido", { length: 30 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.idConflito, table.paisEnvolvido] }),
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

// Participation tables
export const participacaoGrupoArmado = pgTable("participacao_grupo_armado", {
  idConflito: integer("id_conflito").notNull(),
  idGrupoArmado: integer("id_grupo_armado").notNull(),
  dataEntrada: varchar("data_entrada", { length: 10 }).notNull(),
  dataSaida: varchar("data_saida", { length: 10 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.idConflito, table.idGrupoArmado] }),
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
  grupoArmadoFk: foreignKey({
    columns: [table.idGrupoArmado],
    foreignColumns: [grupoArmado.id],
  }),
}));

export const participacaoOrgMediadora = pgTable("participacao_org_mediadora", {
  idConflito: integer("id_conflito").notNull(),
  idOrgMediadora: integer("id_org_mediadora").notNull(),
  dataEntrada: varchar("data_entrada", { length: 10 }).notNull(),
  dataSaida: varchar("data_saida", { length: 10 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.idConflito, table.idOrgMediadora] }),
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
  orgMediadoraFk: foreignKey({
    columns: [table.idOrgMediadora],
    foreignColumns: [orgMediadora.id],
  }),
}));

export const dialogo = pgTable("dialogo", {
  idOrgMediadora: integer("id_org_mediadora").notNull(),
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 30 }).notNull(),
  idGrupoArmado: integer("id_grupo_armado").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.idOrgMediadora, table.nomeLiderPolitico, table.idGrupoArmado] }),
  orgMediadoraFk: foreignKey({
    columns: [table.idOrgMediadora],
    foreignColumns: [orgMediadora.id],
  }),
  liderPoliticoFk: foreignKey({
    columns: [table.nomeLiderPolitico, table.idGrupoArmado],
    foreignColumns: [liderPolitico.nome, liderPolitico.idGrupoArmado],
  }),
}));

export const lideranca = pgTable("lideranca", {
  idGrupoArmado: integer("id_grupo_armado").notNull(),
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 30 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.idGrupoArmado, table.nomeLiderPolitico] }),
  grupoArmadoFk: foreignKey({
    columns: [table.idGrupoArmado],
    foreignColumns: [grupoArmado.id],
  }),
  liderPoliticoFk: foreignKey({
    columns: [table.nomeLiderPolitico, table.idGrupoArmado],
    foreignColumns: [liderPolitico.nome, liderPolitico.idGrupoArmado],
  }),
}));

export const fornecimento = pgTable("fornecimento", {
  idGrupoArmado: integer("id_grupo_armado").notNull(),
  nomeTraficante: varchar("nome_traficante", { length: 30 }).notNull(),
  nomeArma: varchar("nome_arma", { length: 30 }).notNull(),
  quantidadeFornecida: integer("quantidade_fornecida").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.idGrupoArmado, table.nomeTraficante, table.nomeArma] }),
  grupoArmadoFk: foreignKey({
    columns: [table.idGrupoArmado],
    foreignColumns: [grupoArmado.id],
  }),
  traficantesFk: foreignKey({
    columns: [table.nomeTraficante],
    foreignColumns: [traficantes.nome],
  }),
  armasFk: foreignKey({
    columns: [table.nomeArma],
    foreignColumns: [armas.nome],
  }),
}));

export const contrabandeia = pgTable("contrabandeia", {
  nomeTraficante: varchar("nome_traficante", { length: 30 }).notNull(),
  nomeArma: varchar("nome_arma", { length: 30 }).notNull(),
  quantidadePossuida: integer("quantidade_possuida").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.nomeArma, table.nomeTraficante] }),
  armasFk: foreignKey({
    columns: [table.nomeArma],
    foreignColumns: [armas.nome],
  }),
  traficantesFk: foreignKey({
    columns: [table.nomeTraficante],
    foreignColumns: [traficantes.nome],
  }),
}));

// Relations
export const conflitoRelations = relations(conflito, ({ many }) => ({
  religiao: many(religiao),
  territorio: many(territorio),
  economia: many(economia),
  raca: many(raca),
  paisesEmConflito: many(paisesEmConflito),
  participacaoGrupoArmado: many(participacaoGrupoArmado),
  participacaoOrgMediadora: many(participacaoOrgMediadora),
}));

export const grupoArmadoRelations = relations(grupoArmado, ({ many }) => ({
  divisoes: many(divisao),
  lideresPolticos: many(liderPolitico),
  participacaoConflitos: many(participacaoGrupoArmado),
  lideranca: many(lideranca),
  fornecimento: many(fornecimento),
}));

export const divisaoRelations = relations(divisao, ({ one, many }) => ({
  grupoArmado: one(grupoArmado, {
    fields: [divisao.idGrupoArmado],
    references: [grupoArmado.id],
  }),
  chefesMilitares: many(chefeMilitar),
}));

// Types
export type Conflito = typeof conflito.$inferSelect;
export type InsertConflito = typeof conflito.$inferInsert;
export type GrupoArmado = typeof grupoArmado.$inferSelect;
export type InsertGrupoArmado = typeof grupoArmado.$inferInsert;
export type Divisao = typeof divisao.$inferSelect;
export type InsertDivisao = typeof divisao.$inferInsert;
export type LiderPolitico = typeof liderPolitico.$inferSelect;
export type InsertLiderPolitico = typeof liderPolitico.$inferInsert;
export type ChefeMilitar = typeof chefeMilitar.$inferSelect;
export type InsertChefeMilitar = typeof chefeMilitar.$inferInsert;
export type OrgMediadora = typeof orgMediadora.$inferSelect;
export type InsertOrgMediadora = typeof orgMediadora.$inferInsert;

// Helper for string to number conversion
const numberFromString = z.union([
  z.number(),
  z.string().transform((val) => {
    if (val === "" || val === null || val === undefined) return 0;
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : num;
  })
]);

const optionalNumberFromString = z.union([
  z.number(),
  z.string().transform((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  })
]).optional();

// Insert schemas with string to number coercion
export const insertConflitoSchema = createInsertSchema(conflito).extend({
  id: optionalNumberFromString,
  totalMortos: numberFromString,
  totalFeridos: numberFromString,
});

export const insertGrupoArmadoSchema = createInsertSchema(grupoArmado).extend({
  id: optionalNumberFromString,
  numeroBaixas: numberFromString,
});

export const insertDivisaoSchema = createInsertSchema(divisao).extend({
  numeroDivisao: optionalNumberFromString,
  idGrupoArmado: numberFromString,
  numeroBarcos: numberFromString,
  numeroTanques: numberFromString,
  numeroAvioes: numberFromString,
  numeroHomens: numberFromString,
  numeroBaixas: numberFromString,
});

export const insertLiderPoliticoSchema = createInsertSchema(liderPolitico).extend({
  idGrupoArmado: numberFromString,
});

export const insertChefeMilitarSchema = createInsertSchema(chefeMilitar).extend({
  id: optionalNumberFromString,
  numeroDivisao: numberFromString,
});

// Keep original users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

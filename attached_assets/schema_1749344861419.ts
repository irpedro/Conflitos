import { pgTable, text, serial, integer, varchar, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Core tables
export const conflito = pgTable("conflito", {
  id: varchar("id", { length: 2 }).primaryKey(),
  totalMortos: integer("total_mortos").notNull(),
  totalFeridos: integer("total_feridos").notNull(),
  causa: varchar("causa", { length: 30 }).notNull(),
  lugar: varchar("lugar", { length: 30 }).notNull(),
  nome: varchar("nome", { length: 30 }).notNull(),
});

export const grupoArmado = pgTable("grupo_armado", {
  id: varchar("id", { length: 2 }).primaryKey(),
  nome: varchar("nome", { length: 15 }).notNull(),
  numeroBaixas: integer("numero_baixas").notNull(),
});

export const divisao = pgTable("divisao", {
  numeroDivisao: varchar("numero_divisao", { length: 2 }).primaryKey(),
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
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
  id: varchar("id", { length: 2 }).primaryKey(),
  nome: varchar("nome", { length: 15 }).notNull(),
  tipoOrg: varchar("tipo_org", { length: 10 }).notNull(),
  orgSuperior: varchar("org_superior", { length: 10 }),
  numeroPessoasSustentadas: integer("numero_pessoas_sustendas").notNull(),
  tipoAjuda: varchar("tipo_ajuda", { length: 10 }).notNull(),
}, (table) => ({
  orgSuperiorFk: foreignKey({
    columns: [table.orgSuperior],
    foreignColumns: [table.id],
  }),
}));

export const liderPolitico = pgTable("lider_politico", {
  nome: varchar("nome", { length: 15 }).notNull(),
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
  apoio: varchar("apoio", { length: 30 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.nome, table.idGrupoArmado] }),
  grupoArmadoFk: foreignKey({
    columns: [table.idGrupoArmado],
    foreignColumns: [grupoArmado.id],
  }),
}));

export const traficantes = pgTable("traficantes", {
  nome: varchar("nome", { length: 15 }).primaryKey(),
});

export const armas = pgTable("armas", {
  nome: varchar("nome", { length: 15 }).primaryKey(),
  capacidadeDestrutiva: integer("capacidade_destrutiva").notNull(),
});

export const chefeMilitar = pgTable("chefe_militar", {
  id: varchar("id", { length: 2 }).primaryKey(),
  faixaHierarquica: varchar("faixa_hierarquica", { length: 15 }).notNull(),
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 15 }).notNull(),
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),  // **ADICIONE ESSA COLUNA**
  numeroDivisao: varchar("numero_divisao", { length: 15 }).notNull(),
}, (table) => ({
  liderPoliticoFk: foreignKey({
    columns: [table.nomeLiderPolitico, table.idGrupoArmado],  // DUAS COLUNAS
    foreignColumns: [liderPolitico.nome, liderPolitico.idGrupoArmado],  // DUAS COLUNAS
  }),
  divisaoFk: foreignKey({
    columns: [table.numeroDivisao],
    foreignColumns: [divisao.numeroDivisao],
  }),
}));

// Conflict classification tables
export const religiao = pgTable("religiao", {
  idConflito: varchar("id_conflito", { length: 2 }).primaryKey(),
  religiaoAfetada: varchar("religiao_afetada", { length: 10 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

export const territorio = pgTable("territorio", {
  idConflito: varchar("id_conflito", { length: 2 }).primaryKey(),
  areaAfetada: varchar("area_afetada", { length: 10 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

export const economia = pgTable("economia", {
  idConflito: varchar("id_conflito", { length: 2 }).primaryKey(),
  materiaPrimaDisputada: varchar("materia_prima_disputada", { length: 10 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

export const raca = pgTable("raca", {
  idConflito: varchar("id_conflito", { length: 2 }).primaryKey(),
  etniaAfetada: varchar("etnia_afetada", { length: 10 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

export const paisesEmConflito = pgTable("paises_em_conflito", {
  idConflito: varchar("id_conflito", { length: 2 }).primaryKey(),
  paisEnvolvido: varchar("pais_envolvido", { length: 30 }).notNull(),
}, (table) => ({
  conflitoFk: foreignKey({
    columns: [table.idConflito],
    foreignColumns: [conflito.id],
  }),
}));

// Participation tables
export const participacaoGrupoArmado = pgTable("participacao_grupo_armado", {
  idConflito: varchar("id_conflito", { length: 2 }).notNull(),
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
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
  idConflito: varchar("id_conflito", { length: 2 }).notNull(),
  idOrgMediadora: varchar("id_org_mediadora", { length: 2 }).notNull(),
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
  idOrgMediadora: varchar("id_org_mediadora", { length: 2 }).notNull(),
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 15 }).notNull(),
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),  // **ADICIONE**
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
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 15 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.idGrupoArmado, table.nomeLiderPolitico] }),
  grupoArmadoFk: foreignKey({
    columns: [table.idGrupoArmado],
    foreignColumns: [grupoArmado.id],
  }),
  liderPoliticoFk: foreignKey({
    columns: [table.nomeLiderPolitico, table.idGrupoArmado],   // DUAS COLUNAS
    foreignColumns: [liderPolitico.nome, liderPolitico.idGrupoArmado],
  }),
}));

export const fornecimento = pgTable("fornecimento", {
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
  nomeTraficante: varchar("nome_traficante", { length: 15 }).notNull(),
  nomeArma: varchar("nome_arma", { length: 15 }).notNull(),
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
  nomeTraficante: varchar("nome_traficante", { length: 15 }).notNull(),
  nomeArma: varchar("nome_arma", { length: 15 }).notNull(),
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

// Saved queries table for the application
export const savedQueries = pgTable("saved_queries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  query: text("query").notNull(),
  isFavorite: integer("is_favorite").default(0).notNull(),
  createdAt: text("created_at").notNull(),
  executionTime: integer("execution_time"),
});

// Query execution history
export const queryHistory = pgTable("query_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  executionTime: integer("execution_time").notNull(),
  rowsReturned: integer("rows_returned"),
  executedAt: text("executed_at").notNull(),
  success: integer("success").notNull(),
  errorMessage: text("error_message"),
});

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

// Schema types
export const insertSavedQuerySchema = createInsertSchema(savedQueries).omit({
  id: true,
  createdAt: true,
});

export const insertQueryHistorySchema = createInsertSchema(queryHistory).omit({
  id: true,
  executedAt: true,
});

export type InsertSavedQuery = z.infer<typeof insertSavedQuerySchema>;
export type SavedQuery = typeof savedQueries.$inferSelect;
export type InsertQueryHistory = z.infer<typeof insertQueryHistorySchema>;
export type QueryHistory = typeof queryHistory.$inferSelect;

export type Conflito = typeof conflito.$inferSelect;
export type GrupoArmado = typeof grupoArmado.$inferSelect;
export type Divisao = typeof divisao.$inferSelect;

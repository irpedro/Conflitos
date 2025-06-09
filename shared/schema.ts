import { pgTable, text, serial, integer, varchar, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Core tables
export const conflito = pgTable("conflito", {
  id: varchar("id", { length: 2 }).primaryKey(),
  totalMortos: integer("total_mortos").notNull(),
  totalFeridos: integer("total_feridos").notNull(),
  causa: varchar("causa", { length: 50 }).notNull(), // 30 → 50
  lugar: varchar("lugar", { length: 50 }).notNull(), // 30 → 50
  nome: varchar("nome", { length: 50 }).notNull(),   // 30 → 50
});

export const grupoArmado = pgTable("grupo_armado", {
  id: varchar("id", { length: 2 }).primaryKey(),
  nome: varchar("nome", { length: 30 }).notNull(),   // 15 → 30
  numeroBaixas: integer("numero_baixas").notNull(),
});

export const divisao = pgTable("divisao", {
  numeroDivisao: varchar("numero_divisao", { length: 2 }).primaryKey(), // 5 → 2
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
  nome: varchar("nome", { length: 30 }).notNull(),
  tipoOrg: varchar("tipo_org", { length: 20 }).notNull(), // 15 → 20
  orgSuperior: varchar("org_superior", { length: 2 }),    // 2 → 2 (mas agora com FK)
  numeroPessoasSustentadas: integer("numero_pessoas_sustentadas").notNull(),
  tipoAjuda: varchar("tipo_ajuda", { length: 20 }).notNull(), // 15 → 20
}, (table) => ({
  // Foreign key para auto-referência (org_superior)
  orgSuperiorFk: foreignKey({
    columns: [table.orgSuperior],
    foreignColumns: [table.id],
  }),
}));

export const liderPolitico = pgTable("lider_politico", {
  nome: varchar("nome", { length: 30 }).notNull(),        // 15 → 30
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
  apoio: varchar("apoio", { length: 50 }).notNull(),      // 30 → 50
}, (table) => ({
  pk: primaryKey({ columns: [table.nome, table.idGrupoArmado] }),
  grupoArmadoFk: foreignKey({
    columns: [table.idGrupoArmado],
    foreignColumns: [grupoArmado.id],
  }),
}));

export const traficantes = pgTable("traficantes", {
  nome: varchar("nome", { length: 30 }).primaryKey(),     // 15 → 30
});

export const armas = pgTable("armas", {
  nome: varchar("nome", { length: 30 }).primaryKey(),     // 15 → 30
  capacidadeDestrutiva: integer("capacidade_destrutiva").notNull(),
});

export const chefeMilitar = pgTable("chefe_militar", {
  id: varchar("id", { length: 2 }).primaryKey(),
  faixaHierarquica: varchar("faixa_hierarquica", { length: 30 }).notNull(), // 15 → 30
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 30 }).notNull(), // 15 → 30
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
  numeroDivisao: varchar("numero_divisao", { length: 15 }).notNull(),
}, (table) => ({
  liderPoliticoFk: foreignKey({
    columns: [table.nomeLiderPolitico, table.idGrupoArmado],
    foreignColumns: [liderPolitico.nome, liderPolitico.idGrupoArmado],
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
  idConflito: varchar("id_conflito", { length: 2 }).notNull(),
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
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 30 }).notNull(), // 15 → 30
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
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
  nomeLiderPolitico: varchar("nome_lider_politico", { length: 30 }).notNull(), // 15 → 30
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
  idGrupoArmado: varchar("id_grupo_armado", { length: 2 }).notNull(),
  nomeTraficante: varchar("nome_traficante", { length: 30 }).notNull(),    // 15 → 30
  nomeArma: varchar("nome_arma", { length: 30 }).notNull(),                // 15 → 30
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
  nomeTraficante: varchar("nome_traficante", { length: 30 }).notNull(),    // 15 → 30
  nomeArma: varchar("nome_arma", { length: 30 }).notNull(),                // 15 → 30
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

// Relations - COMPLETAS E CORRIGIDAS
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

// NOVAS RELAÇÕES ADICIONADAS
export const orgMediadoraRelations = relations(orgMediadora, ({ one, many }) => ({
  orgSuperior: one(orgMediadora, {
    fields: [orgMediadora.orgSuperior],
    references: [orgMediadora.id],
    relationName: "orgHierarchy",
  }),
  orgSubordinadas: many(orgMediadora, {
    relationName: "orgHierarchy",
  }),
  participacaoConflitos: many(participacaoOrgMediadora),
  dialogos: many(dialogo),
}));

export const liderPoliticoRelations = relations(liderPolitico, ({ one, many }) => ({
  grupoArmado: one(grupoArmado, {
    fields: [liderPolitico.idGrupoArmado],
    references: [grupoArmado.id],
  }),
  chefesMilitares: many(chefeMilitar),
  dialogos: many(dialogo),
  lideranca: many(lideranca),
}));

export const chefeMilitarRelations = relations(chefeMilitar, ({ one }) => ({
  liderPolitico: one(liderPolitico, {
    fields: [chefeMilitar.nomeLiderPolitico, chefeMilitar.idGrupoArmado],
    references: [liderPolitico.nome, liderPolitico.idGrupoArmado],
  }),
  divisao: one(divisao, {
    fields: [chefeMilitar.numeroDivisao],
    references: [divisao.numeroDivisao],
  }),
}));

export const traficanteRelations = relations(traficantes, ({ many }) => ({
  contrabandos: many(contrabandeia),
  fornecimentos: many(fornecimento),
}));

export const armasRelations = relations(armas, ({ many }) => ({
  contrabandos: many(contrabandeia),
  fornecimentos: many(fornecimento),
}));

export const religiaoRelations = relations(religiao, ({ one }) => ({
  conflito: one(conflito, {
    fields: [religiao.idConflito],
    references: [conflito.id],
  }),
}));

export const territorioRelations = relations(territorio, ({ one }) => ({
  conflito: one(conflito, {
    fields: [territorio.idConflito],
    references: [conflito.id],
  }),
}));

export const economiaRelations = relations(economia, ({ one }) => ({
  conflito: one(conflito, {
    fields: [economia.idConflito],
    references: [conflito.id],
  }),
}));

export const racaRelations = relations(raca, ({ one }) => ({
  conflito: one(conflito, {
    fields: [raca.idConflito],
    references: [conflito.id],
  }),
}));

export const paisesEmConflitoRelations = relations(paisesEmConflito, ({ one }) => ({
  conflito: one(conflito, {
    fields: [paisesEmConflito.idConflito],
    references: [conflito.id],
  }),
}));

export const participacaoGrupoArmadoRelations = relations(participacaoGrupoArmado, ({ one }) => ({
  conflito: one(conflito, {
    fields: [participacaoGrupoArmado.idConflito],
    references: [conflito.id],
  }),
  grupoArmado: one(grupoArmado, {
    fields: [participacaoGrupoArmado.idGrupoArmado],
    references: [grupoArmado.id],
  }),
}));

export const participacaoOrgMediadoraRelations = relations(participacaoOrgMediadora, ({ one }) => ({
  conflito: one(conflito, {
    fields: [participacaoOrgMediadora.idConflito],
    references: [conflito.id],
  }),
  orgMediadora: one(orgMediadora, {
    fields: [participacaoOrgMediadora.idOrgMediadora],
    references: [orgMediadora.id],
  }),
}));

export const dialogoRelations = relations(dialogo, ({ one }) => ({
  orgMediadora: one(orgMediadora, {
    fields: [dialogo.idOrgMediadora],
    references: [orgMediadora.id],
  }),
  liderPolitico: one(liderPolitico, {
    fields: [dialogo.nomeLiderPolitico, dialogo.idGrupoArmado],
    references: [liderPolitico.nome, liderPolitico.idGrupoArmado],
  }),
}));

export const liderancaRelations = relations(lideranca, ({ one }) => ({
  grupoArmado: one(grupoArmado, {
    fields: [lideranca.idGrupoArmado],
    references: [grupoArmado.id],
  }),
  liderPolitico: one(liderPolitico, {
    fields: [lideranca.nomeLiderPolitico, lideranca.idGrupoArmado],
    references: [liderPolitico.nome, liderPolitico.idGrupoArmado],
  }),
}));

export const fornecimentoRelations = relations(fornecimento, ({ one }) => ({
  grupoArmado: one(grupoArmado, {
    fields: [fornecimento.idGrupoArmado],
    references: [grupoArmado.id],
  }),
  traficante: one(traficantes, {
    fields: [fornecimento.nomeTraficante],
    references: [traficantes.nome],
  }),
  arma: one(armas, {
    fields: [fornecimento.nomeArma],
    references: [armas.nome],
  }),
}));

export const contrabandeiaRelations = relations(contrabandeia, ({ one }) => ({
  traficante: one(traficantes, {
    fields: [contrabandeia.nomeTraficante],
    references: [traficantes.nome],
  }),
  arma: one(armas, {
    fields: [contrabandeia.nomeArma],
    references: [armas.nome],
  }),
}));

// Types - ATUALIZADOS
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
export type Traficantes = typeof traficantes.$inferSelect;
export type InsertTraficantes = typeof traficantes.$inferInsert;
export type Armas = typeof armas.$inferSelect;
export type InsertArmas = typeof armas.$inferInsert;

// Insert schemas - COMPLETOS
export const insertConflitoSchema = createInsertSchema(conflito);
export const insertGrupoArmadoSchema = createInsertSchema(grupoArmado);
export const insertDivisaoSchema = createInsertSchema(divisao);
export const insertLiderPoliticoSchema = createInsertSchema(liderPolitico);
export const insertChefeMilitarSchema = createInsertSchema(chefeMilitar);
export const insertOrgMediadoraSchema = createInsertSchema(orgMediadora);
export const insertTraficanteSchema = createInsertSchema(traficantes);
export const insertArmaSchema = createInsertSchema(armas);

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

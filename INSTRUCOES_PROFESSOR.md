# 📋 INSTRUÇÕES PARA AVALIAÇÃO - ConflictDB

## 🌐 ACESSO AO SISTEMA

**URL DO SISTEMA:** A URL será fornecida pelo estudante (Replit hospeda gratuitamente)

O sistema funciona diretamente no navegador, sem necessidade de instalação.

## 🎯 PONTOS DE AVALIAÇÃO

### 1. DASHBOARD PRINCIPAL
- Acesse a página inicial
- Observe as estatísticas: 10 conflitos, 10 grupos armados, 1.3M+ baixas
- Verifique os gráficos interativos de conflitos por tipo e região
- Examine a tabela de conflitos com dados reais

### 2. EDITOR SQL (Funcionalidade Principal)
- Clique em "SQL Editor" no menu
- Execute consultas de exemplo fornecidas
- Teste consultas personalizadas como:
  ```sql
  SELECT * FROM conflito ORDER BY total_mortos DESC;
  SELECT nome, numero_baixas FROM grupo_armado ORDER BY numero_baixas DESC;
  ```

### 3. SCHEMA DO BANCO DE DADOS
- Acesse "Database" → "Schema"
- Visualize o DDL completo com 19 tabelas
- Examine as relações entre tabelas
- Verifique constraints e foreign keys

### 4. TRIGGERS E RESTRIÇÕES
- Na seção "Database" → "Triggers"
- Observe os triggers implementados:
  - `update_conflict_casualties`: Atualiza baixas automaticamente
  - `validate_division_numbering`: Valida formato de divisões
- Execute: `SELECT * FROM information_schema.table_constraints WHERE table_schema = 'public';`

### 5. RELATÓRIOS AVANÇADOS
- Acesse "Reports"
- Examine os 4 relatórios implementados:
  - Grupos por baixas
  - Organizações mediadoras ativas
  - Armas por capacidade destrutiva
  - Recursos das divisões

### 6. GERENCIAMENTO DE DADOS
- Acesse "Manage"
- Verifique as interfaces CRUD para:
  - Grupos Armados
  - Organizações Mediadoras
  - Divisões Militares
  - Líderes Políticos
  - Chefes Militares

## 🔍 CONSULTAS DE TESTE RECOMENDADAS

### Verificar Triggers Funcionando:
```sql
-- Visualizar função de trigger
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'update_conflict_casualties';

-- Testar constraint de divisão
INSERT INTO divisao (numero_divisao, id_grupo_armado, numero_barcos, numero_tanques, numero_avioes, numero_homens, numero_baixas) 
VALUES ('INVALIDO', '1', 0, 0, 0, 100, 50);
-- Deve falhar por formato inválido
```

### Análises Complexas:
```sql
-- Top 5 conflitos por baixas totais
SELECT nome, total_mortos, total_feridos, (total_mortos + total_feridos) as total_baixas 
FROM conflito ORDER BY total_baixas DESC LIMIT 5;

-- Fornecedores de armas por eficiência
SELECT t.nome, COUNT(f.nome_arma) as armas_fornecidas, SUM(f.quantidade_fornecida) as total
FROM traficantes t 
JOIN fornecimento f ON t.nome = f.nome_traficante 
GROUP BY t.nome ORDER BY total DESC;

-- Organizações por conflitos mediados
SELECT om.nome, COUNT(pom.id_conflito) as conflitos_mediados
FROM org_mediadora om 
LEFT JOIN participacao_org_mediadora pom ON om.id = pom.id_org_mediadora 
GROUP BY om.nome ORDER BY conflitos_mediados DESC;
```

### Verificar Integridade Referencial:
```sql
-- Tentar inserir dados inválidos (deve falhar)
INSERT INTO participacao_grupo_armado (id_conflito, id_grupo_armado, data_entrada, data_saida) 
VALUES ('99', '1', '2020-01-01', '2021-01-01');
-- Deve falhar: conflito '99' não existe

INSERT INTO fornecimento (id_grupo_armado, nome_traficante, nome_arma, quantidade_fornecida) 
VALUES ('1', 'Inexistente', 'AK-47', 100);
-- Deve falhar: traficante não existe
```

## ✅ CHECKLIST DE AVALIAÇÃO

- [ ] Interface web funcional e profissional
- [ ] Banco PostgreSQL com 19 tabelas populadas
- [ ] Triggers funcionando (teste inserção/atualização)
- [ ] Constraints impedindo dados inválidos
- [ ] Editor SQL executando consultas complexas
- [ ] Relatórios gerando dados corretos
- [ ] Schema visível com DDL completo
- [ ] Dados reais de conflitos históricos
- [ ] Relacionamentos entre tabelas funcionais
- [ ] Sistema responsivo e estável

## 📊 DADOS IMPLEMENTADOS

- **10 Conflitos:** Afeganistão, Colômbia, Israel/Palestina, Líbano, Nigéria, Espanha, Global, Iraque/Síria, Turquia/Síria
- **10 Grupos Armados:** Taliban, FARC, Hamas, Hezbollah, Boko Haram, ETA, Al Qaeda, ISIS, ELN, PKK
- **10 Organizações:** ONU, Cruz Vermelha, OTAN, Médicos Sem Fronteiras, OEA, UNICEF, etc.
- **Armas e Fornecedores:** Sistema completo de contrabando e fornecimento
- **Divisões Militares:** Estrutura hierárquica com recursos

## 🎓 CRITÉRIOS ACADÊMICOS ATENDIDOS

1. **Modelagem Complexa:** 19 tabelas interrelacionadas
2. **Integridade:** PKs, FKs, constraints, triggers
3. **Funcionalidade:** CRUD completo, consultas avançadas
4. **Interface:** Sistema web profissional
5. **Dados Reais:** Informações históricas autênticas
6. **Análises:** Relatórios e estatísticas
7. **Documentação:** Schema e código visíveis
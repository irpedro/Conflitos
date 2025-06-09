# Sistema de Análise de Conflitos Armados

Sistema acadêmico (Banco de Dados 2) especializado em análise de conflitos armados, fornecendo uma plataforma abrangente para cadastro, relatórios e visualização de dados históricos de confrontos globais.

## Deploy na Nuvem

### Railway
1. Acesseo site do projeto no [railway.app](https://conflict-analysis-app-production.up.railway.app/)

## Configuração do Banco

Após o deploy, execute o comando para criar as tabelas:
```bash
npm run db:push
```

Em seguida, insira os dados de exemplo executando os comandos SQL fornecidos no código.

## Funcionalidades

- Dashboard com estatísticas e gráficos
- Cadastro de conflitos, grupos armados e organizações
- Relatórios detalhados e visualizações
- Sistema de consultas SQL personalizado
- Interface responsiva

## Tecnologias

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express.js + Node.js
- Banco de Dados: PostgreSQL
- ORM: Drizzle
- Gráficos: Recharts

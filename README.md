# Sistema de Análise de Conflitos Armados

Sistema acadêmico especializado em análise de conflitos armados, fornecendo uma plataforma abrangente para cadastro, relatórios e visualização de dados históricos de confrontos globais.

## Deploy na Nuvem

### Railway
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Conecte este repositório
5. Railway detectará automaticamente o Node.js e fará o deploy
6. O banco PostgreSQL será criado automaticamente

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

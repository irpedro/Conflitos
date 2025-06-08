# Guia de Deploy Gratuito - Sistema de Conflitos

## 🚀 Opção 1: Railway (MAIS FÁCIL - Recomendado)

### Passos:
1. **Crie conta no Railway**: Acesse [railway.app](https://railway.app) e faça login com GitHub
2. **Novo Projeto**: Clique em "New Project" → "Deploy from GitHub repo"
3. **Conecte o repositório**: Selecione este projeto
4. **Deploy automático**: Railway detecta automaticamente e faz o deploy
5. **Banco de dados**: Será criado automaticamente
6. **URL**: Você receberá uma URL pública gratuita

### Vantagens:
- ✅ 100% automático
- ✅ Banco PostgreSQL incluído
- ✅ SSL grátis
- ✅ $5 de crédito mensal grátis

---

## 🌟 Opção 2: Render (Alternativa confiável)

### Passos:
1. **Crie conta**: [render.com](https://render.com) → Sign up
2. **Web Service**: "New +" → "Web Service" → conecte GitHub
3. **Configurações**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
4. **Database**: "New +" → "PostgreSQL" (separado)
5. **Conecte**: Copie a DATABASE_URL do banco para o web service

### Vantagens:
- ✅ Interface simples
- ✅ PostgreSQL grátis (90 dias)
- ✅ SSL automático

---

## ⚡ Opção 3: Vercel + Neon DB (Apenas Frontend)

### Para frontend estático:
1. **Deploy frontend**: Push código para GitHub → conecte com Vercel
2. **Database**: Crie banco gratuito no [neon.tech](https://neon.tech)
3. **API**: Use Vercel Functions para API routes

---

## 📋 Após o Deploy

### 1. Configure o banco:
```bash
# Se tiver acesso ao terminal da aplicação
npm run db:push
```

### 2. Insira os dados:
Execute o arquivo `deploy-data.sql` no console do banco de dados

### 3. Teste a aplicação:
- Dashboard deve mostrar gráficos
- Relatórios funcionando
- 20 chefes militares cadastrados

---

## 🎯 Recomendação Final

**Use Railway** - é o mais simples e completamente gratuito para projetos acadêmicos.

1. Push seu código para GitHub
2. Conecte no Railway
3. Aguarde deploy automático
4. Compartilhe a URL com o professor

**Tempo estimado**: 10-15 minutos
#!/bin/bash

# ConflictDB - Script de Deploy Automático

echo "🚀 ConflictDB Deploy Script"
echo "=========================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar se PostgreSQL está disponível
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL não encontrado localmente."
    echo "   Configure DATABASE_URL para usar banco remoto."
fi

echo "📦 Instalando dependências..."
npm install

# Verificar arquivo .env
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOL
# Configure sua string de conexão PostgreSQL
DATABASE_URL=postgresql://usuario:senha@localhost:5432/conflictdb
PGHOST=localhost
PGPORT=5432
PGDATABASE=conflictdb
PGUSER=seu_usuario
PGPASSWORD=sua_senha
NODE_ENV=development
EOL
    echo "✏️  Configure o arquivo .env com suas credenciais PostgreSQL"
    echo "   Em seguida, execute novamente: ./deploy.sh"
    exit 0
fi

echo "🔧 Aplicando schema do banco..."
npm run db:push

echo "📊 Populando dados iniciais..."
echo "   Execute os scripts SQL da pasta attached_assets se necessário"

echo "🏗️  Fazendo build da aplicação..."
npm run build

echo "✅ Setup concluído!"
echo ""
echo "Para executar localmente:"
echo "  npm run dev"
echo ""
echo "Para produção:"
echo "  npm start"
echo ""
echo "Acesse: http://localhost:5000"
#!/bin/bash
# ============================================================
# DOCKER ENTRYPOINT - Inicialização do Backend em Container
# Executa na ordem: DB Init → DB Populate → Start API
# ============================================================

set -e  # Parar se qualquer comando falhar

echo "=========================================="
echo "🚀 INICIANDO BACKEND IMPACTA 2026"
echo "=========================================="

# 1. Aguardar MySQL estar pronto
echo "⏳ Aguardando conexão com MySQL..."
while ! nc -z $DB_HOST $DB_PORT; do
  echo "  MySQL ainda não está pronto. Aguardando..."
  sleep 2
done
echo "✅ MySQL conectado!"

# 2. Aguardar um pouco mais para garantir inicialização completa
sleep 3

# 3. Executar inicialização do banco de dados
echo ""
echo "📦 Inicializando banco de dados..."
node src/initDb.js
if [ $? -eq 0 ]; then
  echo "✅ Banco de dados inicializado!"
else
  echo "❌ Erro ao inicializar banco de dados"
  exit 1
fi

# 4. Executar população de dados
echo ""
echo "🌱 Populando dados iniciais..."
node scripts/populate-db.js
if [ $? -eq 0 ]; then
  echo "✅ Dados iniciais carregados!"
else
  echo "❌ Erro ao popular dados (continuando mesmo assim)"
fi

# 5. Iniciar aplicação
echo ""
echo "=========================================="
echo "🎬 INICIANDO SERVIDOR API"
echo "=========================================="
echo "🌐 Backend rodando em http://$API_HOST:$API_PORT"
echo "📊 Conectado ao MySQL em $DB_HOST:$DB_PORT"
echo "=========================================="
echo ""

# Iniciar a aplicação
exec node src/index.js

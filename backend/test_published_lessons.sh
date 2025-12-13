#!/bin/bash

# 🧪 Script de Testes para API de Publicação de Aulas
# Uso: bash test_published_lessons.sh <token> <volunteer_id>

API_BASE_URL="http://192.168.224.1:8000"
TOKEN="${1:-seu_token_aqui}"
VOLUNTEER_ID="${2:-1}"

echo "🧪 Testando API de Publicação de Aulas"
echo "=================================="
echo "Base URL: $API_BASE_URL"
echo "Token: $TOKEN"
echo "Volunteer ID: $VOLUNTEER_ID"
echo ""

# Teste 1: Listar aulas publicadas
echo "📋 [TESTE 1] Listar aulas do voluntário"
curl -X GET "$API_BASE_URL/published-lessons/?volunteer_id=$VOLUNTEER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Teste 2: Publicar aula simples (sem mídia)
echo "✍️  [TESTE 2] Publicar aula sem mídia"
curl -X POST "$API_BASE_URL/published-lessons/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "volunteer_id=$VOLUNTEER_ID" \
  -F "subject_id=1" \
  -F "title=Aula de Teste" \
  -F "description=Esta é uma aula de teste sem mídia" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Teste 3: Publicar aula com imagem
echo "📸 [TESTE 3] Publicar aula com imagem (ajuste o caminho)"
# Crie um arquivo de teste: echo "fake image" > test_image.jpg
if [ -f "test_image.jpg" ]; then
  curl -X POST "$API_BASE_URL/published-lessons/" \
    -H "Authorization: Bearer $TOKEN" \
    -F "volunteer_id=$VOLUNTEER_ID" \
    -F "subject_id=1" \
    -F "title=Aula com Imagem" \
    -F "description=Aula com uma imagem de teste" \
    -F "media_file=@test_image.jpg" \
    -w "\nHTTP Status: %{http_code}\n\n"
else
  echo "⚠️  Arquivo test_image.jpg não encontrado. Pulando teste."
fi

# Teste 4: Retornar aula específica
echo "🔍 [TESTE 4] Retornar aula específica (ID=1)"
curl -X GET "$API_BASE_URL/published-lessons/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Teste 5: Adicionar like
echo "❤️  [TESTE 5] Adicionar like à aula (ID=1)"
curl -X POST "$API_BASE_URL/published-lessons/1/like" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Teste 6: Atualizar aula
echo "📝 [TESTE 6] Atualizar aula (ID=1)"
curl -X PUT "$API_BASE_URL/published-lessons/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Aula Atualizada\",
    \"description\": \"Descrição atualizada\",
    \"volunteer_id\": $VOLUNTEER_ID
  }" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Teste 7: Filtrar por disciplina
echo "🔎 [TESTE 7] Listar aulas de disciplina específica"
curl -X GET "$API_BASE_URL/published-lessons/?subject_id=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""
echo "=================================="
echo "✅ Testes concluídos!"
echo ""
echo "Nota: Para testes sem autenticação, remova o header Authorization"
echo "Exemplo: curl -X GET '$API_BASE_URL/health'"

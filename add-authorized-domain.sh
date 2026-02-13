#!/bin/bash

# Script para adicionar domínio autorizado no Firebase Authentication via API REST
# Ref: https://firebase.google.com/docs/projects/api/reference/rest/v1beta1/projects.config

set -e

PROJECT_ID="chs-crono-capilar-2026"
DOMAIN="cronocapilar.inoveai.app.br"
API_KEY="AIzaSyDrpEo88GapBfQWQBfAlOnrt-e6wkthK9M"

echo "🔍 Verificando domínios autorizados atuais..."
echo ""

# Obter configuração atual usando identitytoolkit API
# Nota: Esta é uma API pública que retorna configurações básicas
RESPONSE=$(curl -s "https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/config?key=${API_KEY}")

echo "📋 Resposta da API:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "⚠️  Nota: A API REST pública não permite modificar authorized domains."
echo "📝 Você precisa adicionar manualmente via Firebase Console:"
echo ""
echo "1. Acesse: https://console.firebase.google.com/project/${PROJECT_ID}/authentication/settings"
echo "2. Role até 'Authorized domains'"
echo "3. Clique em 'Add domain'"
echo "4. Digite: ${DOMAIN}"
echo "5. Clique em 'Add'"
echo ""
echo "🔗 Link direto: https://console.firebase.google.com/project/${PROJECT_ID}/authentication/settings"

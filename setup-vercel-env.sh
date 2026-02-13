#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel
# Uso: ./setup-vercel-env.sh

set -e

echo "🚀 Configurando variáveis de ambiente no Vercel..."
echo ""

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm i -g vercel
fi

# Login no Vercel (se necessário)
echo "🔐 Verificando autenticação..."
vercel whoami || vercel login

echo ""
echo "📝 Configurando variáveis de ambiente para PRODUCTION..."
echo ""

# Array de variáveis a serem configuradas
declare -A env_vars=(
    ["VITE_FIREBASE_API_KEY"]="AIzaSyDrpEo88GapBfQWQBfAlOnrt-e6wkthK9M"
    ["VITE_FIREBASE_AUTH_DOMAIN"]="chs-crono-capilar-2026.firebaseapp.com"
    ["VITE_FIREBASE_PROJECT_ID"]="chs-crono-capilar-2026"
    ["VITE_FIREBASE_STORAGE_BUCKET"]="chs-crono-capilar-2026.firebasestorage.app"
    ["VITE_FIREBASE_MESSAGING_SENDER_ID"]="945327647639"
    ["VITE_FIREBASE_APP_ID"]="1:945327647639:web:977452fe7b1af41aa472d2"
    ["VITE_USE_EMULATORS"]="false"
    ["VITE_GEMINI_API_KEY"]="AIzaSyA0bibFLrtK4f-MDnxQLDir__MFqQRKRCo"
    ["VITE_APP_DOMAIN"]="cronocapilar.inoveai.app.br"
    ["VITE_COMPANY_EMAIL"]="chs.achat@gmail.com"
    ["VITE_COMPANY_PHONE"]="33617767675"
)

# Configurar cada variável
for key in "${!env_vars[@]}"; do
    value="${env_vars[$key]}"
    echo "⚙️  Configurando $key..."

    # Remover se existir
    vercel env rm "$key" production --yes 2>/dev/null || true

    # Adicionar nova
    echo "$value" | vercel env add "$key" production --yes

    echo "✅ $key configurado"
    echo ""
done

echo ""
echo "✅ Todas as variáveis configuradas!"
echo ""
echo "🔄 Fazendo redeploy..."
vercel --prod

echo ""
echo "🎉 Deploy completo!"
echo ""
echo "🔗 Acesse: https://cronocapilar.inoveai.app.br"
echo ""
echo "✅ Para verificar se funcionou:"
echo "   1. Acesse https://cronocapilar.inoveai.app.br/login"
echo "   2. Clique em 'Conectar com Google'"
echo "   3. NÃO deve redirecionar para localhost:9099"
echo ""

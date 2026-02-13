#!/bin/bash

# Script para corrigir variáveis de ambiente com quebras de linha
set -e

echo "🧹 Removendo variáveis antigas..."

# Remover todas as variáveis existentes
vercel env rm VITE_FIREBASE_API_KEY production 2>/dev/null || true
vercel env rm VITE_FIREBASE_AUTH_DOMAIN production 2>/dev/null || true
vercel env rm VITE_FIREBASE_PROJECT_ID production 2>/dev/null || true
vercel env rm VITE_FIREBASE_STORAGE_BUCKET production 2>/dev/null || true
vercel env rm VITE_FIREBASE_MESSAGING_SENDER_ID production 2>/dev/null || true
vercel env rm VITE_FIREBASE_APP_ID production 2>/dev/null || true
vercel env rm VITE_USE_EMULATORS production 2>/dev/null || true
vercel env rm VITE_GEMINI_API_KEY production 2>/dev/null || true
vercel env rm VITE_APP_DOMAIN production 2>/dev/null || true
vercel env rm VITE_COMPANY_EMAIL production 2>/dev/null || true
vercel env rm VITE_COMPANY_PHONE production 2>/dev/null || true

echo "✅ Variáveis antigas removidas"
echo ""
echo "➕ Adicionando variáveis limpas (sem quebras de linha)..."
echo ""

# Função para adicionar variável sem quebra de linha
add_env() {
    local key="$1"
    local value="$2"

    echo "⚙️  $key"
    printf "%s" "$value" | vercel env add "$key" production
}

# Adicionar todas as variáveis (usando printf para evitar \n)
add_env "VITE_FIREBASE_API_KEY" "AIzaSyDrpEo88GapBfQWQBfAlOnrt-e6wkthK9M"
add_env "VITE_FIREBASE_AUTH_DOMAIN" "chs-crono-capilar-2026.firebaseapp.com"
add_env "VITE_FIREBASE_PROJECT_ID" "chs-crono-capilar-2026"
add_env "VITE_FIREBASE_STORAGE_BUCKET" "chs-crono-capilar-2026.firebasestorage.app"
add_env "VITE_FIREBASE_MESSAGING_SENDER_ID" "945327647639"
add_env "VITE_FIREBASE_APP_ID" "1:945327647639:web:977452fe7b1af41aa472d2"
add_env "VITE_USE_EMULATORS" "false"
add_env "VITE_GEMINI_API_KEY" "AIzaSyA0bibFLrtK4f-MDnxQLDir__MFqQRKRCo"
add_env "VITE_APP_DOMAIN" "cronocapilar.inoveai.app.br"
add_env "VITE_COMPANY_EMAIL" "chs.achat@gmail.com"
add_env "VITE_COMPANY_PHONE" "+33617767675"

echo ""
echo "✅ Todas as variáveis adicionadas sem quebras de linha!"
echo ""
echo "🔄 Fazendo redeploy..."
vercel --prod

echo ""
echo "🎉 Concluído! Aguarde 1-2 minutos e teste novamente."

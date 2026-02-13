#!/bin/bash

# Script para verificar se o deployment está correto
echo "🔍 Verificando deployment..."
echo ""

# Buscar o código JavaScript do bundle
echo "📦 Verificando se VITE_USE_EMULATORS está no bundle..."
curl -s https://cronocapilar.inoveai.app.br/ | grep -o "VITE_USE_EMULATORS" || echo "✅ Variável não exposta no bundle (correto)"

echo ""
echo "🔧 Verificando configuração Firebase no JavaScript..."
curl -s https://cronocapilar.inoveai.app.br/assets/index-*.js 2>/dev/null | grep -o "localhost:9099" && echo "❌ PROBLEMA: Código ainda tem referência ao emulador!" || echo "✅ Nenhuma referência ao emulador encontrada"

echo ""
echo "🌐 Verificando Auth Domain..."
curl -s https://cronocapilar.inoveai.app.br/assets/index-*.js 2>/dev/null | grep -o "chs-crono-capilar-2026.firebaseapp.com" && echo "✅ Auth Domain correto" || echo "⚠️  Auth Domain não encontrado"

echo ""
echo "✅ Verificação completa!"

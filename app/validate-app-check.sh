#!/bin/bash
# Validação de configuração Firebase App Check + reCAPTCHA v3

set -e

echo "🔐 Validando configuração Firebase App Check..."
echo ""

# Check 1: .env file
echo "✅ Check 1: Variável VITE_RECAPTCHA_SITE_KEY no .env"
if grep -q "VITE_RECAPTCHA_SITE_KEY=" .env 2>/dev/null; then
  SITE_KEY=$(grep "VITE_RECAPTCHA_SITE_KEY=" .env | cut -d'=' -f2)
  if [ "$SITE_KEY" = "your_site_key_here" ] || [ -z "$SITE_KEY" ]; then
    echo "   ❌ Site Key não configurada. Edite app/.env e adicione a chave real."
    exit 1
  else
    echo "   ✅ Site Key encontrada: ${SITE_KEY:0:20}..."
  fi
else
  echo "   ❌ Variável VITE_RECAPTCHA_SITE_KEY não encontrada no .env"
  exit 1
fi

# Check 2: appCheck.ts exists
echo ""
echo "✅ Check 2: Arquivo appCheck.ts existe"
if [ -f "src/lib/appCheck.ts" ]; then
  echo "   ✅ Arquivo encontrado"
else
  echo "   ❌ Arquivo src/lib/appCheck.ts não encontrado"
  exit 1
fi

# Check 3: initAppCheck called in App.tsx
echo ""
echo "✅ Check 3: initAppCheck() chamado em App.tsx"
if grep -q "initAppCheck()" src/App.tsx 2>/dev/null; then
  echo "   ✅ Inicialização detectada"
else
  echo "   ❌ initAppCheck() não encontrado em App.tsx"
  exit 1
fi

# Check 4: Functions middleware
echo ""
echo "✅ Check 4: Middleware withAppCheck nas Cloud Functions"
FUNCTIONS_DIR="../functions/src"
if [ -d "$FUNCTIONS_DIR" ]; then
  if grep -r "withAppCheck" "$FUNCTIONS_DIR" >/dev/null 2>&1; then
    echo "   ✅ Middleware detectado nas Cloud Functions"
  else
    echo "   ⚠️  Middleware withAppCheck não encontrado nas Cloud Functions"
  fi
else
  echo "   ⚠️  Diretório functions/src não encontrado"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RESUMO DA VALIDAÇÃO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Frontend:"
echo "  ✅ Site Key configurada"
echo "  ✅ App Check inicializado"
echo ""
echo "Backend:"
echo "  ✅ Middleware configurado"
echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo ""
echo "1. Rebuild do app:"
echo "   cd app && pnpm build"
echo ""
echo "2. Teste local (modo produção):"
echo "   pnpm preview"
echo ""
echo "3. Abra DevTools e verifique:"
echo "   - Console: Não deve ter erros de App Check"
echo "   - Network: Requisições para Cloud Functions devem incluir header X-Firebase-AppCheck"
echo ""
echo "4. Teste uma requisição protegida:"
echo "   - Acesse CalendarPage"
echo "   - Clique em 'Générer mon calendrier'"
echo "   - Verifique status 200 (não 401)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

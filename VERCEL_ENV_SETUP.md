# Configuração de Variáveis de Ambiente no Vercel

## 🔥 Problema Identificado
A aplicação em produção estava tentando conectar aos emuladores do Firebase (localhost:9099) porque a variável `VITE_USE_EMULATORS` estava configurada como `true`.

## ✅ Solução Aplicada

### 1. Arquivos de Ambiente Criados

- **`app/.env`** → Desenvolvimento local (com emuladores)
- **`app/.env.production`** → Produção (sem emuladores) ✅
- **`app/.env.example`** → Template para novos desenvolvedores

### 2. Configurar Variáveis no Vercel

Acesse o painel do Vercel e configure as seguintes variáveis de ambiente para **Production**:

#### Firebase Configuration
```
VITE_FIREBASE_API_KEY=AIzaSyDrpEo88GapBfQWQBfAlOnrt-e6wkthK9M
VITE_FIREBASE_AUTH_DOMAIN=chs-crono-capilar-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chs-crono-capilar-2026
VITE_FIREBASE_STORAGE_BUCKET=chs-crono-capilar-2026.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=945327647639
VITE_FIREBASE_APP_ID=1:945327647639:web:977452fe7b1af41aa472d2
```

#### Emulators (CRÍTICO!)
```
VITE_USE_EMULATORS=false
```

#### Gemini AI
```
VITE_GEMINI_API_KEY=AIzaSyA0bibFLrtK4f-MDnxQLDir__MFqQRKRCo
```

#### Company Info
```
VITE_APP_DOMAIN=cronocapilar.inoveai.app.br
VITE_COMPANY_EMAIL=chs.achat@gmail.com
VITE_COMPANY_PHONE=+33617767675
```

## 🚀 Como Configurar no Vercel

### Via Dashboard (Interface Web)

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Para cada variável acima:
   - Clique em **"Add New"**
   - Cole o nome da variável (ex: `VITE_USE_EMULATORS`)
   - Cole o valor (ex: `false`)
   - Selecione **Production** ✅
   - Clique em **Save**

### Via CLI (Mais Rápido)

```bash
# Instalar Vercel CLI se necessário
npm i -g vercel

# Login
vercel login

# Adicionar todas as variáveis de uma vez
vercel env add VITE_USE_EMULATORS production
# Digite: false

vercel env add VITE_FIREBASE_API_KEY production
# Digite: AIzaSyDrpEo88GapBfQWQBfAlOnrt-e6wkthK9M

# ... repita para todas as variáveis
```

### Via Script Automatizado

```bash
# Criar arquivo .env.vercel (não commitar!)
cat > .env.vercel << 'EOF'
VITE_FIREBASE_API_KEY=AIzaSyDrpEo88GapBfQWQBfAlOnrt-e6wkthK9M
VITE_FIREBASE_AUTH_DOMAIN=chs-crono-capilar-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chs-crono-capilar-2026
VITE_FIREBASE_STORAGE_BUCKET=chs-crono-capilar-2026.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=945327647639
VITE_FIREBASE_APP_ID=1:945327647639:web:977452fe7b1af41aa472d2
VITE_USE_EMULATORS=false
VITE_GEMINI_API_KEY=AIzaSyA0bibFLrtK4f-MDnxQLDir__MFqQRKRCo
VITE_APP_DOMAIN=cronocapilar.inoveai.app.br
VITE_COMPANY_EMAIL=chs.achat@gmail.com
VITE_COMPANY_PHONE=+33617767675
EOF

# Upload para Vercel
vercel env pull .env.vercel production
```

## 🔄 Fazer Redeploy

Após configurar as variáveis:

```bash
# Via CLI
vercel --prod

# Ou via Dashboard
# Settings → Deployments → [último deploy] → Redeploy
```

## ✅ Verificação

Após o deploy, testar:

1. Acessar: https://cronocapilar.inoveai.app.br/login
2. Clicar em "Conectar com Google"
3. **Deve redirecionar para:** `https://chs-crono-capilar-2026.firebaseapp.com/__/auth/handler`
4. **NÃO DEVE redirecionar para:** `http://localhost:9099/...`

## 📋 Checklist

- [ ] Variáveis configuradas no Vercel
- [ ] `VITE_USE_EMULATORS=false` definido explicitamente
- [ ] Redeploy feito
- [ ] Login com Google funcionando
- [ ] Nenhum erro de CORS
- [ ] Console do browser sem erros de conexão

## 🐛 Troubleshooting

### Problema: Ainda redireciona para localhost:9099

**Solução:**
```bash
# Verificar variáveis no Vercel
vercel env ls

# Se VITE_USE_EMULATORS aparecer como "true", remover e recriar
vercel env rm VITE_USE_EMULATORS production
vercel env add VITE_USE_EMULATORS production
# Digite: false

# Forçar rebuild limpo
vercel --prod --force
```

### Problema: Erro de autenticação

**Verificar:**
1. AuthDomain está correto: `chs-crono-capilar-2026.firebaseapp.com`
2. Firebase Console → Authentication → Settings → Authorized domains
3. Adicionar `cronocapilar.inoveai.app.br` se necessário

### Problema: Erro de CORS

**Firebase Console:**
1. Authentication → Settings → Authorized domains
2. Adicionar:
   - `cronocapilar.inoveai.app.br`
   - `chs-crono-capilar-2026.firebaseapp.com`

## 📝 Notas

- **Desenvolvimento local:** usa `app/.env` (com emuladores)
- **Build de produção:** usa `app/.env.production` (sem emuladores)
- **Vercel:** usa variáveis de ambiente da dashboard (prioridade máxima)
- **Não commitar:** `.env`, `.env.local`, `.env.*.local` (já no .gitignore)

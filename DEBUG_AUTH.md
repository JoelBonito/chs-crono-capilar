# 🔍 Debug - Erro Silencioso no Login Google

## 1. Verificar Console do Browser (F12)

### Aba Console
- Procure por **qualquer** mensagem (mesmo warnings)
- Procure por erros vermelhos
- Copie e cole aqui tudo que aparecer

### Aba Network
1. Limpe o log (ícone 🚫)
2. Clique em "Connecter avec Google"
3. Procure por requisições **vermelhas** (Status 4xx ou 5xx)
4. Clique nelas e veja a resposta

**Possíveis erros:**
- `auth/unauthorized-domain` - Domínio não autorizado
- `auth/popup-blocked` - Popup bloqueado
- CORS error - Problema de domínio cruzado

---

## 2. Verificar Configuração Firebase

### Firebase Console → Authentication → Settings → Authorized Domains

**Devem estar autorizados:**
- ✅ `cronocapilar.inoveai.app.br`
- ✅ `chs-crono-capilar-2026.firebaseapp.com`
- ✅ `localhost` (para dev)

**Como verificar:**
1. https://console.firebase.google.com/project/chs-crono-capilar-2026/authentication/settings
2. Role até "Authorized domains"
3. Confirme se o domínio `cronocapilar.inoveai.app.br` está na lista

---

## 3. Verificar Provider Google

### Firebase Console → Authentication → Sign-in method

**Google deve estar:**
- ✅ Enabled (habilitado)
- ✅ Com email configurado

---

## 4. Testar Localmente com Emuladores

Vamos verificar se funciona localmente primeiro:

```bash
cd app
pnpm dev
```

Então:
1. Abra http://localhost:5173/login
2. Clique em "Connecter avec Google"
3. Funciona localmente com emuladores?

---

## 5. Logs do Firebase

Veja se há logs de erro no Firebase:

https://console.firebase.google.com/project/chs-crono-capilar-2026/usage

---

## 6. Verificar se Popup está sendo bloqueado

Alguns browsers bloqueiam popups por padrão.

**Teste:**
- Há um ícone de popup bloqueado na barra de endereço? 🚫
- Se sim, clique e permita popups

---

## 7. Verificar código do componente de login

Se nada acima funcionar, vamos olhar o código.

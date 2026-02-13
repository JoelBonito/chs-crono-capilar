# 🔐 Guia Rápido: Autorizar Domínio no Firebase

## ⏱️ Tempo estimado: 2 minutos

---

## 🎯 O que você precisa fazer:

Adicionar `cronocapilar.inoveai.app.br` aos domínios autorizados no Firebase.

---

## 📋 Passo a Passo (COM SCREENSHOTS ESPERADOS):

### **PASSO 1: Abrir Link**
Clique aqui: [**Abrir Firebase Console → Authentication Settings**](https://console.firebase.google.com/project/chs-crono-capilar-2026/authentication/settings)

**O que você verá:**
- Página de configurações de Authentication
- Vários tabs no topo (Sign-in method, Users, Templates, Usage, Settings)

---

### **PASSO 2: Ir até "Authorized domains"**
- **Role a página para baixo**
- Procure pela seção **"Authorized domains"**

**O que você verá:**
- Uma lista de domínios já autorizados
- Provavelmente verá:
  - ✅ `localhost`
  - ✅ `chs-crono-capilar-2026.firebaseapp.com`
  - ❌ `cronocapilar.inoveai.app.br` (FALTANDO - é esse que vamos adicionar!)

---

### **PASSO 3: Adicionar o Domínio**
1. Clique no botão **"Add domain"** (azul, no canto superior direito da seção)
2. Um modal/popup vai aparecer
3. Digite exatamente: `cronocapilar.inoveai.app.br`
4. Clique em **"Add"**

**Copie e cole:**
```
cronocapilar.inoveai.app.br
```

---

### **PASSO 4: Confirmar**
Após adicionar, você verá:
- ✅ `localhost`
- ✅ `chs-crono-capilar-2026.firebaseapp.com`
- ✅ `cronocapilar.inoveai.app.br` ← **NOVO!**

---

## ✅ Verificação Imediata

Após adicionar (aguarde 30 segundos):

1. **Abra uma aba anônima** (Ctrl+Shift+N)
2. **Acesse:** https://cronocapilar.inoveai.app.br/login
3. **Abra DevTools** (F12) → Aba Console
4. **Clique em** "Continuer avec Google"

**Resultado esperado:**
```
[Login] Google button clicked
[Login] Calling signInWithGoogle...
[Auth] Starting Google sign-in...
[Auth] Opening popup...
[Auth] Popup successful ✅
```

**NÃO DEVE** aparecer:
- ❌ `auth/unauthorized-domain`
- ❌ Mensagem sobre domínio não autorizado

---

## 🆘 Se não encontrar a seção "Authorized domains":

1. Verifique se está na aba **"Settings"** (última aba)
2. Role a página inteira (pode estar no final)
3. Procure por texto "Authorized domains" ou "Domínios autorizados"

---

## 📸 Referência Visual (Como deve ficar):

```
┌─────────────────────────────────────────┐
│  Authorized domains                     │
│                                         │
│  ✅ localhost                           │
│  ✅ chs-crono-capilar-2026...          │
│  ✅ cronocapilar.inoveai.app.br  ← NOVO│
│                                         │
│  [Add domain]                           │
└─────────────────────────────────────────┘
```

---

## 🔗 Links Úteis:

- **Firebase Console:** https://console.firebase.google.com/project/chs-crono-capilar-2026/authentication/settings
- **Documentação:** https://firebase.google.com/docs/auth/web/redirect-best-practices#setup-authorized-domains

---

## ⚡ Depois de adicionar:

Volte aqui e me confirme que adicionou. Vou então te pedir para testar novamente!

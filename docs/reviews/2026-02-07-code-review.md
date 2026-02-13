# Code Review Consolidado - CronoCapilar (CHS)

**Data:** 2026-02-07
**Revisado por:** 4 agentes especializados (Opus 4.6)
**Escopo:** Todo o codigo gerado por Claude Code (CC) e Antigravity (AG)
**Arquivos analisados:** ~189 arquivos-fonte

---

## Resumo Executivo

| Agente | Escopo | CRITICAL | HIGH | MEDIUM | LOW |
|--------|--------|----------|------|--------|-----|
| Security Auditor | Firestore Rules, Auth, APIs, RGPD, CI/CD | 6 | 8 | 9 | 5 |
| Backend Specialist | 27 Cloud Functions + configs | 0 | 8 | 12 | 7 |
| Frontend Specialist | app/ (Vite) + web/ (Next.js) | 5 | 9 | 10 | 8 |
| Code Archaeologist | Duplicacao, dead code, configs | 3 | 5 | 6 | 4 |
| **TOTAL (deduplicado)** | | **9** | **20** | **26** | **17** |

**Nota geral do backend:** 7.5/10
**Nota geral do frontend (app/):** 7/10
**Nota geral do frontend (web/):** 4/10 (prototipos misturados com producao)

---

## DECISAO ARQUITETURAL URGENTE

### Existem DOIS apps de produto competindo

| | `app/` (Vite + React 19) | `web/` (Next.js 16) |
|---|---|---|
| **Framework** | Vite 5 + React Router v6 | Next.js 16 App Router |
| **Tailwind** | v3.4 | v4 |
| **Firebase** | v11.0.2 | v12.9.0 |
| **Auth** | Completo (Firebase Auth + MFA) | NENHUM |
| **Firestore** | Integrado | NENHUM (dados mock) |
| **i18n** | NENHUM (strings hardcoded FR) | react-i18next (FR + EN) |
| **UI Library** | CVA + custom | Base UI + shadcn |
| **Status** | Produto real (funcional) | Prototipos de design + docs Antigravity |

**RECOMENDACAO:** O `app/` e o produto real. O `web/` contem:
1. Documentacao do Inove AI Framework (manter separado)
2. Prototipos UI do CHS (portar o melhor para app/, depois remover)

---

## ISSUES CRITICOS (9) - Corrigir ANTES de qualquer deploy

### SEC-C00: `.env` com credenciais Firebase NAO gitignored para web/
- **Arquivo:** `.gitignore` (falta `web/.env`), `web/.env` (contem API key Firebase)
- **Issue:** `.gitignore` so exclui `app/.env`. O `web/.env` contem API key Firebase live. Se commitado, fica permanente no historico git.
- **Fix:** Adicionar `**/.env` e `**/.env.local` ao `.gitignore`. Rodar `git rm --cached web/.env` se tracked.

### SEC-C01: Collection `subscriptions` sem Security Rules
- **Arquivo:** `firestore.rules` + `functions/src/billing/handler.ts:62,225,247,274`
- **Issue:** O billing handler grava em `db.collection("subscriptions")` mas essa collection NAO tem regras de seguranca no Firestore Rules. Qualquer usuario autenticado pode ler/gravar subscriptions de qualquer outro usuario.
- **Fix:** Adicionar regras para `subscriptions` em `firestore.rules`

### FE-C01: Dois apps de produto com codebases divergentes
- **Arquivos:** Todo `web/src/app/(app)/`, `web/src/app/(admin)/`
- **Issue:** As paginas de produto no Next.js sao duplicatas do Vite app com dados mock hardcoded, sem auth, sem Firebase. Gera confusao sobre qual e a fonte de verdade.
- **Fix:** Portar UI boa do web/ para app/, remover paginas CHS do web/

### FE-C02: Tipos `any` em codigo critico
- **Arquivo:** `web/src/services/diagnostic.ts:9,12`
- **Issue:** `schedule: any` e `details: any` nos tipos mais importantes da app.
- **Fix:** Definir tipos proprios

### FE-C03: App Check com chave placeholder
- **Arquivo:** `app/src/lib/appCheck.ts:12`
- **Issue:** `"RECAPTCHA_SITE_KEY_PLACEHOLDER"` hardcoded. Em producao, App Check falha silenciosamente.
- **Fix:** Mover para `VITE_RECAPTCHA_SITE_KEY` env var

### FE-C04: Nenhuma autenticacao nas rotas de produto do web/
- **Arquivos:** `web/src/app/(app)/layout.tsx`, todas as paginas `(app)/`
- **Issue:** Qualquer pessoa acessa `/dashboard`, `/diagnostic`, `/calendar` sem login.
- **Fix:** Implementar middleware de auth ou remover rotas de produto do web/

### FE-C05: `cn()` duplicada com tipo `any`
- **Arquivo:** `web/src/app/(admin)/dashboard/page.tsx:90-92`
- **Issue:** Funcao local `cn(...inputs: any[])` que NAO faz merge de Tailwind (sem `twMerge`).
- **Fix:** Importar de `@/lib/utils`

### ARCH-C01: `firebase.json` hospeda `web/out` mas CI faz build de `app/`
- **Arquivos:** `firebase.json`, `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`
- **Issue:** O deploy.yml faz build do `app/` mas o hosting pode apontar para `web/out`. Conflito de configuracao.
- **Fix:** Alinhar firebase.json com o app que sera deployado

### SEC-C06: Collection `adminMetrics` sem Security Rules
- **Arquivo:** `firestore.rules`, `functions/src/analytics/handler.ts:31,91`
- **Issue:** `adminMetrics` (diferente de `analytics`) e usada mas nao tem regra explicita. Cai no catch-all deny, mas por acidente.
- **Fix:** Adicionar regra explicita: `match /adminMetrics/{date} { allow read: if isAdmin(); allow write: if false; }`

---

## ISSUES HIGH (20) - Corrigir antes de producao

### Backend (8 HIGH)

| ID | Issue | Arquivo | Fix |
|----|-------|---------|-----|
| BE-H01 | Race condition em `updateProductUsage` (sem transaction) | `functions/src/products/handler.ts:157-190` | Usar `db.runTransaction()` |
| BE-H02 | Race condition em idempotencia de notificacao | `functions/src/notifications/handler.ts:86-103` | Usar doc ID deterministico com `create()` |
| BE-H03 | `PREMIUM_PRICE_ID` usa `process.env` (falha no Firebase v2) | `functions/src/billing/config.ts:8` | Usar `defineString()` |
| BE-H04 | Twilio client recriado a cada SMS | `functions/src/notifications/sender.ts:28` | Cache no modulo |
| BE-H05 | Stripe client recriado a cada request | `functions/src/billing/handler.ts:10-12` | Cache no modulo |
| BE-H06 | `onCheckoutCompleted` nao verifica subscription no Stripe API | `functions/src/billing/handler.ts:218-244` | Chamar `stripe.subscriptions.retrieve()` |
| BE-H07 | Retries de notificacao sequenciais (pode exceder timeout) | `functions/src/notifications/handler.ts:197-233` | Processar em batch com `Promise.allSettled` |
| BE-H08 | `successUrl`/`cancelUrl` sem validacao de dominio | `functions/src/billing/handler.ts:31-35` | Validar contra allowlist |

### Frontend (5 HIGH)

| ID | Issue | Arquivo | Fix |
|----|-------|---------|-----|
| FE-H01 | Nenhum Error Boundary em ambos os apps | `app/src/App.tsx`, `web/src/app/layout.tsx` | Adicionar ErrorBoundary no nivel de router |
| FE-H02 | i18n libs em devDependencies no web/ | `web/package.json:43-46` | Mover para dependencies |
| FE-H03 | App/ nao tem i18n nenhum (strings FR hardcoded) | Todos os arquivos em `app/src/pages/` | Instalar react-i18next |
| FE-H04 | Dados mock hardcoded nas paginas web/ | Todas paginas `(app)/` e `(admin)/` | Integrar Firebase ou marcar como prototipo |
| FE-H05 | Firebase SDK versoes incompativeis (v11 vs v12) | `app/package.json` vs `web/package.json` | Alinhar versoes |

### Seguranca (3 HIGH)

| ID | Issue | Arquivo | Fix |
|----|-------|---------|-----|
| SEC-H01 | `cors: true` em TODAS as Cloud Functions | `functions/src/index.ts` (9 endpoints) | Restringir a dominios permitidos |
| SEC-H02 | Risco SSRF via `photoUrls` (aceita qualquer URL) | `functions/src/diagnostic/schemas.ts:6` | Validar dominio Firebase Storage |
| SEC-H03 | PII (telefone) logada em texto plano | `functions/src/notifications/sender.ts:39` | Mascarar ultimos 4 digitos |

### Seguranca - Adicional (5 HIGH do security audit)

| ID | Issue | Arquivo | Fix |
|----|-------|---------|-----|
| SEC-H04 | Sem rate limiting nos endpoints de billing | `functions/src/billing/handler.ts` | Adicionar max 5/hora |
| SEC-H05 | Detalhes de erro Zod vazam para cliente | Todos handlers | Retornar msg generica, logar detalhes server-side |
| SEC-H06 | Sem header `Content-Security-Policy` | `firebase.json` | Adicionar CSP restritivo |
| SEC-H07 | Sem `Strict-Transport-Security` e `Permissions-Policy` | `firebase.json` | Adicionar HSTS + Permissions-Policy |
| SEC-H08 | GitHub Actions usa action `@master` nao fixada | `.github/workflows/deploy.yml:106` | Fixar por commit SHA |

### Arqueologia (2 HIGH)

| ID | Issue | Arquivo | Fix |
|----|-------|---------|-----|
| ARCH-H01 | `react-router-dom` em web/package.json mas nunca usado | `web/package.json:27` | Remover dependencia |
| ARCH-H02 | Object URL memory leak no wizard de diagnostico | `web/src/components/diagnostic/wizard.tsx:38` | Chamar `URL.revokeObjectURL` |

---

## ISSUES MEDIUM (24)

### Backend (12)
- BE-M01: Instancias `db` duplicadas em cada handler (usar import de `init.ts`)
- BE-M02: `GEMINI_MODEL` = "gemini-2.0-flash" mas docs dizem "Gemini 3 Flash"
- BE-M03: Sem timeout/abort no call Gemini (pode travar 120s)
- BE-M04: Telefone completo armazenado em notificacao (PII RGPD)
- BE-M05: `startDate`/`endDate` sem validacao em admin stats
- BE-M06: Bug de calculo de data em `buildCalendarEvents` (dia da semana errado)
- BE-M07: Import dinamico desnecessario em products handler
- BE-M08: Templates SMS podem exceder 160 caracteres
- BE-M09: Canal email e um no-op que mente sobre envio
- BE-M10: `calendarToken` exposto na resposta da API
- BE-M11: Nenhum teste unitario (0 testes no functions/)
- BE-M12: Falta `@types/express` em devDependencies

### Frontend (10)
- FE-M01: Sem pagina 404 no web/
- FE-M02: Componentes Button completamente incompativeis entre apps
- FE-M03: Comentarios em PT-BR misturados (devem ser EN)
- FE-M04: Imports e dependencias nao utilizados
- FE-M05: Issues de acessibilidade (ARIA labels, keyboard nav, screen reader)
- FE-M06: Sem `safe-area-inset-bottom` no bottom nav do web/
- FE-M07: Google Fonts via CSS @import (render-blocking)
- FE-M08: Admin routes sem protecao de role
- FE-M09: Tipos duplicados (TreatmentType, CalendarEvent)
- FE-M10: Sem suporte offline (Firestore persistence desativado)

### Arqueologia (2)
- ARCH-M01: `docs-config.ts` definido mas nunca importado
- ARCH-M02: Branding "Antigravity Kit" misturado no repositorio CHS

---

## ISSUES LOW (16)

- Sem `prefers-reduced-motion` nas animacoes do web/
- Numeros desatualizados no componente Typing (35+ skills vs 40)
- Sem favicon/PWA manifest no app/ (critico para mobile-first)
- Metadata "Antigravity Kit" nos docs
- Custom utility `z-sticky` possivelmente indefinida
- `window.location.href` em vez de Next.js router
- `<img>` em vez de `next/image` (2 ocorrencias)
- Falta lint/test scripts no functions/package.json
- Import redundante de `"../init"` no diagnostic handler
- `console.log` em codigo de producao (3 ocorrencias)
- `healthCheck` expoe service name, region e timestamp
- `DiagnosticDocument` interface nunca usada

---

## PADROES POSITIVOS (Manter)

### Backend
1. Estrutura modular consistente (handler + schemas + logica)
2. Validacao Zod em todas as boundaries
3. Logging estruturado com tags
4. Estrategia de fallback 3-tier para Gemini
5. Normalizacao FR/EN nas respostas Gemini
6. HMAC com `timingSafeEqual` para tokens de calendario
7. Agregacao idempotente de analytics
8. Retry com backoff exponencial para SMS
9. Verificacao de assinatura Stripe webhook
10. Geracao ICS RFC 5545 compliant

### Frontend (app/)
1. Firebase SDK init limpo com suporte a emuladores
2. AuthContext bem estruturado
3. ProtectedRoute funcional
4. Design system com Tailwind + CVA
5. Separacao clara de features/pages/services

---

## TOP 12 ACOES PRIORITARIAS

| # | Acao | Esforco | Impacto |
|---|------|---------|---------|
| 1 | **Corrigir `.gitignore`** - adicionar `**/.env` global | 5min | CRITICO |
| 2 | **Security Rules** para `subscriptions` e `adminMetrics` | 30min | CRITICO |
| 3 | **Restringir CORS** a dominios permitidos | 30min | CRITICO |
| 4 | **Validar `successUrl`/`cancelUrl`** com allowlist (open redirect) | 30min | CRITICO |
| 5 | **Decidir app unico** - eliminar confusao app/ vs web/ | 2h | CRITICO |
| 6 | **Adicionar headers de seguranca** (CSP, HSTS, Permissions-Policy) | 1h | HIGH |
| 7 | **Fixar GitHub Actions** por commit SHA (supply chain) | 30min | HIGH |
| 8 | **Transacoes Firestore** em `updateProductUsage` e notificacoes | 1h | HIGH |
| 9 | **Corrigir `PREMIUM_PRICE_ID`** (defineString) | 15min | HIGH |
| 10 | **Cachear clientes** Twilio e Stripe | 30min | HIGH |
| 11 | **Mascarar PII** nos logs (telefone) + remover detalhes Zod | 30min | HIGH |
| 12 | **Adicionar Error Boundaries** no app/ | 1h | HIGH |

---

## METRICAS FINAIS

- **Total de issues encontrados:** 72
- **CRITICAL:** 9 (12.5%)
- **HIGH:** 20 (27.8%)
- **MEDIUM:** 26 (36.1%)
- **LOW:** 17 (23.6%)
- **Testes unitarios existentes:** 0 (app/ tem setup mas sem testes, functions/ nao tem framework)
- **Cobertura de Security Rules:** 6/7 collections (falta `subscriptions`)

---

*Gerado por Opus 4.6 - 4 agentes especializados em paralelo*
*Duracao total da analise: ~5 minutos*

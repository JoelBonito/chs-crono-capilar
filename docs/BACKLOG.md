# Backlog do Produto: CronoCapilar (CHS)

> **FONTE CANONICA:** [`docs/01-Planejamento/08-backlog.md`](01-Planejamento/08-backlog.md)
>
> Este arquivo e um resumo de referencia rapida. O backlog detalhado com regras de governanca,
> status de sprints, GAP analysis e grafo de dependencias esta no documento canonico acima.
> **Sempre atualize o documento canonico primeiro.**

**Ultima Atualizacao:** 2026-02-13
**Status Geral:** 8 Epics | 25 Stories | 19 Concluidas (76%) | 2 Deferred (pos-MVP)
**Agente Responsavel:** `@product-owner`

> **NOTA (2026-02-13):** Backlog corrigido apos auditoria. O script `finish_task.py` havia
> marcado todas as stories como completas sem verificar a existencia de frontend funcional.
> Criterio de conclusao: feature usavel end-to-end pelo usuario final.

---

## EPICS & STORIES (Resumo)

### Epic 1: Infraestrutura & Localizacao (P0) [OWNER: devops-engineer] [TOOL: CC]
- [x] **Story 1.1:** Setup Vite + React 19 + Tailwind CSS + Design Tokens.
- [x] **Story 1.2:** Configuracao Firebase em `europe-west1` (RGPD).
- [x] **Story 1.3:** Setup i18next (Frances/Portugues BR).
- [x] **Story 1.4:** CI/CD Pipeline (Vercel + GitHub).

### Epic 2: Autenticacao & Perfil (P0) [OWNER: backend-specialist] [TOOL: CC/AG]
- [x] **Story 2.1:** Fluxo Auth Firebase (Google/E-mail).
- [x] **Story 2.2:** Profile Schema no Firestore.
- [x] **Story 2.3:** Consentimento SMS (Opt-in RGPD).

### Epic 3: Modulo de Diagnostico IA (P0) [OWNER: backend-specialist] [TOOL: CC/AG]
- [x] **Story 3.1:** Upload de Fotos para Storage.
- [x] **Story 3.2:** Integracao Gemini 3 Flash via Cloud Function (Vertex AI).
- [x] **Story 3.3:** Parser de Diagnosticos (JSON Output).
- [x] **Story 3.4:** UI Wizard de Diagnostico.

### Epic 4: Cronograma Capilar Inteligente (P0) [OWNER: frontend-specialist] [TOOL: AG/CC]
- [x] **Story 4.1:** Gerador de Ciclo H/N/R (4 semanas).
- [x] **Story 4.2:** Dashboard de Tratamentos (Agenda/CalendarPage).
- [x] **Story 4.3:** Sync com Google Calendar (.ics).

### Epic 5: Engine de Notificacao & Recompra (P1) [OWNER: backend-specialist] [TOOL: CC]
- [ ] **Story 5.1:** Calculo de Consumo de Produtos. ⚠️ _Backend pronto (`functions/src/products/`), sem UI frontend._
- [x] **Story 5.2:** Integracao Twilio SMS (+33). _Backend envia SMS, toggle opt-in funciona no Settings._
- [ ] **Story 5.3:** Tracking de Redirecionamento (Bit.ly). ⚠️ _Backend pronto, sem UI de tracking/analytics._

### Epic 6: Dashboard Admin (P2) [OWNER: frontend-specialist] [TOOL: AG]
- [ ] **Story 6.1:** Metricas de Conversao/Retencao. ⚠️ _Backend analytics pronto (`functions/src/analytics/`), zero UI admin._
- [ ] **Story 6.2:** Cron Jobs de Agregacao de Dados. ⚠️ _Backend pronto, sem dashboard para visualizar._

### Epic 7: Refinamento & UX da IA (P1) [OWNER: backend-specialist] [TOOL: CC]
- [x] **Story 7.1:** Prompt Engineering.
- [x] **Story 7.2:** Feedback Visual e Loading.
- [x] **Story 7.3:** Fallbacks Robustos.

### Epic 8: Monetizacao & Checkout (P0 backend / Post-MVP frontend) [OWNER: backend-specialist] [TOOL: CC]
> **Decisao MVP (2026-02-13):** Frontend de billing adiado para pos-MVP. Backend pronto, zero UI no MVP.

- [x] **Story 8.1:** Integracao Stripe (Backend). _Cloud Functions prontas: checkout, portal, webhook._
- [ ] **Story 8.2:** Paywall e Freemium. ⏸️ _**Deferred** — adiado para pos-MVP._
- [ ] **Story 8.3:** Pagina de Upgrade. ⏸️ _**Deferred** — adiado para pos-MVP._

---

## Progresso do Projeto

| Epic | Stories | Concluidas | Status |
|------|---------|------------|--------|
| **1. Infra & Localizacao** | 4 | 4 | 100% Concluido |
| **2. Auth & Perfil** | 3 | 3 | 100% Concluido |
| **3. Diagnostico IA** | 4 | 4 | 100% Concluido |
| **4. Cronograma** | 3 | 3 | 100% Concluido |
| **5. Notificacoes** | 3 | 1 | 33% — Backend pronto, falta UI |
| **6. Dashboard Admin** | 2 | 0 | 0% — Backend pronto, zero UI |
| **7. Refinamento & UX IA** | 3 | 3 | 100% Concluido |
| **8. Monetizacao & Checkout** | 3 | 1 | 33% — Backend Done, frontend Deferred (pos-MVP) |
| **TOTAL** | **25** | **19** | **76%** (+ 2 Deferred) |

---

## Notas de Auditoria (2026-02-13)

### Backend vs Frontend
- **Backend (functions/):** ~95% completo — 37 Cloud Functions implementadas cobrindo 8 epics
- **Frontend (app/):** ~55% completo — 8 paginas funcionais, 3 modulos sem UI
- **Integracao E2E:** ~40% — Diagnostic + Schedule + Calendar integrados, Stripe/Admin/Produtos nao

### O Que Falta para MVP
1. **Epic 5 (P1):** UI de consumo de produtos, centro de notificacoes
2. **Epic 6 (P2):** Dashboard admin completo com metricas

### Adiado para Pos-MVP
- **Epic 8 — Stories 8.2, 8.3:** Frontend de billing (paywall, pagina de upgrade) — decisao de produto 2026-02-13

### Paginas Funcionais no Frontend
| Pagina | Status |
|--------|--------|
| Login | Funcional |
| Signup | Funcional |
| ProfileSetup | Funcional |
| Diagnostic | Funcional (fluxo adaptativo, 6-11 perguntas) |
| CalendarPage | Funcional (melhor pagina, .ics export) |
| Dashboard | Parcial (saudacao + card diagnostico + proximo tratamento) |
| Settings | Parcial (perfil, idioma, RGPD delete, SMS toggle) |
| LandingPage | Minima |
| Legal Pages | Funcional (CGU, Privacidade, Mencoes Legais) |

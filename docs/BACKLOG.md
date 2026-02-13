# Backlog do Produto: CronoCapilar (CHS)

> **FONTE CANONICA:** [`docs/01-Planejamento/08-backlog.md`](01-Planejamento/08-backlog.md)
>
> Este arquivo e um resumo de referencia rapida. O backlog detalhado com regras de governanca,
> status de sprints, GAP analysis e grafo de dependencias esta no documento canonico acima.
> **Sempre atualize o documento canonico primeiro.**

**Ultima Atualizacao:** 2026-02-07
**Status Geral:** 8 Epics | 25 Stories | 25 Concluidas (100%)
**Agente Responsavel:** `@product-owner`

---

## EPICS & STORIES (Resumo)

### Epic 1: Infraestrutura & Localizacao (P0) [OWNER: devops-engineer] [TOOL: CC]
- [x] **Story 1.1:** Setup Vite + React 19 + Tailwind CSS + Design Tokens.
- [x] **Story 1.2:** Configuracao Firebase em `europe-west1` (RGPD).
- [x] **Story 1.3:** Setup i18next (Frances/Ingles).
- [x] **Story 1.4:** CI/CD Pipeline (GitHub Actions + Firebase Hosting).

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
- [x] **Story 4.2:** Dashboard de Tratamentos (Agenda).
- [x] **Story 4.3:** Sync com Google Calendar (.ics).

### Epic 5: Engine de Notificacao & Recompra (P1) [OWNER: backend-specialist] [TOOL: CC]
- [x] **Story 5.1:** Calculo de Consumo de Produtos.
- [x] **Story 5.2:** Integracao Twilio SMS (+33).
- [x] **Story 5.3:** Tracking de Redirecionamento (Bit.ly).

### Epic 6: Dashboard Admin (P2) [OWNER: frontend-specialist] [TOOL: AG]
- [x] **Story 6.1:** Metricas de Conversao/Retencao.
- [x] **Story 6.2:** Cron Jobs de Agregacao de Dados.

### Epic 7: Refinamento & UX da IA (P1) [OWNER: backend-specialist] [TOOL: CC]
- [x] **Story 7.1:** Prompt Engineering.
- [x] **Story 7.2:** Feedback Visual e Loading.
- [x] **Story 7.3:** Fallbacks Robustos.

### Epic 8: Monetização & Checkout (P0) [OWNER: backend-specialist] [TOOL: CC]
- [x] **Story 8.1:** Integracao Stripe.
- [x] **Story 8.2:** Paywall e Freemium.
- [x] **Story 8.3:** Página de Upgrade.

---

## Progresso do Projeto

| Epic | Stories | Concluidas | Status |
|------|---------|------------|--------|
| **1. Infra & Localizacao** | 4 | 4 | 100% Concluido |
| **2. Auth & Perfil** | 3 | 3 | 100% Concluido |
| **3. Diagnostico IA** | 4 | 4 | 100% Concluido |
| **4. Cronograma** | 3 | 3 | 100% Concluido |
| **5. Notificacoes** | 3 | 3 | 100% Concluido |
| **6. Dashboard Admin** | 2 | 2 | 100% Concluido |
| **7. Refinamento & UX IA** | 3 | 3 | 100% Concluido |
| **8. Monetizacao & Checkout** | 3 | 3 | 100% Concluido |
| **TOTAL** | **25** | **25** | **100%** |

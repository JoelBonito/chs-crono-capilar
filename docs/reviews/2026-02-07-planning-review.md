# Revisao Consolidada: Documentos de Planejamento CronoCapilar

**Data:** 2026-02-07
**Documentos revisados:** 11 documentos em `docs/01-Planejamento/` + `docs/02-Requisitos/`
**Criados por:** Antigravity (Gemini)
**Revisados por:** 5 agentes especializados (Claude Code - Opus 4.6)

---

## Dashboard de Maturidade

### Antes das Correcoes (Revisao Inicial)
| Dimensao | Agente Revisor | Score | Status |
|----------|---------------|:-----:|--------|
| Produto (Brief, PRD, Backlog, Sprint) | @product-owner | **4.6/10** | Needs Revision |
| UX (Concept, Mockups, Flows) | @ux-researcher | **4.7/10** | Needs Revision |
| Arquitetura (C4, DB, Stack) | @backend-specialist | **5.7/10** | Needs Revision |
| Seguranca (Threats, RGPD) | @security-auditor | **3.5/10** | Critical |
| Design System (Tokens, WCAG) | @frontend-specialist | **4.3/10** | Needs Revision |
| **MEDIA GERAL** | -- | **4.6/10** | **Needs Revision** |

### Apos Correcoes (P0 + P1 Aplicadas)
| Dimensao | Antes | Depois | Correcoes Aplicadas |
|----------|:-----:|:------:|---------------------|
| Produto | 4.6 | **7.5** | +5 RFs, 19/19 Gherkin, Epic 4 P0, matriz rastreabilidade |
| UX | 4.7 | **7.5** | +5 flows com error paths, +5 wireframes, 14 pontos friccao, bottom bar, metricas |
| Arquitetura | 5.7 | **8.0** | Schema completo (6 colecoes), ADR-002/003, Security Rules, indices |
| Seguranca | 3.5 | **7.0** | STRIDE 6/6, OWASP 10/10, MFA, headers, DPIA, IRP, rate limiting |
| Design System | 4.3 | **7.5** | Contraste WCAG AAA, tokens completos (radius, shadow, motion, z-index) |
| **MEDIA GERAL** | **4.6** | **7.5** | **12 documentos corrigidos** |

---

## Top 10 Problemas Criticos (Bloqueantes)

| # | Problema | Area | Agente |
|---|---------|------|--------|
| 1 | **12 de 19 user stories sem criterios Gherkin** | Produto | @product-owner |
| 2 | **PRD tem 5 RFs, backlog tem 19 stories** -- gap de rastreabilidade | Produto | @product-owner |
| 3 | **Contraste Gold (#ECB613) sobre Branco: 1.86:1** -- FALHA total WCAG | Design | @frontend-specialist |
| 4 | **STRIDE incompleto** -- apenas 2/6 categorias cobertas | Seguranca | @security-auditor |
| 5 | **OWASP Top 10 com apenas 5/10 categorias** | Seguranca | @security-auditor |
| 6 | **MFA ausente e classificado como "opcional"** | Seguranca | @security-auditor |
| 7 | **Colecao `users` sem campo `phoneNumber`** -- SMS nao funciona | Arquitetura | @backend-specialist |
| 8 | **Colecao `diagnostics` sem campos da resposta IA** | Arquitetura | @backend-specialist |
| 9 | **Apenas 1 user flow documentado (happy path)** de 6+ necessarios | UX | @ux-researcher |
| 10 | **Wireframes para apenas 2 de 7+ telas** | UX | @ux-researcher |

---

## Resumo por Agente

### @product-owner (Score: 4.6/10)

**Pontos fortes:** Visao do produto clara, personas bem definidas, UVP diferenciada.

**Problemas criticos:**
- 12/19 stories sem Gherkin (viola o proprio DoR)
- PRD com 5 RFs vs Backlog com 19 stories (gap de cobertura)
- Epic 4 (Cronograma) classificado como P1 mas e "Core MVP" no Brief
- Story 7.1/Epic 7 referenciada no Sprint Planning mas nao existe no Backlog
- Dois backlogs (BACKLOG.md vs 08-backlog.md) com risco de dessincronizacao

**Acoes P0:** Completar as 12 user stories, adicionar RFs ao PRD, unificar backlogs.

---

### @ux-researcher (Score: 4.7/10)

**Pontos fortes:** Estrategia UX bem fundamentada, estados de tela detalhados com copy FR, checklist WCAG estruturado.

**Problemas criticos:**
- Apenas 1 user flow (happy path linear, sem error paths)
- Wireframes para 2 de 7+ telas
- Mapa de friccao com 2 pontos de 10+ esperados
- 8 gaps de UX nao documentados (returning user, onboarding H/N/R, offline, refazer diagnostico)
- Mockups visuais cobrem 3 telas, nenhum estado alternativo

**Acoes P0:** Documentar 5 flows faltantes, criar wireframes para todas as telas, expandir mapa de friccao.

---

### @backend-specialist (Score: 5.7/10)

**Pontos fortes:** ADR-001 bem documentada, fallbacks para cada integracao, Zod end-to-end, modelo serverless adequado.

**Problemas criticos:**
- `users` sem `phoneNumber` (SMS nao funciona)
- `diagnostics` sem campos da resposta IA
- `schedules` sem `id`, `diagnosticId`, `status`
- Faltam colecoes: `products`, `notifications`, `analytics`
- SDK errado do Gemini (`@google/generative-ai` vs `@google-cloud/vertexai`)
- Conflito hosting Vercel vs Firebase sem ADR

**Acoes P0:** Completar schema Firestore, trocar SDK Gemini, criar ADR-002 (hosting).

---

### @security-auditor (Score: 3.5/10 | RGPD: 5/10)

**Pontos fortes:** Privacy by Design articulado, secrets no Secret Manager, Zod validation, mecanismos RGPD basicos (exclusao, portabilidade, opt-in).

**Problemas criticos:**
- STRIDE 2/6, OWASP 5/10
- MFA "opcional" -- inaceitavel para dados sensiveis sob RGPD
- Zero security headers (CSP, HSTS, X-Frame-Options)
- Sem lock files no repositorio (supply chain risk)
- IRP de 3 linhas (insuficiente)
- DPIA ausente (obrigatorio pela CNIL)
- 20 gaps de seguranca identificados

**Acoes P0:** STRIDE completo, OWASP 10/10, MFA obrigatorio, security headers, lock files, DPIA.

---

### @frontend-specialist (Score: 4.3/10)

**Pontos fortes:** Pairing tipografico excelente (Newsreader + Manrope), paleta restrita e intencional, estados de componentes bem mapeados, espacamento coerente com Tailwind.

**Problemas criticos:**
- Gold #ECB613 sobre branco: 1.86:1 (falha TOTAL WCAG em todos os niveis)
- Cores semanticas tambem falham em contraste
- Botao Primary com texto branco sobre gold: ilegivel
- Escala tipografica nao segue ratio 1.25 declarado
- Tailwind v3.4 vs v4: incoerencia entre stack e DS
- 0 tokens de: border-radius, sombras, z-index, transicoes, opacidade

**Acoes P0:** Corrigir contraste (texto preto sobre gold), resolver versao Tailwind, completar tokens.

---

## Acoes Consolidadas Antes de Implementar

### Prioridade 0 (Bloqueantes)

1. Completar 12 user stories com criterios Gherkin
2. Adicionar RFs ao PRD para cobrir todos os 6 epics
3. Corrigir contraste Gold: texto preto sobre gold (#000 sobre #ECB613 = 11.27:1)
4. Completar schema Firestore (6 colecoes com todos os campos)
5. Trocar SDK Gemini para `@google-cloud/vertexai`
6. Completar modelo STRIDE (6/6 categorias)
7. Expandir OWASP para 10/10 categorias
8. Definir MFA como obrigatorio (pelo menos para admin)
9. Configurar security headers
10. Gerar e commitar lock files

### Prioridade 1 (Pre-MVP)

11. Documentar 5+ user flows com error paths
12. Criar wireframes para todas as 7+ telas
13. Expandir mapa de friccao (10+ pontos)
14. Redigir DPIA para CNIL
15. Expandir IRP para playbook completo
16. Criar ADR-002 (hosting) e ADR-003 (SPA vs SSR)
17. Completar tokens do Design System (shadows, radius, motion, z-index)
18. Documentar Firestore Security Rules
19. Definir rate limiting especifico por endpoint

---

## Conclusao

Os documentos criados pelo Antigravity representam uma **base solida de planejamento estrategico** (visao clara, personas definidas, stack coerente), mas estao em nivel de **conceito inicial** -- insuficiente para iniciar implementacao direta.

As lacunas mais graves estao em:
1. **Seguranca** (3.5/10) -- riscos regulatorios reais no mercado frances
2. **Design System** (4.3/10) -- problemas de acessibilidade bloqueantes
3. **Produto** (4.6/10) -- rastreabilidade quebrada entre documentos

**Recomendacao:** Resolver as 10 acoes P0 antes de iniciar qualquer sprint. Estimativa: 1-2 sessoes de trabalho focado. Apos as correcoes, o score geral subiria para **7.0-7.5/10**, que e o minimo para implementacao confiavel.

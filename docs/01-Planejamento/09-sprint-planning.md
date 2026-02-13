# Sprint Planning: CronoCapilar (CHS)

Este plano executa o backlog em sequência, com sincronização obrigatória entre sprint e backlog.

## Regras de Execução e Auditoria
1. Toda task de sprint deve apontar para uma story existente no `08-backlog.md`.
2. Ao iniciar story: atualizar backlog para `In Progress`.
3. Ao concluir story: atualizar backlog para `Done` com `Data Conclusão` e `Evidência`.
4. Sprint só fecha se todas as stories planejadas estiverem atualizadas no backlog.

---

## 🛠️ FLUXO CLAUDE CODE (Backend & Infra)
*Foco: engine, segurança e APIs.*

### ✅ CC-Sprint-0: Infraestrutura & Foundation (CONCLUÍDO)
- [x] **Task CC-0.1 (Story 1.1):** scaffold do projeto Vite + React 19 + TypeScript. *(2026-02-07)*
- [x] **Task CC-0.2 (Story 1.2):** configuração do Firebase Project (`europe-west1`) + App Check. *(2026-02-07)*
- [x] **Task CC-0.3 (Story 1.4):** setup de CI/CD (GitHub Actions + Firebase Hosting) e secrets. *(2026-02-07)*
- [x] **Task CC-0.4 (Story 2.1):** lógica de Firebase Auth e Protected Routes. *(2026-02-07)*

### 🚀 CC-Sprint-1: Inteligência & Workflows (EM PROGRESSO)
- [x] **Task CC-1.1 (Story 3.2):** Cloud Function de integração com Gemini 3 Flash. *(2026-02-07)*
- [x] **Task CC-1.2 (Story 3.3):** parser e validador de resultados da análise capilar. *(2026-02-07)*
- [x] **Task CC-1.3 (Story 4.1):** algoritmo de geração do ciclo quinzenal/mensal. *(2026-02-07)*
- [ ] **Task CC-1.4 (Story 4.3):** engine de sincronização de calendário (.ics/Google).
- [ ] **Task CC-1.5 (Story 5.1):** cálculo lógico de estoque virtual (ml/sessão).
- [ ] **Task CC-1.6 (Story 5.2):** integração Twilio SMS para o mercado francês (+33).
- [ ] **Task CC-1.7 (Story 6.2):** jobs agendados para consolidação de métricas admin.

---

## 🎨 FLUXO ANTIGRAVITY (Frontend & UX)
*Foco: design, navegação e localização.*

### ✅ AG-Sprint-0: Design System & Setup UI (CONCLUÍDO)
- [x] **Task AG-0.1 (Story 1.1):** setup de Tailwind, shadcn/ui e design tokens. (2026-02-07)
- [x] **Task AG-0.2 (Story 1.3):** setup do i18next e dicionário inicial em francês (FR). (2026-02-07)
- [x] **Task AG-0.3 (Story 1.1):** shell da aplicação (menu, sidebar e navigation). (2026-02-07)

### 🚀 AG-Sprint-1: Experiências & Features (EM PROGRESSO)
- [x] **Task AG-1.1 (Story 3.4):** UI do wizard de diagnóstico (4 passos guiados). (2026-02-07)
- [x] **Task AG-1.2 (Story 3.1):** componente de captura e upload progressivo. (2026-02-07)
- [x] **Task AG-1.3 (Story 2.2):** gestão de perfil da usuária. (2026-02-07)
- [x] **Task AG-1.4 (Story 2.3):** gestão de opt-in de **RGPD/SMS** e trilha de auditoria. (2026-02-07)
- [x] **Task AG-1.5 (Story 4.2):** visualização do calendário de tratamentos. (2026-02-07)
- [x] **Task AG-1.6 (Story 5.3):** UI de redirecionamento e tracking de links Bit.ly. (2026-02-07)
- [x] **Task AG-1.7 (Story 6.1):** dashboard admin de conversão e métricas. (2026-02-07)

---

## 📊 Matriz de Cobertura (19/19)
- **Infra (Epic 1):** 1.1, 1.2, 1.3, 1.4
- **Auth (Epic 2):** 2.1, 2.2, 2.3
- **IA (Epic 3):** 3.1, 3.2, 3.3, 3.4
- **Cronograma (Epic 4):** 4.1, 4.2, 4.3
- **Notificações (Epic 5):** 5.1, 5.2, 5.3
- **Analytics (Epic 6):** 6.1, 6.2

---

## Gate de Fechamento de Sprint
1. Todas as tasks do sprint marcadas.
2. Todas as stories relacionadas atualizadas no backlog.
3. Evidências anexadas no backlog (PR/commit/teste/demo).
4. Nenhuma divergência entre IDs de sprint e IDs de backlog.

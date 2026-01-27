# 📋 BACKLOG

> Backlog do projeto com ownership de agentes para sistema dual-agent.

---

## Legenda de Ownership

| Tag | Agente | Quando Usar |
|-----|--------|-------------|
| `[OWNER: claude_code]` | Claude Code | Implementação, código, database, devops, testes, debugging |
| `[OWNER: antigravity]` | Google Antigravity | Design, brainstorming, documentação, pesquisa, planning, review |
| `[OWNER: any]` | Qualquer | Tarefas que ambos podem executar igualmente |

---

## Progresso Geral

<!-- AUTO-GENERATED-PROGRESS -->
```
[░░░░░░░░░░░░░░░░░░░░] 0% (0/0 tasks)
```
<!-- /AUTO-GENERATED-PROGRESS -->

---

## 🎯 Epic 1: [Nome do Epic] [OWNER: claude_code]

> Descrição breve do epic

**Status:** 🔴 Not Started | 🟡 In Progress | 🟢 Done

### Stories

- [ ] **Story 1.1:** [Descrição da story]
  - Acceptance Criteria:
    - [ ] Critério 1
    - [ ] Critério 2

- [ ] **Story 1.2:** [Descrição da story]
  - Acceptance Criteria:
    - [ ] Critério 1

---

## 🎨 Epic 2: [Nome do Epic] [OWNER: antigravity]

> Descrição breve do epic

**Status:** 🔴 Not Started

### Stories

- [ ] **Story 2.1:** [Descrição da story]
- [ ] **Story 2.2:** [Descrição da story]

---

## 📝 Template para Novos Epics

```markdown
## 🏷️ Epic N: [Nome] [OWNER: claude_code|antigravity|any]

> Descrição

**Status:** 🔴 Not Started

### Stories

- [ ] **Story N.1:** [Descrição]
  - Acceptance Criteria:
    - [ ] Critério
```

---

## Guia de Ownership por Tipo de Tarefa

### Claude Code (`[OWNER: claude_code]`)

| Categoria | Exemplos |
|-----------|----------|
| **Backend** | APIs, endpoints, lógica de negócio, Node.js |
| **Database** | Schemas, migrações, Prisma, queries SQL |
| **Frontend Implementation** | Componentes React, integração, estado |
| **DevOps** | Docker, CI/CD, deploy, scripts |
| **Testing** | Unit tests, E2E, coverage, automação |
| **Debugging** | Root cause analysis, fixes, logs |
| **Refactoring** | Otimização, clean code, performance |

### Antigravity (`[OWNER: antigravity]`)

| Categoria | Exemplos |
|-----------|----------|
| **Design** | UI/UX, mockups, protótipos, design system |
| **Planning** | Requisitos, user stories, roadmap |
| **Research** | Análise de mercado, tendências, benchmarks |
| **Documentation** | Manuais, READMEs, guias de usuário |
| **Content** | SEO, copywriting, textos |
| **Review** | Code review, análise de arquitetura |
| **Brainstorming** | Ideação, exploração de soluções |

---

## Comandos Úteis

```bash
# Ver progresso
python .agent/scripts/progress_tracker.py

# Marcar task como completa
python .agent/scripts/finish_task.py "Epic-1"

# Ver locks ativos (sistema dual-agent)
python .agent/scripts/lock_manager.py list

# Dashboard consolidado
python .agent/scripts/dashboard.py
```

---

## Notas

- Epics marcados com `[OWNER: X]` indicam o agente **recomendado**, não obrigatório
- Em caso de overlap, o primeiro agente a pegar a task assume ownership temporário via lock
- Use `/track` para atualizar progresso durante a sessão
- Use `/finish` para marcar tarefas como completas

---
description: Cria documentação de projeto estruturada em 5 etapas (Brief, PRD, Design, Database, Backlog) usando agentes especializados.
---

# Workflow: /define

> **Propósito:** Planejamento completo para projetos "do zero". Gera documentação modular em vez de um único arquivo de plano.

## Regras Críticas

1. **NÃO ESCREVA CÓDIGO** — Este workflow gera apenas documentação.
2. **SEQUENCIAL** — Cada documento depende dos anteriores.
3. **SOCRATIC GATE OBRIGATÓRIO** — Pergunte ANTES de criar.

## Fluxo de Execução

### Fase 0: Coleta de Requisitos (OBRIGATÓRIO)

Antes de criar qualquer documento, faça as seguintes perguntas ao usuário:

```markdown
🤔 **Preciso entender melhor o projeto antes de começar:**

1. **Qual o problema principal que este sistema resolve?**
2. **Quem são os usuários finais? (personas)**
3. **Quais são as 3-5 funcionalidades essenciais do MVP?**
4. **Existe alguma restrição técnica? (hosting, budget, integrações)**
5. **Qual o prazo esperado para o MVP?**
```

**AGUARDE** as respostas antes de prosseguir.

---

### Fase 1: Product Brief
**Agente:** `product-manager`
**Output:** `docs/planning/01-product-brief.md`

```markdown
# Product Brief: {Nome do Projeto}

## Visão Geral
[Descrição em 2-3 parágrafos]

## Problema
[O que está sendo resolvido]

## Solução
[Como o produto resolve]

## Público-Alvo
[Personas principais]

## Métricas de Sucesso
[Como medir se funcionou]
```

**🔍 CHECKPOINT:**
> Documento gerado: `docs/planning/01-product-brief.md`
> 
> Responda:
> - `ok` — Aprovar e continuar para PRD
> - `editar` — Ajustar o Brief antes de prosseguir
> - `cancelar` — Parar o workflow

**AGUARDE** resposta antes de prosseguir.

---

### Fase 2: PRD (Product Requirements Document)
**Agente:** `product-manager`
**Output:** `docs/planning/02-prd.md`

```markdown
# PRD: {Nome do Projeto}

## Requisitos Funcionais
### RF01: [Nome]
- Descrição: ...
- Critérios de Aceite: ...
- Prioridade: P0/P1/P2

## Requisitos Não-Funcionais
[Performance, Segurança, Escalabilidade]

## Fluxos de Usuário
[Diagramas ou descrições]

## Regras de Negócio
[Lógica específica do domínio]

## Integrações
[APIs externas, serviços]
```

**🔍 CHECKPOINT:**
> Documento gerado: `docs/planning/02-prd.md`
> 
> Responda:
> - `ok` — Aprovar e continuar para Design
> - `editar` — Ajustar o PRD antes de prosseguir
> - `cancelar` — Parar o workflow

**AGUARDE** resposta antes de prosseguir.

---

### Fase 3: Design System
**Agente:** `frontend-specialist`
**Output:** `docs/planning/03-design-system.md`

```markdown
# Design System: {Nome do Projeto}

## Paleta de Cores
| Token | Hex | Uso |
|-------|-----|-----|
| primary | #... | Ações principais |

## Tipografia
| Elemento | Font | Size | Weight |
|----------|------|------|--------|

## Componentes Base
- Buttons
- Inputs
- Cards
- Modals

## Layout
- Breakpoints
- Grid System
- Spacing Scale
```

**🔍 CHECKPOINT:**
> Documento gerado: `docs/planning/03-design-system.md`
> 
> Responda:
> - `ok` — Aprovar e continuar para Database
> - `editar` — Ajustar o Design antes de prosseguir
> - `cancelar` — Parar o workflow

**AGUARDE** resposta antes de prosseguir.

---

### Fase 4: Database Layout
**Agente:** `database-architect`
**Output:** `docs/planning/04-database.md`

```markdown
# Database Design: {Nome do Projeto}

## Diagrama ER
[Mermaid ou descrição]

## Collections/Tables

### users
| Campo | Tipo | Descrição |
|-------|------|-----------|

### [outras coleções]

## Índices
[Quais campos serão indexados]

## Relacionamentos
[1:N, N:N, etc.]

## Regras de Segurança
[Firestore Rules / RLS]
```

**🔍 CHECKPOINT:**
> Documento gerado: `docs/planning/04-database.md`
> 
> Responda:
> - `ok` — Aprovar e criar Backlog Final
> - `editar` — Ajustar o DB antes de prosseguir
> - `cancelar` — Parar o workflow

**AGUARDE** resposta antes de prosseguir.

---

### Fase 5: Backlog Generation
**Agente:** `project-planner`
**Output:** `docs/BACKLOG.md`

Baseado nos 4 documentos anteriores, crie um backlog estruturado:

```markdown
# Lista Global de Tarefas

**Última Atualização:** AAAA-MM-DD HH:MM
**Status Geral:** Epic 1 TODO | Epic 2 TODO | ...

---

## Epic 1: [Nome do Épico]

- [ ] **Story 1.1:** [Título da História]
- [ ] **Story 1.2:** [Título da História]
  - [ ] Subtarefa 1
  - [ ] Subtarefa 2

---

## Epic 2: [Nome do Épico]

- [ ] **Story 2.1:** [Título]

---

## Resumo de Progresso

| Epic | Stories | Concluídas | Status |
|------|---------|------------|--------|
| Epic 1 | X | 0 | 🔴 TODO (0%) |
| Epic 2 | Y | 0 | 🔴 TODO (0%) |
| **TOTAL** | **Z** | **0** | **0%** |
```

---

## Pós-Execução

Após criar todos os 5 documentos:

1. **Informe ao usuário** os arquivos criados.
2. **Sugira rodar `/track`** para inicializar a barra de progresso.
3. **NÃO inicie implementação** sem aprovação explícita.

---

## Exemplo de Uso

```
Usuário: /define App de gestão de tarefas pessoais
```

O agente deve:
1. Fazer perguntas Socráticas
2. Criar os 5 documentos sequencialmente
3. Reportar conclusão

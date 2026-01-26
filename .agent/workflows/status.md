---
description: Exibe um dashboard consolidado do progresso do projeto, sessões recentes e logs de atividade.
---

# Workflow: /status

> **Propósito:** Substituir o status genérico por um painel centralizado que combina progresso real (do backlog) e atividades recentes (dos logs).

## Fluxo de Execução

Este workflow executa sequencialmente os scripts de rastreamento e log para montar um dashboard completo.

### Passo 1: Atualizar Progresso
Executa o `progress_tracker.py` para garantir que `docs/progress-bar.md` esteja atualizado com base no Backlog.

```bash
python .agent/scripts/progress_tracker.py
```

### Passo 2: Gerar Resumo da Semana
Executa o `session_logger.py` para obter dados das sessões recentes.

```bash
python .agent/scripts/session_logger.py summary --week
```

### Passo 3: Exibir Dashboard Consolidado

O agente deve ler os outputs dos passos anteriores e exibir um resumo formatado no terminal:

```markdown
# 📊 Dashboard de Projeto

**Atualizado em:** AAAA-MM-DD HH:MM

---

## 🚀 Progresso Geral
(Copiar barra visual do output do progress_tracker)
**Status:** XX% Concluído (X/Y tarefas)

---

## 📅 Esta Semana
(Resumo do output do session_logger)
- **Tempo Total:** HH:MM
- **Sessões:** N
- **Foco Principal:** [Listar projetos/épicos trabalhados]

## 🎯 Próximo Foco Prioritário
(Extraído do "Próximo Foco" do progress-bar.md)
- **Epic:** [Nome]
- **Tarefas:** [Listar primeiras 3 tarefas pendentes deste épico]

---

## ⚡ Comandos Rápidos
- `/log start` - Iniciar nova sessão
- `/log end` - Registrar atividades
- `/track` - Atualizar progresso após marcar tarefas
```

---

## Exemplo de Output Real

```
# 📊 Dashboard: Inove AI Zap

## 🚀 Progresso
████████████░░░░░░░░ 60%
Concluídas: 30/50

## 📅 Semana Atual
- Tempo: 12h 30m
- Sessões: 5
- Destaques:
  - Epic 1: Autenticação (Concluído)
  - Epic 2: API (Em andamento)

## 🎯 Próximo Foco: API
- [ ] Story 2.1: Endpoint de Login
- [ ] Story 2.2: Middleware de Auth

---
*Execute /log start para começar a trabalhar.*
```

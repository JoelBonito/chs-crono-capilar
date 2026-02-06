# AGENTS.md - Instruções para OpenAI Codex CLI

> **PONTE:** Este arquivo redireciona para as instruções compartilhadas em `.agents/INSTRUCTIONS.md`.
> Para modificar as instruções, edite `.agents/INSTRUCTIONS.md`.

---

## Quick Start

```bash
# Verificar skills disponíveis
codex "listar skills disponíveis"

# Usar um workflow
/prompts:define "Nome do Projeto"

# Ativar agente específico
$frontend-specialist "criar componente de login"
```

---

## Estrutura do Framework

Este projeto usa o **Inove AI Framework** com estrutura unificada:

```
.agents/
├── agents/      # 21 agentes especializados
├── skills/      # 40 skills modulares
├── workflows/   # 18 workflows (via /prompts:)
├── scripts/     # Scripts de automação Python
└── config/      # Configurações por plataforma
```

---

## Instruções Completas

📄 **[.agents/INSTRUCTIONS.md](.agents/INSTRUCTIONS.md)**

---

## Documentação

- **Arquitetura:** [.agents/ARCHITECTURE.md](.agents/ARCHITECTURE.md)
- **Skills:** `.agents/skills/*/SKILL.md`
- **Agentes:** `.agents/agents/*.md`

---

<!--
IMPORTANT: The actual instructions are in .agents/INSTRUCTIONS.md
This file serves as a bridge/redirect for Codex CLI.
Codex reads AGENTS.md files automatically.
-->

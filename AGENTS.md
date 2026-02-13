# AGENTS.md - Instruções para OpenAI Codex CLI

> **PONTE:** Este arquivo redireciona para as instruções compartilhadas em `.agents/INSTRUCTIONS.md`.
> Para modificar as instruções completas, edite `.agents/INSTRUCTIONS.md`.

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

## ⚠️ REGRAS INVIOLÁVEIS (Mesmo sem ler INSTRUCTIONS.md)

As regras abaixo DEVEM ser seguidas em TODAS as sessões, sem exceção.

### 📥 Classificação de Requisição (STEP 0)

Antes de qualquer ação, classificar o pedido:

| Tipo                 | Palavras-chave                                | Resultado                      |
| -------------------- | --------------------------------------------- | ------------------------------ |
| **PERGUNTA**         | "o que é", "como funciona", "explique"        | Resposta textual (sem editar)  |
| **EDIT SIMPLES**     | "corrige", "adiciona", "muda" (1 arquivo)     | Edição inline                  |
| **CÓDIGO COMPLEXO**  | "construa", "crie", "implemente", "refatore"  | Criar `{task-slug}.md` antes   |
| **SLASH CMD**        | /define, /debug, /create, /orchestrate        | Fluxo do comando               |

### 🛑 Socratic Gate (OBRIGATÓRIO)

**Para requisições complexas, PARAR e PERGUNTAR primeiro:**

| Tipo                      | Ação Obrigatória                                     |
| ------------------------- | ---------------------------------------------------- |
| **Nova Feature / Build**  | PERGUNTAR mínimo 3 questões estratégicas             |
| **Edit / Bug Fix**        | Confirmar entendimento + perguntas de impacto        |
| **Vago / Simples**        | Perguntar Propósito, Usuários e Escopo               |
| **"Prossiga" direto**     | Mesmo assim, perguntar 2 questões de Edge Case       |

> 🔴 **Nunca assumir.** Se 1% estiver indefinido, PERGUNTAR. NÃO escrever código até o usuário liberar.

### 🧠 Read → Understand → Apply

```
❌ ERRADO: Ler agente → Começar a codar
✅ CORRETO: Ler → Entender PORQUÊ → Aplicar PRINCÍPIOS → Codar
```

### ✅ Auto-Finish Protocol

Após completar QUALQUER tarefa do `docs/BACKLOG.md`:

```bash
python .agents/scripts/finish_task.py "{task_id}"
python .agents/scripts/progress_tracker.py
```

Informar: `✅ Task {task_id} marcada como completa | 📊 Progresso: {%}`

> 🔴 Você é RESPONSÁVEL por atualizar o backlog. Não peça ao usuário.

### 📝 Registro de Sessões de Trabalho (OBRIGATÓRIO)

**Rastrear toda sessão em `docs/08-Logs-Sessoes/{ANO}/{AAAA-MM-DD}.md`.**

**Regras:**
1. **Ao iniciar sessão:** Criar/abrir arquivo do dia, registrar hora de início.
2. **Ao encerrar sessão:** Completar hora de fim, calcular duração, descrever atividades.
3. **Consolidação:** Atualizar "Resumo do Dia" com totais (início, fim, tempo total).
4. **Índice:** Manter `docs/08-Logs-Sessoes/README.md` atualizado.

**Modelo:**
```markdown
# LOG DIÁRIO — AAAA-MM-DD
- Projeto: <NOME_DO_PROJETO>
- Fuso: America/Sao_Paulo

## Sessões
1. HH:MM — HH:MM (HH:MM)
   - Atividades: <bullets curtos e objetivos>

## Resumo do Dia
- Início do dia: HH:MM
- Fim do dia: HH:MM
- Tempo total: HH:MM
```

**Formato:** PT-BR, horários 24h, data ISO, fuso America/Sao_Paulo.

### 🌐 Tratamento de Idioma

- **Prompt em PT-BR** → Responder em PT-BR
- **Comentários de código** → Sempre em inglês
- **Variáveis/funções** → Sempre em inglês

---

## Instruções Completas

📄 **[.agents/INSTRUCTIONS.md](.agents/INSTRUCTIONS.md)** — Regras detalhadas, roteamento inteligente, workflows, agentes, scripts.

---

## Documentação

- **Arquitetura:** [.agents/ARCHITECTURE.md](.agents/ARCHITECTURE.md)
- **Skills:** `.agents/skills/*/SKILL.md`
- **Agentes:** `.agents/agents/*.md`

---

<!--
IMPORTANT: The actual full instructions are in .agents/INSTRUCTIONS.md
This file serves as a bridge/redirect for Codex CLI with critical guardrails.
Codex reads AGENTS.md files automatically.
-->

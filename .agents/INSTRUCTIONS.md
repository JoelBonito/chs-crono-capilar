# INSTRUCTIONS.md - Instruções Compartilhadas do Inove AI Framework

> Este arquivo contém as instruções compartilhadas para Claude Code e Codex CLI.
> É carregado automaticamente por ambas as ferramentas.

## Sobre Este Projeto

**Inove AI Framework** é um kit de desenvolvimento AI com sistema multi-agent (Claude Code + Codex CLI + Antigravity/Gemini) que fornece:

- **21 Agentes Especializados** para diferentes domínios
- **40 Skills Modulares** carregadas sob demanda
- **21 Workflows** (slash commands) para processos estruturados
- **Sistema Multi-Agent** com sincronização de locks e ownership

---

## Estrutura do Framework

```
.agents/
├── agents/           # 21 agentes especializados
├── skills/           # 40 módulos de conhecimento
├── workflows/        # 21 workflows (slash commands)
├── scripts/          # Automação Python
└── ARCHITECTURE.md   # Documentação técnica
```

---

## Protocolo de Roteamento Inteligente

### 1. Detecção de Domínio (AUTOMÁTICO)

| Palavras-chave | Domínio | Agente Primário |
|----------------|---------|-----------------|
| "UI", "componente", "página", "frontend" | Frontend | `frontend-specialist` |
| "API", "endpoint", "backend", "servidor" | Backend | `backend-specialist` |
| "database", "schema", "query", "migração" | Database | `database-architect` |
| "mobile", "iOS", "Android", "React Native" | Mobile | `mobile-developer` |
| "auth", "segurança", "vulnerabilidade" | Security | `security-auditor` |
| "bug", "erro", "não funciona", "debug" | Debug | `debugger` |
| "teste", "E2E", "CI/CD" | Testing | `qa-automation-engineer` |
| "deploy", "docker", "infraestrutura" | DevOps | `devops-engineer` |
| "requisitos", "user story", "backlog", "MVP" | Product | `product-owner` |
| "UX", "user flow", "wireframe", "jornada", "usabilidade" | UX Research | `ux-researcher` |

### 2. Ativação de Agente (OBRIGATÓRIO)

Quando um domínio for detectado:

1. **Ler arquivo do agente:** `.agents/agents/{agent}.md`
2. **Anunciar ativação:**
   ```
   🤖 Ativando @{nome-do-agente}...
   📖 Carregando regras e protocolos
   ```
3. **Carregar skills** do frontmatter do agente
4. **Aplicar persona e regras** do agente

---

## Workflows Disponíveis (Slash Commands)

| Comando | Descrição | Quando Usar |
|---------|-----------|-------------|
| `/define` | Planejamento completo em 9 fases com GAP Analysis | Novos projetos do zero |
| `/journeys` | Documentar jornadas de usuário | Contextualizar requisitos |
| `/context` | Criar Project Context | Padronizar convenções técnicas |
| `/readiness` | Validar prontidão para implementação | Antes de começar a codar |
| `/brainstorm` | Exploração Socrática | Ideação e descoberta |
| `/create` | Criar novas features | Implementação guiada |
| `/debug` | Debug sistemático | Resolução de bugs |
| `/enhance` | Melhorar código existente | Refatoração |
| `/deploy` | Deploy de aplicação | Publicação |
| `/test` | Gerar e rodar testes | Quality assurance |
| `/track` | Atualizar progresso | Tracking de tarefas |
| `/status` | Dashboard consolidado | Visão geral |
| `/log` | Registrar sessões | Documentação |
| `/finish` | Marcar tarefas completas | Conclusão |
| `/orchestrate` | Coordenação multi-agente | Tarefas que requerem múltiplos agentes |
| `/plan` | Planejamento rápido de tarefas | Plano leve (alternativa ao /define) |
| `/preview` | Gerenciar servidor de preview | Start/stop/restart do dev server |
| `/ui-ux-pro-max` | Design system avançado com base de dados | UI/UX com paletas, tipografia, estilos |
| `/review` | Revisão de código pós-sprint | Após implementação, antes de /finish |
| `/test-book` | Gerar/atualizar Caderno de Testes | Antes de finalizar MVP ou release |
| `/release` | Finalizar projeto e gerar release | Conclusão de MVP ou Produção |

**Como usar:**
```
/define App de gestão de tarefas
/debug O login não está funcionando
/track
```

---

## Protocolo Auto-Finish (OBRIGATÓRIO)

Após completar QUALQUER tarefa do `docs/BACKLOG.md`:

```bash
python .agents/scripts/finish_task.py "{task_id}"
python .agents/scripts/progress_tracker.py
```

Informar ao usuário:
```
✅ Task {task_id} marcada como completa
📊 Progresso atualizado: {percentual}%
🎯 Próxima tarefa: {nome_proxima_tarefa}
```

---

## Integração com Backlog

Quando o usuário disser "implementar Epic X" ou "implementar Story Y.Z":

1. **Ler backlog:** `docs/BACKLOG.md`
2. **Identificar detalhes** da tarefa
3. **Detectar domínio** → Ativar agente apropriado
4. **Implementar** seguindo regras do agente
5. **Auto-finish** usando scripts
6. **Atualizar progresso**

---

## Regras Universais (TIER 0)

### Clean Code (Mandatório Global)

Todo código DEVE seguir `.agents/skills/clean-code/SKILL.md`:

- Código conciso e auto-documentado
- Sem over-engineering
- Testes obrigatórios (Unit > Integration > E2E)
- Performance medida antes de otimizar

### Tratamento de Idioma

- **Prompt do usuário** em PT-BR → Responder em PT-BR
- **Comentários de código** → Sempre em inglês
- **Variáveis/funções** → Sempre em inglês


### Socratic Gate

Para requisições complexas, PERGUNTAR antes de implementar:

- Propósito e escopo
- Casos de borda
- Implicações de performance
- Considerações de segurança

---

## ⏱️ Registro de Sessão (OBRIGATÓRIO)

Assim como o Antigravity, você DEVE registrar suas sessões de trabalho para controle de horas e atividades.

### 1. Início de Sessão (Ao começar)
Sempre que iniciar uma interação, execute imediatamente:
```bash
python .agents/scripts/auto_session.py start --agent claude_code
```

### 2. Fim de Sessão (Ao terminar)
Quando o usuário se despedir ou a tarefa for concluída, encerre a sessão registrando o que foi feito:
```bash
python .agents/scripts/auto_session.py end --activities "Resumo das atividades realizadas"
```

### 3. Fallback (Modo Manual)
Se os scripts falharem, edite manualmente `docs/08-Logs-Sessoes/{ANO}/{DATA}.md` seguindo o padrão:
```markdown
## Sessões
1. HH:MM — HH:MM (HH:MM) [🔵 claude_code]
   - Atividades:
     - Atividade 1
     - Atividade 2
```

---

## 📂 Organização de Documentação (OBRIGATÓRIO)

A documentação DEVE seguir estritamente esta estrutura de pastas. Não crie arquivos soltos na raiz de `docs/` (exceto BACKLOG.md).

```bash
docs/
├── 00-Contexto/        # Contexto do projeto e regras
│   ├── CONTEXT.md      # Gerado por /context
│   └── READINESS.md    # Gerado por /readiness
├── 01-Planejamento/    # Artefatos executivos do /define
│   ├── 01-product-brief.md
│   ├── 02-prd.md
│   ├── 03-design-system.md
│   ├── 04-database-schema.md
│   └── 05-roadmap-backlog.md
├── 02-Requisitos/      # Detalhamento funcional
│   ├── User-Stories.md
│   └── Jornadas.md     # Gerado por /journeys
├── 03-Arquitetura/     # Técnicos e Decisões
│   ├── ADRs/           # Architecture Decision Records
│   └── Diagramas/      # Mermaid/PlantUML (fluxos, classes)
├── 04-API/            # Contratos de Interface
│   └── Endpoints.md    # OpenAPI ou Docs REST
├── 08-Logs-Sessoes/    # Logs de Sessão de Trabalho
│   └── {ANO}/{DATA}.md # Logs diários
└── BACKLOG.md          # Backlog Mestre (Raiz)
```

**Regra:** Ao criar documentos, sempre verifique se a pasta existe. Se não existir, crie-a.

---

## Compatibilidade Multi-Plataforma

Este framework suporta **três ferramentas AI simultaneamente**:

| Ferramenta | Arquivo de Instrução | Skills Location | Config |
|------------|---------------------|-----------------|--------|
| Claude Code | `CLAUDE.md` | `.agents/skills/` | N/A |
| Codex CLI | `AGENTS.md` | `.codex/skills/` (symlink) | `.agents/config/codex.toml` |
| Antigravity/Gemini | `GEMINI.md` | `.agents/skills/` | `.agents/rules/GEMINI.md` |

### Detecção Automática de Plataforma

Os scripts Python detectam automaticamente qual ferramenta está executando:

```python
from platform_compat import get_agent_source
source = get_agent_source()  # 'claude_code', 'codex', ou 'unknown'
```

## Sistema Multi-Agent

Este framework suporta múltiplos agentes AI trabalhando simultaneamente:

### Identificação de Fonte
```bash
# Para Antigravity/Gemini
export AGENT_SOURCE=antigravity

# Para Claude Code
export AGENT_SOURCE=claude_code
```

### Lock Manager
```bash
python .agents/scripts/lock_manager.py list      # Ver locks ativos
python .agents/scripts/lock_manager.py cleanup   # Limpar locks expirados
```

### Ownership e Modelo Preferencial de Epics

Formato no BACKLOG.md:
```markdown
## Epic 1: Nome [OWNER: claude_code] [MODEL: opus-4-5]
```

| Campo | Descrição | Valores |
|-------|-----------|---------|
| `OWNER` | Agente/ferramenta responsável | `claude_code`, `antigravity`, `codex` |
| `MODEL` | Modelo AI preferencial | `opus-4-5`, `sonnet`, `haiku`, `gemini-2.0` |

---

## Scripts Úteis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Dashboard | `python .agents/scripts/dashboard.py` | Visão consolidada |
| Progresso | `python .agents/scripts/progress_tracker.py` | Atualizar barra |
| Sessão | `python .agents/scripts/auto_session.py start` | Iniciar sessão |
| Finish | `python .agents/scripts/finish_task.py "Epic-1"` | Marcar completo |
| Métricas | `python .agents/scripts/metrics.py` | Insights |
| Validar | `python .agents/scripts/validate_installation.py` | Verificar setup |
| Rastreabilidade | `python .agents/scripts/validate_traceability.py` | Validar cobertura |

---

## Inicialização de Sessão

Toda conversa começa com:

```
✅ Project Instructions carregadas
✅ Protocolo Inove AI Framework ativo
✅ 21 agentes disponíveis
✅ 40 skills disponíveis
✅ 21 workflows disponíveis
✅ Roteamento inteligente habilitado

🎯 Pronto para trabalhar. O que devo fazer?
```

---

## Referência Rápida de Agentes

| Agente | Arquivo | Skills Primárias |
|--------|---------|------------------|
| `orchestrator` | `.agents/agents/orchestrator.md` | Coordenação multi-agente |
| `project-planner` | `.agents/agents/project-planner.md` | Planejamento, discovery |
| `product-manager` | `.agents/agents/product-manager.md` | Requisitos, user stories |
| `frontend-specialist` | `.agents/agents/frontend-specialist.md` | React, UI/UX, Tailwind |
| `backend-specialist` | `.agents/agents/backend-specialist.md` | APIs, Node.js, lógica |
| `database-architect` | `.agents/agents/database-architect.md` | Schemas, Prisma, queries |
| `mobile-developer` | `.agents/agents/mobile-developer.md` | iOS, Android, RN |
| `security-auditor` | `.agents/agents/security-auditor.md` | Auth, OWASP, compliance |
| `debugger` | `.agents/agents/debugger.md` | Root cause analysis |
| `devops-engineer` | `.agents/agents/devops-engineer.md` | CI/CD, Docker, infra |
| `test-engineer` | `.agents/agents/test-engineer.md` | Estratégias de teste |
| `qa-automation-engineer` | `.agents/agents/qa-automation-engineer.md` | E2E, automação |
| `documentation-writer` | `.agents/agents/documentation-writer.md` | Manuais, docs |
| `code-archaeologist` | `.agents/agents/code-archaeologist.md` | Refatoração legacy |
| `performance-optimizer` | `.agents/agents/performance-optimizer.md` | Otimizações |
| `seo-specialist` | `.agents/agents/seo-specialist.md` | SEO, visibilidade |
| `penetration-tester` | `.agents/agents/penetration-tester.md` | Security testing |
| `game-developer` | `.agents/agents/game-developer.md` | Game logic |
| `product-owner` | `.agents/agents/product-owner.md` | Requisitos, backlog, MVP |
| `explorer-agent` | `.agents/agents/explorer-agent.md` | Análise de codebase |
| `ux-researcher` | `.agents/agents/ux-researcher.md` | UX research, user flows, wireframes |

---

## Exemplo de Fluxo Completo

**Usuário:** "Implementar Epic 1: Autenticação de Usuários"

**Claude:**
1. 🔍 Domínio detectado: Security + Backend
2. 🤖 Ativando agentes:
   - @security-auditor (líder)
   - @backend-specialist (suporte)
3. 📖 Carregando skills: vulnerability-scanner, api-patterns
4. [Implementa código seguindo regras dos agentes]
5. ✅ Implementação completa
6. 🔧 Executando: `python .agents/scripts/finish_task.py "Epic 1"`
7. 📊 Progresso: 25% (1/4 epics concluídos)

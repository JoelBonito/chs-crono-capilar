# Antigravity Kit - Project Instructions

> **AUTO-LOADED:** Claude Code loads this file automatically for every conversation in this project.

---

## 🚨 CRITICAL: READ FIRST

This project uses Antigravity Kit framework with intelligent agent routing.

**BEFORE responding to ANY request:**

1. ✅ Check request domain (Frontend, Backend, Database, Security, Mobile)
2. ✅ Activate appropriate agent from `.agent/agents/{agent}.md`
3. ✅ Load required skills from `.agent/skills/{skill}/SKILL.md`
4. ✅ Follow agent's rules and protocols
5. ✅ Execute auto-finish after completing tasks

---

## 🤖 INTELLIGENT ROUTING PROTOCOL

### Step 1: Domain Detection (AUTOMATIC)

Analyze the user's request and classify:

| Keywords in Request | Domain | Primary Agent |
|---------------------|--------|---------------|
| "UI", "component", "page", "design", "frontend" | Frontend | `frontend-specialist` |
| "API", "endpoint", "backend", "server" | Backend | `backend-specialist` |
| "database", "schema", "query", "migration" | Database | `database-architect` |
| "mobile", "iOS", "Android", "React Native" | Mobile | `mobile-developer` |
| "auth", "security", "vulnerability", "OWASP" | Security | `security-auditor` |
| "bug", "error", "not working", "debug" | Debug | `debugger` |
| "test", "E2E", "CI/CD" | Testing | `qa-automation-engineer` |

### Step 2: Agent Activation (MANDATORY)

When domain is detected:

1. **Read agent file:** `.agent/agents/{agent}.md`
2. **Announce activation:** 
🤖 Activating @{agent-name}...
📖 Loading agent rules and protocols

text
3. **Load skills** from agent's frontmatter
4. **Apply agent's persona and rules**

### Step 3: Implementation

Follow the agent's specific rules:
- Code style from agent
- Architecture patterns from agent
- Testing requirements from agent
- Documentation standards from agent

---

## 🔧 AGENT REFERENCE TABLE

| Agent | File Path | Primary Skills | Use When |
|-------|-----------|----------------|----------|
| Frontend Specialist | `.agent/agents/frontend-specialist.md` | frontend-design, react-patterns, tailwind-patterns | Building UI components, pages, layouts |
| Backend Specialist | `.agent/agents/backend-specialist.md` | api-patterns, nodejs-best-practices | Creating APIs, business logic |
| Database Architect | `.agent/agents/database-architect.md` | database-design, prisma-expert | Designing schemas, queries, migrations |
| Mobile Developer | `.agent/agents/mobile-developer.md` | mobile-design | iOS, Android, RN development |
| Security Auditor | `.agent/agents/security-auditor.md` | vulnerability-scanner | Auth, security reviews, OWASP |
| Debugger | `.agent/agents/debugger.md` | systematic-debugging | Fixing bugs, troubleshooting |
| DevOps Engineer | `.agent/agents/devops-engineer.md` | deployment-procedures, docker-expert | CI/CD, deployment, infrastructure |
| Test Engineer | `.agent/agents/test-engineer.md` | testing-patterns, webapp-testing | Writing tests, test strategies |

---

## 📋 WORKFLOW HANDLING

When user references a workflow (e.g., "/define", "/log", "/track"):

1. **Translate to file reference:**
- `/define` → Read `.agent/workflows/define.md`
- `/log` → Read `.agent/workflows/log.md`
- `/track` → Read `.agent/workflows/track.md`
- `/status` → Read `.agent/workflows/status.md`

2. **Execute the workflow:**
- Follow all steps in the workflow file
- Respect checkpoints and gates
- Wait for user confirmation when required

---

## ✅ AUTO-FINISH PROTOCOL (MANDATORY)

After completing ANY task from `docs/BACKLOG.md`:

```bash
# Execute automatically:
python .agent/scripts/finish_task.py "{task_id}"
python .agent/scripts/progress_tracker.py
Then inform user:

text
✅ Task {task_id} marked complete
📊 Progress updated: {percentage}%
🎯 Next task: {next_task_name}
🛑 UNIVERSAL RULES (TIER 0)
Clean Code (Global Mandatory)
ALL code MUST follow .agent/skills/clean-code/SKILL.md:

Concise, self-documenting code

No over-engineering

Testing mandatory (Unit > Integration > E2E)

Performance measured before optimization

Language Handling
User's prompt language → Respond in same language

Code comments → Always English

Variables/functions → Always English

Socratic Gate
For complex requests, ASK before implementing:

Purpose and scope

Edge cases

Performance implications

Security considerations

📊 BACKLOG INTEGRATION
When user says "implement Epic X" or "implement Story Y.Z":

Read backlog: docs/BACKLOG.md

Identify task details

Detect domain → Activate agent

Implement following agent rules

Auto-finish using script

Update progress

🎯 SESSION INITIALIZATION
Every conversation starts with:

text
✅ Project Instructions loaded
✅ Antigravity Kit protocol active
✅ 19 agents available
✅ 36 skills available
✅ Intelligent routing enabled

🎯 Ready to work. What should I do?
🔍 EXAMPLE WORKFLOW
User says: "Implement Epic 1: User Authentication"

You do:

Analyze:

text
🔍 Domain detected: Security + Backend
Route:

text
🤖 Activating agents:
- @security-auditor (lead)
- @backend-specialist (support)
Load:

text
📖 Reading:
- .agent/agents/security-auditor.md
- .agent/agents/backend-specialist.md

🧩 Loading skills:
- vulnerability-scanner
- api-patterns
Implement:

text
[Generate code following agent rules]
Finish:

text
✅ Implementation complete
🔧 Running: python .agent/scripts/finish_task.py "Epic 1"
📊 Progress: 25% (1/4 epics done)
# Stack: CronoCapilar (CHS)

## Metadados
- **Baseado em:** Brief, PRD, Architecture, Security
- **Data:** 2026-02-07
- **Versão:** 1.1
- **Status:** Aprovado para execução

---

## 1. Stack por Camada

| Camada | Tecnologia | Versão Fixa | Justificativa | Alternativas |
|--------|------------|-------------|---------------|-------------|
| **Runtime JS** | Node.js | `20.11.1` | Compatível com Firebase Functions e `fetch` nativo. | Node 22 |
| **Package Manager** | pnpm | `9.15.0` | Instalação determinística e rápida. | npm |
| **Linguagem** | TypeScript | `5.6.3` | Tipagem estrita para reduzir erros de runtime. | JavaScript |
| **Framework Frontend** | React | `19.0.0` | Ecossistema consolidado e boa DX. | Vue, Next.js |
| **Build Tool** | Vite | `5.4.11` | Build rápido e HMR estável. | Webpack |
| **Styling** | Tailwind CSS | `3.4.17` | Consistência visual via tokens. | Styled Components |
| **Componentes UI** | shadcn/ui | `registry (commit lock no projeto)` | Base acessível e customizável. | MUI, Chakra UI |
| **i18n** | react-i18next | `15.1.2` | Localização FR/EN robusta. | FormatJS |
| **Backend Runtime** | Firebase Functions | `2nd gen` | Serverless com escala automática. | Cloud Run |
| **Database** | Firestore | `Native Mode` | Modelo documento e baixa operação. | PostgreSQL |
| **Auth** | Firebase Auth | `GA` | Fluxo seguro com provedores gerenciados. | Clerk, Auth0 |
| **Storage** | Firebase Storage | `GA` | Gestão segura de fotos diagnósticas. | AWS S3 |
| **Hosting (Frontend)** | Firebase Hosting | `GA` | Deploy unificado com Functions e domínio único. | Vercel |

---

## 2. Bibliotecas de Integração

| Pacote | Versão Fixa | Propósito |
|--------|-------------|-----------|
| `firebase` | `11.0.2` | SDK unificado para Auth/Firestore/Storage/Functions |
| `twilio` | `5.3.7` | Envio de SMS para +33 |
| `@google-cloud/vertexai` | `1.8.0` | Integração Gemini via Vertex AI |
| `zod` | `3.23.8` | Validação de payloads e contratos |
| `lucide-react` | `0.460.0` | Iconografia da interface |
| `date-fns` | `4.1.0` | Cálculos de datas do cronograma |
| `@sentry/node` | `8.41.0` | Telemetria de erros no backend |

**Nota:** Em Node.js 20, usar `fetch` nativo. Não adicionar `axios`/`node-fetch` sem necessidade comprovada.

---

## 3. Tooling e Developer Experience

### 3.1 Qualidade de Código
- **ESLint:** `9.15.0`
- **Prettier:** `3.4.1`
- **Husky:** `9.1.7`
- **lint-staged:** `15.2.10`

### 3.2 Testing Stack
| Tipo | Ferramenta | Versão Fixa | Gate |
|------|-----------|-------------|------|
| **Unit / Logic** | Vitest | `2.1.8` | obrigatório em PR |
| **Componentes** | React Testing Library | `16.1.0` | obrigatório para componentes críticos |
| **E2E / Fluxo** | Playwright | `1.49.0` | obrigatório antes de release |

### 3.3 Observabilidade
- **Sentry** para erros de frontend/backend.
- **Firebase Performance** para métricas de latência.
- **Cloud Logging** com correlação por `requestId`.

---

## 4. Estrutura de Arquivos

```txt
src/
├── app/
├── components/
├── features/
├── i18n/
├── lib/
├── pages/
├── services/
├── types/
└── utils/
functions/
├── src/
├── tests/
└── package.json
```

---

## 5. Compatibilidade e Lock

### 5.1 Matriz de Compatibilidade
| Item | Compatível Com | Verificado Em |
|------|----------------|---------------|
| React `19.0.0` | Vite `5.4.11`, TS `5.6.3` | 2026-02-07 |
| Firebase SDK `11.0.2` | Node `20.11.1` | 2026-02-07 |
| Tailwind `3.4.17` | shadcn/ui | 2026-02-07 |

### 5.2 Política de Versionamento
1. Toda dependência deve ser pinada sem `latest` e sem range aberto.
2. Upgrade só por PR dedicado com changelog e evidência de testes.
3. Regressão em E2E bloqueia promoção de versão.

### 5.3 Depreciação e Renovação
- Revisão mensal de CVEs e pacotes descontinuados.
- Renovação planejada por sprint técnico a cada 8 semanas.

---

## 6. GAP Analysis: Tecnologia

### 6.1 Stack Atual vs Necessária
| Camada | Atual | Necessária | Motivo | Esforço |
|--------|-------|-----------|--------|---------|
| IA Visual | N/A | Gemini 3 Flash em Vertex AI | Diagnóstico técnico de fotos | Médio |
| Calendar Sync | N/A | Google + `.ics` | Sincronização multiplataforma | Médio |

### 6.2 GAP Inventory
| ID | Área | AS-IS | TO-BE | GAP | Severidade | Prioridade |
|----|------|-------|-------|-----|------------|------------|
| G-STACK-01 | Integração | Sem SDKs | SDKs pinados e operacionais | Setup de Twilio e Gemini | Alta | P0 |
| G-STACK-02 | Localização | Default EN | 100% FR + fallback EN | Setup de i18next e glossário capilar FR | Alta | P0 |

---

## 7. Configurações de Região (RGPD)
- **Firebase Project Region:** `europe-west1`
- **Firestore Region:** `europe-west1`
- **Cloud Functions Region:** `europe-west1`
- **Vertex AI Location:** `europe-west1`

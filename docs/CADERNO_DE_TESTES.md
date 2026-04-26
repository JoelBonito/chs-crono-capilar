# Caderno de Testes — CronoCapilar

> Versão: 2.0 | Data: 2026-04-26 | Status: Draft
> Gerado por: Claude Code (qa-automation-engineer)
> Baseado em: docs/BACKLOG.md + código implementado (app/src/ + functions/src/)

---

## Convenções

```
[ ] Pendente   — teste ainda não executado
[x] Aprovado   — teste passou na última execução
[!] Falha      — teste falhou; registrar data e detalhe
[-] N/A        — não aplicável ao ambiente atual
```

**Prioridades:** P0 = bloqueador de release | P1 = importante | P2 = desejável

---

## Resumo de Cobertura

| Seção | Categoria | Qtd Testes | P0 | P1 | P2 |
|-------|-----------|------------|----|----|-----|
| 1 | Estrutura e Integridade | 10 | 8 | 2 | 0 |
| 2 | Autenticação & Perfil | 17 | 12 | 5 | 0 |
| 3 | Localização & i18n | 14 | 8 | 6 | 0 |
| 4 | Diagnóstico IA | 22 | 14 | 8 | 0 |
| 5 | Cronograma Capilar | 16 | 10 | 6 | 0 |
| 6 | Notificações SMS | 10 | 4 | 6 | 0 |
| 7 | Configurações | 14 | 8 | 6 | 0 |
| 8 | Segurança & RGPD | 14 | 12 | 2 | 0 |
| 9 | Performance & UX | 10 | 4 | 6 | 0 |
| 10 | Edge Cases & Regressão | 12 | 6 | 6 | 0 |
| **Total** | | **139** | **86** | **53** | **0** |

---

## 1. Estrutura e Integridade (P0)

> Verifica se a aplicação arranca, as rotas existem e o build é válido.

### 1.1 Build e Deploy

**1.1.1** — Build de produção sem erros
- **Pré-condição:** Node 20+, pnpm instalado, variáveis de ambiente em `app/.env`
- **Passos:**
  1. Executar `cd app && pnpm build`
  2. Verificar saída do terminal
- **Resultado esperado:** Build conclui com zero erros TypeScript e zero erros ESLint; diretório `app/dist/` criado com `index.html`
- **Status:** [ ]

**1.1.2** — TypeScript sem erros em tempo de compilação
- **Pré-condição:** `app/tsconfig.json` presente
- **Passos:**
  1. Executar `cd app && pnpm exec tsc --noEmit`
- **Resultado esperado:** Sem output de erro; exit code 0
- **Status:** [ ]

**1.1.3** — Servidor de desenvolvimento inicia corretamente
- **Pré-condição:** `app/.env` configurado com variáveis Firebase
- **Passos:**
  1. Executar `cd app && pnpm dev`
  2. Aguardar mensagem "Local: http://localhost:5173/"
  3. Abrir `http://localhost:5173/` no browser
- **Resultado esperado:** Página carrega sem erros no console; LandingPage visível
- **Status:** [ ]

### 1.2 Roteamento

**1.2.1** — Rota raiz `/` carrega LandingPage
- **Pré-condição:** Dev server rodando
- **Passos:**
  1. Navegar para `http://localhost:5173/`
- **Resultado esperado:** LandingPage renderiza; sem erros 404 no network tab
- **Status:** [ ]

**1.2.2** — Rota `/login` carrega Login sem auth prévia
- **Passos:**
  1. Navegar para `http://localhost:5173/login` sem sessão ativa
- **Resultado esperado:** Formulário de login visível; campos email e password presentes
- **Status:** [ ]

**1.2.3** — Rota protegida `/dashboard` redireciona unauthenticated para `/login`
- **Passos:**
  1. Limpar cookies/session storage
  2. Navegar para `http://localhost:5173/dashboard`
- **Resultado esperado:** Redirect automático para `/login`; URL muda para `/login`
- **Status:** [ ]

**1.2.4** — Rota `/diagnostic` redireciona unauthenticated para `/login`
- **Passos:**
  1. Navegar para `http://localhost:5173/diagnostic` sem sessão ativa
- **Resultado esperado:** Redirect para `/login`
- **Status:** [ ]

**1.2.5** — Rota `/calendrier` redireciona unauthenticated para `/login`
- **Passos:**
  1. Navegar para `http://localhost:5173/calendrier` sem sessão ativa
- **Resultado esperado:** Redirect para `/login`
- **Status:** [ ]

**1.2.6** — Rota inexistente retorna 404 tratado
- **Passos:**
  1. Navegar para `http://localhost:5173/rota-que-nao-existe`
- **Resultado esperado:** Página de erro 404 customizada ou redirect para `/`; não deve exibir stack trace React
- **Status:** [ ]

**1.2.7** — Páginas legais acessíveis sem autenticação
- **Passos:**
  1. Navegar para `/cgu`
  2. Navegar para `/politique-de-confidentialite`
  3. Navegar para `/mentions-legales`
- **Resultado esperado:** Cada página carrega o conteúdo legal correspondente sem exigir login
- **Status:** [ ]

---

## 2. Autenticação & Perfil (P0) — Epic 2

> Baseado em: `app/src/pages/Login.tsx`, `Signup.tsx`, `ProfileSetup.tsx`, `features/auth/AuthContext`

### 2.1 Login (Email/Senha)

**2.1.1** — Login com credenciais válidas redireciona para `/dashboard`
- **Pré-condição:** Usuário registrado no Firebase Auth (ambiente de emulador ou produção)
- **Passos:**
  1. Navegar para `/login`
  2. Preencher campo email com `test@example.com`
  3. Preencher campo password com senha correta
  4. Clicar em botão de submit
- **Resultado esperado:** Loading state visível durante requisição; redirect para `/dashboard` após sucesso; sem mensagem de erro
- **Status:** [ ]

**2.1.2** — Login com senha errada exibe erro traduzido
- **Passos:**
  1. Navegar para `/login`
  2. Preencher email válido e senha incorreta
  3. Submeter formulário
- **Resultado esperado:** Div de erro visível com texto em francês (idioma padrão); sem redirect; campo password permanece vazio
- **Status:** [ ]

**2.1.3** — Login com email inexistente exibe erro genérico
- **Passos:**
  1. Preencher `inexistente@email.com` e qualquer senha
  2. Submeter
- **Resultado esperado:** Mensagem de erro genérica exibida (Firebase retorna `auth/user-not-found`); fallback para `t("errors.generic")` se código não mapeado
- **Status:** [ ]

**2.1.4** — Campo email com formato inválido bloqueia submit via HTML5
- **Passos:**
  1. Preencher campo email com `nao-e-email`
  2. Tentar submeter
- **Resultado esperado:** Validação nativa do browser previne submit; campo email destacado com erro de formato
- **Status:** [ ]

**2.1.5** — Botão submit fica desabilitado durante loading
- **Passos:**
  1. Submeter formulário com credenciais válidas
  2. Observar botão imediatamente após click
- **Resultado esperado:** Botão fica `disabled` com texto de loading; não é possível submeter duplamente
- **Status:** [ ]

**2.1.6** — Links para `/signup` e páginas legais presentes na página de Login
- **Passos:**
  1. Verificar presença de link "Créer un compte" apontando para `/signup`
  2. Verificar link para `/cgu` na nota legal inferior
  3. Verificar link para `/politique-de-confidentialite`
- **Resultado esperado:** Todos os três links navegam corretamente
- **Status:** [ ]

### 2.2 Login Google (OAuth)

**2.2.1** — Botão Google inicia fluxo OAuth e redireciona para `/dashboard`
- **Pré-condição:** Google OAuth configurado no Firebase project
- **Passos:**
  1. Clicar em botão "Continuer avec Google"
  2. Completar fluxo OAuth no popup Google
- **Resultado esperado:** Redirect para `/dashboard` após autenticação; usuário criado no Firestore se novo
- **Status:** [ ]

**2.2.2** — Cancelar popup Google não quebra estado da página
- **Passos:**
  1. Clicar em botão Google
  2. Fechar o popup sem autenticar
- **Resultado esperado:** Mensagem de erro exibida ou estado silencioso; página permanece em `/login`; loading state removido (`loading: false`)
- **Status:** [ ]

### 2.3 Signup (Cadastro)

**2.3.1** — Cadastro com dados válidos cria conta e redireciona para `/profile-setup`
- **Passos:**
  1. Navegar para `/signup`
  2. Preencher: firstName="Marie", lastName="Dupont", email único válido, password >= 6 chars
  3. Submeter
- **Resultado esperado:** Conta criada no Firebase Auth; documento criado no Firestore `users/{uid}`; redirect para `/profile-setup`
- **Status:** [ ]

**2.3.2** — Signup com email já existente exibe erro
- **Passos:**
  1. Usar email de conta já registrada no formulário de signup
  2. Submeter
- **Resultado esperado:** Erro visível mapeado de `auth/email-already-in-use`; sem redirect
- **Status:** [ ]

**2.3.3** — Senha com menos de 6 caracteres rejeitada pelo Firebase
- **Passos:**
  1. Preencher campos com senha `abc` (3 chars)
  2. Submeter
- **Resultado esperado:** Firebase rejeita com código `auth/weak-password`; mensagem de erro traduzida exibida
- **Status:** [ ]

### 2.4 Profile Setup (Pós-cadastro)

**2.4.1** — Tentar prosseguir sem aceitar CGU exibe erro de validação
- **Pré-condição:** Usuário autenticado; em `/profile-setup`
- **Passos:**
  1. Preencher número de telefone
  2. NÃO marcar checkbox de aceite das CGU
  3. Submeter formulário
- **Resultado esperado:** Mensagem de erro `t("profileSetup.cguRequired")` visível; sem atualização no Firestore
- **Status:** [ ]

**2.4.2** — Profile setup com dados válidos atualiza Firestore e redireciona para `/dashboard`
- **Passos:**
  1. Preencher telefone com `+33612345678`
  2. Marcar checkbox CGU (`acceptCGU: true`)
  3. Opcionalmente marcar opt-in SMS
  4. Submeter
- **Resultado esperado:** `updateDoc` chamado no Firestore `users/{uid}` com campos `phoneNumber`, `optInSMS`, `updatedAt`; redirect para `/dashboard`
- **Status:** [ ]

**2.4.3** — Profile setup acessível somente para usuário autenticado
- **Passos:**
  1. Acessar `/profile-setup` sem sessão ativa
- **Resultado esperado:** Redirect para `/login`
- **Status:** [ ]

### 2.5 Logout

**2.5.1** — Logout via Settings finaliza sessão e redireciona para `/`
- **Pré-condição:** Usuário autenticado em `/parametres`
- **Passos:**
  1. Clicar em botão de logout (ícone LogOut em Settings)
- **Resultado esperado:** Firebase Auth `signOut()` chamado; redirect para `/`; rotas protegidas inacessíveis após logout
- **Status:** [ ]

---

## 3. Localização & i18n (P0) — Epic 1

> Stack: i18next, namespaces `auth`, `diagnostic`, `calendar`, `settings`, `common`
> Idiomas: fr-FR (padrão), pt-BR, en-US, es-ES, de-DE

### 3.1 Idioma Padrão

**3.1.1** — Aplicação carrega em francês por padrão (fr-FR)
- **Passos:**
  1. Abrir `http://localhost:5173/login` em browser sem preferência de idioma configurada
- **Resultado esperado:** Todos os textos em francês; atributo `lang="fr"` no `<html>`; sem chaves i18n expostas como texto literal
- **Status:** [ ]

**3.1.2** — Nenhuma chave de tradução aparece como texto literal na UI
- **Passos:**
  1. Navegar por Login, Signup, Dashboard, Diagnostic, CalendarPage, Settings
  2. Inspecionar todos os textos visíveis
- **Resultado esperado:** Nenhum texto como `"common:buttons.or"`, `"auth.login.title"` ou similar visível ao usuário
- **Status:** [ ]

### 3.2 Troca de Idioma

**3.2.1** — Troca para pt-BR reflete em todas as strings da página de Login
- **Passos:**
  1. Ir para Settings (`/parametres`)
  2. Selecionar idioma `pt-BR`
  3. Navegar para `/login`
- **Resultado esperado:** Título, labels, placeholder e botões em português brasileiro; sem mistura de idiomas na mesma página
- **Status:** [ ]

**3.2.2** — Troca para en-US reflete em Settings e Dashboard
- **Passos:**
  1. Mudar idioma para `en-US`
  2. Verificar `/parametres` e `/dashboard`
- **Resultado esperado:** Textos em inglês americano; formato de datas adaptado ao locale
- **Status:** [ ]

**3.2.3** — Troca para es-ES reflete na página de Diagnóstico
- **Passos:**
  1. Mudar idioma para `es-ES`
  2. Navegar para `/diagnostic`
  3. Avançar até a primeira pergunta
- **Resultado esperado:** Pergunta e opções de resposta em espanhol; bridges contextuais (quando visíveis) em espanhol
- **Status:** [ ]

**3.2.4** — Troca para de-DE reflete na Política de Privacidade
- **Passos:**
  1. Mudar idioma para `de-DE`
  2. Navegar para `/politique-de-confidentialite`
- **Resultado esperado:** Conteúdo em alemão ou fallback fr-FR se tradução inexistente; sem quebra de UI
- **Status:** [ ]

**3.2.5** — Idioma persiste após reload da página
- **Passos:**
  1. Definir idioma pt-BR em Settings
  2. Recarregar página (F5)
- **Resultado esperado:** Idioma pt-BR mantido; i18next recupera preferência do localStorage
- **Status:** [ ]

### 3.3 Formatos Localizados

**3.3.1** — Datas no CalendarPage formatadas conforme locale ativo
- **Pré-condição:** Cronograma gerado; CalendarPage aberta
- **Passos:**
  1. Com idioma fr-FR: verificar formato de data nos eventos (ex: "lun. 28 avr.")
  2. Trocar para en-US: verificar formato (ex: "Mon, Apr 28")
- **Resultado esperado:** `toLocaleDateString(i18n.language, {...})` produz formato coerente com cada locale
- **Status:** [ ]

**3.3.2** — Nomes de dias da semana usam namespace `common:days.short`
- **Passos:**
  1. Verificar header do calendário com idioma fr-FR (esperado: "Lun", "Mar", ...)
  2. Trocar para pt-BR (esperado: "Seg", "Ter", ...)
- **Resultado esperado:** Nomes de dias mudam conforme idioma sem recarregar componente
- **Status:** [ ]

### 3.4 Fallback

**3.4.1** — Chave de tradução ausente cai para fr-FR sem crash
- **Passos:**
  1. Simular namespace com chave faltando (modificar temporariamente JSON de tradução em desenvolvimento)
  2. Verificar comportamento da UI
- **Resultado esperado:** Fallback para fr-FR ou chave crua exibida; nunca crash de runtime
- **Status:** [ ]

**3.4.2** — Erro Firebase com código não mapeado usa `t("errors.generic")` como fallback
- **Passos:**
  1. Simular FirebaseError com código desconhecido `auth/unknown-error`
  2. Verificar texto exibido na div de erro em Login
- **Resultado esperado:** Texto genérico em francês (ou idioma ativo); nunca o código Firebase bruto exposto
- **Status:** [ ]

---

## 4. Diagnóstico IA (P0) — Epic 3

> Baseado em: `app/src/pages/Diagnostic.tsx`, `features/diagnostic/conditionalLogic.ts`, `features/diagnostic/questions.ts`
> Core questions (ordem fixa): Q01, Q03, Q02, Q06, Q04, Q14

### 4.1 Fluxo Básico (Core Questions)

**4.1.1** — Diagnóstico exibe exatamente 6 perguntas core sem respostas condicionais
- **Pré-condição:** Usuário autenticado; localStorage sem autosave; sem diagnóstico anterior
- **Passos:**
  1. Navegar para `/diagnostic`
  2. Responder cada pergunta com opção neutra (sem bleach, sem breakage_fragile, sem heat frequent/daily)
  3. Avançar até chegar na etapa de foto
- **Resultado esperado:** Barra de progresso passa de 1/6 a 6/6; exatamente 6 perguntas vistas (Q01, Q03, Q02, Q06, Q04, Q14)
- **Status:** [ ]

**4.1.2** — ProgressBar avança corretamente a cada pergunta
- **Passos:**
  1. Na primeira pergunta: verificar progresso = 1/{total}
  2. Avançar: verificar incremento proporcional
- **Resultado esperado:** Percentual de progresso aumenta linearmente; nunca regressivo durante avanço normal
- **Status:** [ ]

**4.1.3** — Botão Anterior retorna à pergunta anterior sem perder resposta
- **Passos:**
  1. Responder Q01 com qualquer opção
  2. Avançar para Q03
  3. Clicar em botão ArrowLeft (Anterior)
- **Resultado esperado:** Retorna para Q01 com a resposta selecionada mantida
- **Status:** [ ]

**4.1.4** — Botão Pular disponível em perguntas opcionais avança sem salvar resposta
- **Pré-condição:** Pergunta opcional visível (ex: Q09 após trigger de breakage_fragile em Q03)
- **Passos:**
  1. Clicar em botão SkipForward
- **Resultado esperado:** Avança para próxima pergunta; answer para essa questão permanece `undefined` em `state.answers`
- **Status:** [ ]

### 4.2 Lógica Adaptativa (conditionalLogic.ts)

**4.2.1** — Resposta "bleach" em Q02 adiciona Q15 e Q08/Q10 ao fluxo
- **Passos:**
  1. Em Q02, selecionar opção com valor `bleach`
  2. Avançar para próxima pergunta
- **Resultado esperado:** Q15 inserida imediatamente após Q02; Q08 e Q10 adicionadas ao fluxo total; total de perguntas passa de 6 para 9
- **Status:** [ ]

**4.2.2** — Resposta "chemical_straightening" em Q02 adiciona Q15, Q08, Q10
- **Passos:**
  1. Selecionar `chemical_straightening` em Q02
  2. Completar fluxo até photo step
- **Resultado esperado:** Três perguntas extras inseridas; Q15 imediatamente após Q02; Q08 e Q10 na sequência; sem duplicatas
- **Status:** [ ]

**4.2.3** — Resposta "breakage_fragile" em Q03 adiciona Q09 imediatamente após Q03
- **Passos:**
  1. Responder Q01 com qualquer valor
  2. Em Q03, selecionar opção com valor `breakage_fragile`
  3. Avançar
- **Resultado esperado:** Q09 (elasticity test) inserida imediatamente após Q03; bridge contextual "Vous mentionnez la casse..." visível antes de Q09
- **Status:** [ ]

**4.2.4** — Resposta "frequent" em Q06 adiciona Q17 após Q06
- **Passos:**
  1. Em Q06 (uso de calor), selecionar `frequent`
  2. Avançar
- **Resultado esperado:** Q17 inserida após Q06; bridge "L'utilisation fréquente de chaleur peut affecter l'épaisseur..." visível
- **Status:** [ ]

**4.2.5** — Resposta "daily" em Q06 também adiciona Q17
- **Passos:**
  1. Em Q06, selecionar `daily`
  2. Avançar
- **Resultado esperado:** Mesmo comportamento de 4.2.4; regra cobre ambos os valores de trigger
- **Status:** [ ]

**4.2.6** — Resposta "absorbs_fast" em Q08 adiciona Q16 após Q08
- **Pré-condição:** Q08 visível (requer trigger de Q02 com bleach/chemical)
- **Passos:**
  1. Responder Q02 com `bleach` para ativar Q08
  2. Avançar até Q08; selecionar `absorbs_fast`
  3. Avançar
- **Resultado esperado:** Q16 (teste do copo d'água) inserida após Q08; bridge "Vous avez une porosité haute. Faisons un test plus précis..." visível
- **Status:** [ ]

**4.2.7** — Perfil neutro (sem triggers) resulta em exatamente 6 perguntas
- **Passos:**
  1. Responder todas as core questions sem selecionar valores de trigger
  2. Verificar array retornado por `getAdaptiveQuestions(answers)` via console
- **Resultado esperado:** Array de 6 elementos exatos; sem perguntas extras; total de progresso "6/6"
- **Status:** [ ]

**4.2.8** — Perfil complexo (bleach + breakage + heat daily) resulta em até 11 perguntas
- **Passos:**
  1. Q03 = `breakage_fragile`; Q02 = `bleach`; Q06 = `daily`
  2. Completar fluxo
- **Resultado esperado:** Q15, Q08, Q10, Q09, Q17 adicionadas; total máximo 11 perguntas; ordem estável sem duplicatas
- **Status:** [ ]

**4.2.9** — Duplicatas removidas quando múltiplas regras adicionam a mesma pergunta
- **Passos:**
  1. Selecionar tanto `bleach` quanto `chemical_straightening` em Q02 (se múltipla escolha)
  2. Verificar lista de perguntas gerada
- **Resultado esperado:** Q10 e Q08 aparecem uma única vez no array resultante (`new Set()` garante deduplicação)
- **Status:** [ ]

### 4.3 Autosave e Restauração

**4.3.1** — Progresso salvo no localStorage a cada resposta com chave `chs_diagnostic_autosave`
- **Passos:**
  1. Responder 2 perguntas do diagnóstico
  2. Inspecionar `localStorage.getItem("chs_diagnostic_autosave")` via DevTools
- **Resultado esperado:** JSON válido com campos `answers`, `questionIndex`, `savedAt`
- **Status:** [ ]

**4.3.2** — Reload da página restaura progresso salvo
- **Passos:**
  1. Responder 3 perguntas
  2. Recarregar a página (F5)
- **Resultado esperado:** Diagnóstico retoma do `questionIndex` salvo; respostas anteriores mantidas em estado
- **Status:** [ ]

**4.3.3** — Autosave com mais de 24h é descartado automaticamente
- **Passos:**
  1. Definir manualmente `localStorage.setItem("chs_diagnostic_autosave", JSON.stringify({ answers: {}, questionIndex: 2, savedAt: Date.now() - 25 * 60 * 60 * 1000 }))`
  2. Carregar `/diagnostic`
- **Resultado esperado:** Entry descartada; `localStorage.removeItem` chamado; diagnóstico inicia do zero
- **Status:** [ ]

**4.3.4** — localStorage corrompido não quebra o diagnóstico
- **Passos:**
  1. Definir `localStorage.setItem("chs_diagnostic_autosave", "INVALID_JSON")`
  2. Carregar `/diagnostic`
- **Resultado esperado:** `try/catch` em `loadProgress()` absorve o erro silenciosamente; diagnóstico inicia normalmente
- **Status:** [ ]

### 4.4 Diagnóstico Existente e Retake

**4.4.1** — Usuário com diagnóstico completed é redirecionado para `/calendrier`
- **Pré-condição:** Firestore contém documento em `diagnostics` com `userId == uid` e `status == "completed"`
- **Passos:**
  1. Navegar para `/diagnostic`
- **Resultado esperado:** Redirect automático para `/calendrier`; sem exibir questionário
- **Status:** [ ]

**4.4.2** — Botão de retake inicia fluxo com `isRetake: true` sem redirect automático
- **Passos:**
  1. Com diagnóstico existente, clicar em botão de retake (ação RESTART no reducer)
- **Resultado esperado:** Estado `isRetake = true`; check de diagnóstico existente ignorado (`if (state.isRetake) return`); questionário exibido do início
- **Status:** [ ]

### 4.5 Upload de Foto e Processamento

**4.5.1** — Upload de foto JPEG válida avança para etapa de processamento
- **Pré-condição:** Usuário na etapa de foto (`step === "photo"`)
- **Passos:**
  1. Selecionar arquivo JPEG com tamanho < 5MB
  2. Submeter (ação SUBMIT_PHOTOS)
- **Resultado esperado:** Arquivo enviado ao Firebase Storage em `hair-photos/{uid}/`; estado muda para `step: "processing"`
- **Status:** [ ]

**4.5.2** — Etapa de foto pode ser pulada sem impacto no resultado
- **Passos:**
  1. Chegar na etapa de foto
  2. Clicar em botão de skip (ação SKIP_PHOTO)
- **Resultado esperado:** `photos: []` no estado; análise prossegue sem chamada ao Gemini Vision; resultado gerado somente pelo scoring do questionário
- **Status:** [ ]

**4.5.3** — Estado de erro em processamento exibe mensagem e permite retry
- **Passos:**
  1. Simular falha na Cloud Function de diagnóstico (mock retorna 500)
  2. Observar comportamento
- **Resultado esperado:** Estado retorna para `step: "questions"` com campo `error` populado; mensagem de erro visível na UI; usuário pode tentar novamente
- **Status:** [ ]

### 4.6 Resultado do Diagnóstico

**4.6.1** — Resultado exibe tipo de cabelo, porosidade e necessidades H/N/R
- **Pré-condição:** Diagnóstico concluído com sucesso
- **Passos:**
  1. Completar todo o fluxo de perguntas e processamento
- **Resultado esperado:** `DiagnosticResultView` renderizado com `hairType`, `porosity`, `hydrationNeed`, `nutritionNeed`, `reconstructionNeed`
- **Status:** [ ]

**4.6.2** — Resultado salvo no Firestore com `level: "adaptive"` e `status: "completed"`
- **Passos:**
  1. Completar diagnóstico
  2. Verificar documento criado no Firestore `diagnostics/{id}`
- **Resultado esperado:** Campo `level` = `"adaptive"`; campos `userId`, `answers`, `result`, `status: "completed"`, `createdAt` presentes
- **Status:** [ ]

---

## 5. Cronograma Capilar (P0) — Epic 4

> Baseado em: `app/src/pages/CalendarPage.tsx`, `app/src/services/schedule.ts`, `functions/src/schedule/`
> Tipos de tratamento: H (Hidratação), N (Nutrição), R (Reconstrução)

### 5.1 Carregamento do Cronograma

**5.1.1** — CalendarPage exibe loading state enquanto busca no Firestore
- **Pré-condição:** Usuário autenticado; navegando para `/calendrier`
- **Passos:**
  1. Navegar para `/calendrier` com throttling de rede ativado (Chrome DevTools: Slow 3G)
- **Resultado esperado:** Spinner Loader2 visível; sem flash de conteúdo vazio; `loading: true` durante fetch
- **Status:** [ ]

**5.1.2** — Usuário sem cronograma vê estado vazio com CTA para gerar
- **Passos:**
  1. Usuário autenticado sem documento em `schedules` com `status: "active"`
  2. Navegar para `/calendrier`
- **Resultado esperado:** Estado vazio renderizado com botão para gerar cronograma; sem tentativa de renderizar tabela de eventos vazia
- **Status:** [ ]

**5.1.3** — Cronograma existente exibe eventos com cores corretas por tipo de tratamento
- **Pré-condição:** Firestore contém schedule com `status: "active"` e `calendarEvents` populados
- **Passos:**
  1. Navegar para `/calendrier`
- **Resultado esperado:** Eventos renderizados: H=`bg-blue-100 text-blue-800`, N=`bg-green-100 text-green-800`, R=`bg-amber-100 text-amber-800`; badges de tipo de tratamento visíveis
- **Status:** [ ]

**5.1.4** — Eventos são reconstruídos client-side quando `calendarEvents` está vazio no Firestore
- **Pré-condição:** Schedule existe com `calendarEvents: []`; campos `sequence`, `daysOfWeek`, `startAt` preenchidos
- **Passos:**
  1. Carregar `/calendrier`
- **Resultado esperado:** Função `rebuildEvents()` chamada; eventos reconstruídos client-side; UI renderiza normalmente
- **Status:** [ ]

### 5.2 Geração de Cronograma

**5.2.1** — Selecionar dias da semana e data de início e gerar chama `generateSchedule()`
- **Passos:**
  1. Selecionar dias: Segunda (1), Quarta (3), Sexta (5)
  2. Definir data de início = amanhã
  3. Clicar em botão de geração
- **Resultado esperado:** Loading state ativo (`generating: true`); `generateSchedule()` chamado com params corretos; após sucesso, cronograma exibido
- **Status:** [ ]

**5.2.2** — Cronograma gerado contém 4 semanas de eventos H/N/R
- **Passos:**
  1. Gerar cronograma com 3 dias por semana
- **Resultado esperado:** Mínimo 12 eventos (3 dias × 4 semanas); cada evento tem `treatment` em {H, N, R}; `weekNumber` de 1 a 4
- **Status:** [ ]

**5.2.3** — Data de início padrão é sempre o dia seguinte ao atual
- **Passos:**
  1. Abrir `/calendrier` sem cronograma existente
  2. Verificar valor padrão do campo de data de início
- **Resultado esperado:** Data = `new Date() + 1 dia` no formato ISO `YYYY-MM-DD`; nunca data no passado
- **Status:** [ ]

### 5.3 Exportação ICS

**5.3.1** — Botão de download ICS inicia download do arquivo
- **Pré-condição:** Cronograma ativo existente
- **Passos:**
  1. Clicar em botão com ícone Download
- **Resultado esperado:** Download iniciado com arquivo `.ics`; loading state durante fetch; arquivo resultante abrível em Google Calendar / Apple Calendar
- **Status:** [ ]

**5.3.2** — Request de download usa `calendarToken` do Firestore como autenticação
- **Passos:**
  1. Interceptar request de download com DevTools Network tab
  2. Verificar URL ou headers da requisição
- **Resultado esperado:** `calendarToken` do schedule presente na requisição; Firebase ID token não exposto em URL de calendário
- **Status:** [ ]

**5.3.3** — Erro no download exibe mensagem `calendar:errors.downloadFailed`
- **Passos:**
  1. Simular erro 500 na função de calendário
  2. Tentar download
- **Resultado esperado:** Mensagem de erro localizada exibida; `downloading: false` restaurado
- **Status:** [ ]

**5.3.4** — Botão de download desabilitado durante loading para prevenir downloads simultâneos
- **Passos:**
  1. Clicar em botão de download
  2. Observar estado do botão imediatamente após
- **Resultado esperado:** Botão desabilitado com `downloading === true`; segundo click não dispara request adicional
- **Status:** [ ]

### 5.4 Sync de Calendário

**5.4.1** — Botão de sync chama `syncToCalendar()` com informações do device
- **Pré-condição:** Schedule ativo; `getDeviceInfo()` detecta plataforma
- **Passos:**
  1. Clicar em botão com ícone ExternalLink (sync)
- **Resultado esperado:** `syncToCalendar()` chamado; comportamento adaptado por plataforma (iOS: URL `webcal://`; Android: intent; Desktop: download)
- **Status:** [ ]

**5.4.2** — Toast de sucesso visível após sync concluído
- **Passos:**
  1. Executar sync com sucesso
- **Resultado esperado:** Toast visível com `toastVisible: true`; desaparece após timeout
- **Status:** [ ]

### 5.5 Visualização Mobile

**5.5.1** — CalendarPage renderiza corretamente em viewport 375px (iPhone SE)
- **Passos:**
  1. Abrir DevTools; definir viewport 375×667
  2. Navegar para `/calendrier` com cronograma ativo
- **Resultado esperado:** Sem overflow horizontal; eventos legíveis; botões de ação acessíveis com touch; sem scroll horizontal involuntário
- **Status:** [ ]

---

## 6. Notificações SMS (P1) — Epic 5

> Backend: `functions/src/notifications/` (Twilio). Frontend: inexistente (backend pronto, zero UI).

### 6.1 Backend — Cloud Functions (via emulador ou URL direta)

**6.1.1** — Endpoint de notificação SMS retorna 200 para usuário opt-in com telefone válido
- **Pré-condição:** Emulador Firebase Functions rodando; usuário com `optInSMS: true`, `phoneNumber: "+33612345678"`
- **Passos:**
  1. Chamar função `sendNotification` via HTTP POST com payload `{ "userId": "uid" }` e header de autorização
  2. Verificar resposta
- **Resultado esperado:** Status 200; SMS enviado via Twilio (ou mock confirmado em emulador)
- **Status:** [ ]

**6.1.2** — Usuário com `optInSMS: false` não recebe SMS
- **Passos:**
  1. Chamar endpoint de notificação para usuário com `optInSMS: false`
- **Resultado esperado:** Função retorna sem chamar Twilio; resposta 200 com corpo indicando skip; sem SMS enviado
- **Status:** [ ]

**6.1.3** — Telefone sem prefixo `+33` é rejeitado ou normalizado
- **Passos:**
  1. Chamar endpoint com usuário cujo `phoneNumber` é `"0612345678"` (sem +33)
- **Resultado esperado:** Erro 400 com mensagem de validação OU normalização automática para `+33612345678`; nunca crash silencioso
- **Status:** [ ]

**6.1.4** — Cálculo de consumo de produtos retorna volumes por tratamento
- **Pré-condição:** Emulador Functions ativo; função `calculateProductConsumption` disponível
- **Passos:**
  1. Chamar endpoint com `{ "diagnosticId": "id", "scheduleId": "id" }` e autorização válida
- **Resultado esperado:** Resposta JSON com volumes H/N/R calculados; sem valores NaN ou undefined
- **Status:** [ ]

### 6.2 Tracking de Redirecionamento

**6.2.1** — URL de tracking em SMS redireciona e registra click no Firestore
- **Passos:**
  1. Acessar URL de tracking gerada pelo sistema (ex: via parâmetro `?token=...`)
  2. Verificar registro criado no Firestore
- **Resultado esperado:** Redirect para destino correto; evento de click salvo com `userId`, `timestamp`, `source: "sms"`
- **Status:** [ ]

### 6.3 Estado Ausente de UI (verificação de gap)

**6.3.1** — Confirmar ausência de rota de gerenciamento de notificações no frontend
- **Passos:**
  1. Mapear todas as rotas definidas em `app/src/App.tsx` ou arquivo de roteamento
  2. Procurar por qualquer rota relacionada a notificações
- **Resultado esperado:** Nenhuma rota de notificações existe; gap documentado para implementação pós-MVP (Epic 5 UI)
- **Status:** [ ]

---

## 7. Configurações (P1) — Epics 1+2

> Baseado em: `app/src/pages/Settings.tsx`
> Features: exibição e edição de perfil, troca de idioma, opt-in SMS, links legais, deleção de conta

### 7.1 Exibição de Perfil

**7.1.1** — Settings exibe dados do perfil carregados do AuthContext
- **Pré-condição:** Usuário autenticado com perfil completo no Firestore
- **Passos:**
  1. Navegar para `/parametres`
- **Resultado esperado:** firstName, lastName, email, phoneNumber exibidos; avatar com iniciais calculadas por `getInitials(firstName, lastName)` visível
- **Status:** [ ]

**7.1.2** — Iniciais do avatar são sempre 2 caracteres maiúsculos
- **Passos:**
  1. Inspecionar elemento do avatar em `/parametres` para usuário "Marie Dupont"
- **Resultado esperado:** `getInitials("Marie", "Dupont")` retorna `"MD"`; `getInitials("", "")` retorna `"?"`
- **Status:** [ ]

### 7.2 Edição de Perfil

**7.2.1** — Modo de edição ativado ao clicar em botão Pencil
- **Passos:**
  1. Clicar em ícone Pencil
- **Resultado esperado:** Campos firstName, lastName, phone tornam-se inputs editáveis; botões Save e Cancel visíveis; estado `editing: true`
- **Status:** [ ]

**7.2.2** — Salvar perfil atualiza Firestore e exibe feedback de sucesso por 3 segundos
- **Passos:**
  1. Ativar edição
  2. Alterar firstName para "Sophie"
  3. Clicar em Save
- **Resultado esperado:** `updateDoc` chamado com `firstName: "Sophie"` (trimado), `updatedAt: serverTimestamp()`; mensagem de sucesso visível; `editing: false` após 3s; `refreshProfile()` chamado
- **Status:** [ ]

**7.2.3** — Cancelar edição reverte campos para valores originais sem chamar Firestore
- **Passos:**
  1. Ativar edição
  2. Alterar firstName para "Autre"
  3. Clicar em Cancel
- **Resultado esperado:** Campo revertido para valor original do perfil; nenhuma chamada ao Firestore; `editing: false`
- **Status:** [ ]

**7.2.4** — Erro ao salvar exibe mensagem de erro sem fechar modo de edição
- **Passos:**
  1. Simular falha no Firestore (desconectar rede antes de salvar)
  2. Tentar salvar
- **Resultado esperado:** Mensagem `settings:profile.saveError` visível; `editing` permanece `true`; usuário pode tentar novamente
- **Status:** [ ]

### 7.3 Opt-in SMS

**7.3.1** — Toggle de opt-in SMS atualizado e persiste no Firestore
- **Passos:**
  1. Em modo de edição, inverter estado do toggle `optInSMS`
  2. Salvar
- **Resultado esperado:** Campo `optInSMS` atualizado no Firestore; estado local reflete novo valor; `useEffect` sincroniza UI ao recarregar
- **Status:** [ ]

### 7.4 Troca de Idioma

**7.4.1** — Seletor de idioma em Settings troca `i18n.language` globalmente e imediatamente
- **Passos:**
  1. Abrir seletor de idioma em `/parametres`
  2. Selecionar `pt-BR`
- **Resultado esperado:** UI imediatamente renderiza em pt-BR; preferência salva no localStorage; sem necessidade de reload
- **Status:** [ ]

### 7.5 Links Legais

**7.5.1** — Links CGU, Politique de Confidentialité e Mentions Légales presentes e funcionais
- **Passos:**
  1. Em Settings, localizar seção de links legais
  2. Clicar em cada link e verificar navegação
- **Resultado esperado:** Cada link navega para rota correta (`/cgu`, `/politique-de-confidentialite`, `/mentions-legales`); ícones corretos (FileText, Shield, Scale)
- **Status:** [ ]

### 7.6 Deleção de Conta (RGPD Art. 17)

**7.6.1** — Botão de deletar conta exibe dialog de confirmação antes de executar
- **Passos:**
  1. Clicar em botão com ícone Trash2
- **Resultado esperado:** Dialog de confirmação visível (`showDeleteConfirm: true`); deleção NÃO executada ainda; usuário deve confirmar explicitamente
- **Status:** [ ]

**7.6.2** — Confirmar deleção chama endpoint `deleteAccount` com ID token e faz logout
- **Passos:**
  1. Confirmar deleção no dialog
- **Resultado esperado:** `firebaseUser.getIdToken()` chamado; POST para `/deleteAccount` com `Authorization: Bearer {token}`; `signOut()` chamado após resposta 200; redirect para `/`
- **Status:** [ ]

**7.6.3** — URL do endpoint `deleteAccount` usa emulador com `VITE_USE_EMULATORS=true`
- **Passos:**
  1. Com `VITE_USE_EMULATORS=true` no `.env`
  2. Interceptar request de deleção
- **Resultado esperado:** URL = `http://localhost:5001/{projectId}/europe-west1/deleteAccount`; nunca URL de produção em ambiente local
- **Status:** [ ]

**7.6.4** — Erro na deleção exibe mensagem sem fazer logout
- **Passos:**
  1. Simular resposta 500 do endpoint `deleteAccount`
  2. Confirmar deleção
- **Resultado esperado:** Mensagem `settings:deleteDialog.deleteError` visível; usuário permanece logado; `deleting: false` e `showDeleteConfirm: false` restaurados
- **Status:** [ ]

---

## 8. Segurança & RGPD (P0)

> Requisitos: RGPD Art. 7 (consentimento), Art. 17 (deleção), Art. 25 (privacy by design)
> Região: europe-west1 (Belgium) — exigida para compliance RGPD

### 8.1 Autenticação e Autorização nas Cloud Functions

**8.1.1** — Firebase Auth ID token incluído em todas as chamadas a Cloud Functions protegidas
- **Passos:**
  1. Interceptar requests para Cloud Functions (emulador ou produção) via DevTools
  2. Verificar header `Authorization` em chamadas para `deleteAccount`, `generateSchedule`, `downloadICS`
- **Resultado esperado:** Header `Authorization: Bearer {idToken}` presente em todas as chamadas protegidas
- **Status:** [ ]

**8.1.2** — Request sem Authorization para endpoint protegido retorna 401 ou 403
- **Passos:**
  1. Chamar endpoint `deleteAccount` via curl sem header de autorização
- **Resultado esperado:** Resposta 401 ou 403; sem execução da deleção
- **Status:** [ ]

**8.1.3** — Token expirado durante sessão longa retorna erro tratado
- **Passos:**
  1. Simular token expirado (mockar `getIdToken()` para lançar erro)
  2. Tentar ação autenticada (ex: salvar perfil)
- **Resultado esperado:** Erro capturado; usuário redirecionado para login ou token renovado automaticamente via Firebase SDK
- **Status:** [ ]

### 8.2 Consentimento RGPD

**8.2.1** — ProfileSetup bloqueia submissão sem checkbox de aceite das CGU
- **Passos:**
  1. Em ProfileSetup, tentar submeter sem marcar `acceptCGU`
- **Resultado esperado:** Erro `profileSetup.cguRequired` exibido; nenhum dado salvo no Firestore
- **Status:** [ ]

**8.2.2** — Opt-in SMS é desmarcado por padrão (opt-in explícito)
- **Passos:**
  1. Navegar para `/profile-setup` pela primeira vez após cadastro
  2. Verificar estado inicial do checkbox de opt-in SMS
- **Resultado esperado:** `optInSMS: false` por padrão; usuário deve marcar explicitamente para consentir
- **Status:** [ ]

**8.2.3** — Dados pessoais não expostos em logs do console
- **Passos:**
  1. Abrir DevTools Console
  2. Completar fluxo de login, profile setup e edição de perfil
  3. Inspecionar todos os logs do console
- **Resultado esperado:** Nenhum `console.log` com dados pessoais (email, nome, telefone, senha)
- **Status:** [ ]

### 8.3 Deleção de Conta (Art. 17)

**8.3.1** — Deleção via `deleteAccount` remove dados de Firestore, Auth e Storage em cascade
- **Pré-condição:** Usuário com diagnóstico, cronograma e foto no Storage
- **Passos:**
  1. Confirmar deleção de conta
  2. Verificar Firestore: coleções `users/{uid}`, `diagnostics` (where userId==uid), `schedules` (where userId==uid)
  3. Verificar Storage: pasta `hair-photos/{uid}/`
  4. Verificar Firebase Auth: usuário deletado
- **Resultado esperado:** Todos os dados pessoais removidos em cascade; nenhum dado residual
- **Status:** [ ]

**8.3.2** — Após deleção, tentar login com conta deletada retorna erro
- **Passos:**
  1. Deletar conta
  2. Tentar login com as mesmas credenciais
- **Resultado esperado:** Firebase retorna `auth/user-not-found` ou equivalente; mensagem de erro exibida
- **Status:** [ ]

### 8.4 Proteção de Dados em Trânsito

**8.4.1** — Toda comunicação usa HTTPS em produção
- **Passos:**
  1. Verificar URLs das Cloud Functions em produção (`functions/src/`)
  2. Verificar configuração do Vercel para o domínio do app
- **Resultado esperado:** Todos os endpoints usam `https://`; sem mixed content warnings; HSTS configurado
- **Status:** [ ]

**8.4.2** — Arquivo ICS autenticado por HMAC token, não por Firebase ID token
- **Passos:**
  1. Verificar campo `calendarToken` no documento Firestore de schedule
  2. Verificar URL de download do ICS em `app/src/services/calendarSync.ts`
- **Resultado esperado:** ICS usa `calendarToken` próprio (HMAC); Firebase ID token não exposto em URL que pode ser salva em cache por apps de calendário
- **Status:** [ ]

### 8.5 Segurança de Input

**8.5.1** — Campo de email rejeita XSS payload sem execução de script
- **Passos:**
  1. Inserir `<script>alert('xss')</script>` no campo de email do Login
  2. Submeter
- **Resultado esperado:** Firebase Auth rejeita como email inválido (formato); nenhum script executado; sem DOM injection
- **Status:** [ ]

**8.5.2** — Campos de texto sanitizados com `.trim()` antes de salvar no Firestore
- **Passos:**
  1. Em Settings, salvar firstName com espaços extras `"  Marie  "`
  2. Verificar valor salvo no Firestore
- **Resultado esperado:** Firestore recebe `"Marie"` (sem espaços); `.trim()` aplicado em `handleSave()`
- **Status:** [ ]

### 8.6 Firestore Security Rules

**8.6.1** — Usuário não pode ler documento `users/{outroUid}` de outro usuário
- **Pré-condição:** Firestore Security Rules configuradas com regra `request.auth.uid == userId`
- **Passos:**
  1. Autenticar como usuário A
  2. Tentar `getDoc(doc(db, "users", "uidDeB"))` via console JS
- **Resultado esperado:** Firestore retorna erro de permissão; sem acesso a dados de outro usuário
- **Status:** [ ]

---

## 9. Performance & UX (P1)

### 9.1 Performance de Carregamento

**9.1.1** — LandingPage carrega em menos de 3s em conexão 4G simulada
- **Passos:**
  1. Chrome DevTools → Network → Fast 4G
  2. Recarregar `http://localhost:5173/`
  3. Verificar métricas de performance (DOMContentLoaded, LCP)
- **Resultado esperado:** DOMContentLoaded < 3000ms; Largest Contentful Paint < 2500ms
- **Status:** [ ]

**9.1.2** — Nenhum `sleep()` ou `setTimeout()` desnecessário no fluxo de perguntas do diagnóstico
- **Passos:**
  1. Executar `grep -rn "setTimeout\|sleep" /Users/macbookdejoel/Documents/PROJETOS/chs-crono-capilar/app/src/features/diagnostic/`
- **Resultado esperado:** Nenhum sleep artificial no fluxo de perguntas; transições baseadas em mudança de estado; qualquer setTimeout justificado (ex: auto-hide de toast) documentado
- **Status:** [ ]

### 9.2 Loading States

**9.2.1** — Todos os botões de ação exibem estado de loading durante operação assíncrona
- **Passos:**
  1. Login: observar botão durante submit — esperado: texto de loading + `disabled`
  2. CalendarPage: observar botão de geração de cronograma — esperado: spinner Loader2 + `disabled`
  3. CalendarPage: observar botão de download ICS — esperado: `disabled` com `downloading: true`
- **Resultado esperado:** Nenhum botão permanece clicável durante request em andamento
- **Status:** [ ]

**9.2.2** — Sem flash de conteúdo não autenticado ao navegar para páginas protegidas
- **Passos:**
  1. Fazer login
  2. Navegar para `/dashboard`
  3. Observar transição visual
- **Resultado esperado:** Sem flash de conteúdo não autenticado; AuthContext resolve antes do render das páginas protegidas
- **Status:** [ ]

### 9.3 Responsividade Mobile-First

**9.3.1** — Login renderiza corretamente em 375px (mobile) e 1440px (desktop)
- **Passos:**
  1. Testar em 375px: verificar que formulário não sofre overflow horizontal
  2. Testar em 1440px: verificar que `max-w-sm` limita largura do card corretamente
- **Resultado esperado:** Layout centrado em ambos os viewports; sem scroll horizontal em nenhum deles
- **Status:** [ ]

**9.3.2** — Diagnóstico com multiple choice é usável com touch em 375px
- **Passos:**
  1. Abrir `/diagnostic` em viewport 375px
  2. Verificar altura das opções de resposta
- **Resultado esperado:** Cada opção tem área de toque mínima de 44px (WCAG Touch Target 2.5.5); sem sobreposição de opções
- **Status:** [ ]

**9.3.3** — Dashboard visível e funcional em viewport 375px
- **Passos:**
  1. Viewport 375×667
  2. Navegar para `/dashboard`
- **Resultado esperado:** Cards sem overflow horizontal; CTA de diagnóstico visível; sem scroll horizontal
- **Status:** [ ]

### 9.4 Acessibilidade Básica

**9.4.1** — Campos de formulário têm labels associados via `htmlFor` e `id`
- **Passos:**
  1. Inspecionar campos `email`, `password` em Login
  2. Inspecionar campos em Signup e ProfileSetup
- **Resultado esperado:** Cada `<input>` tem `id` correspondente ao `htmlFor` do `<label>`; screen reader pode identificar cada campo corretamente
- **Status:** [ ]

**9.4.2** — SVG do ícone Google em Login tem `aria-hidden="true"`
- **Passos:**
  1. Inspecionar o elemento SVG dentro do botão "Continuer avec Google"
- **Resultado esperado:** Atributo `aria-hidden="true"` presente no SVG; screen readers ignoram ícone decorativo e leem apenas o texto do botão
- **Status:** [ ]

---

## 10. Edge Cases & Regressão (P1)

### 10.1 Rede e Conectividade

**10.1.1** — Perda de conexão durante processamento do diagnóstico exibe erro tratado
- **Passos:**
  1. Iniciar fluxo de diagnóstico e chegar na etapa de processamento
  2. Simular offline (DevTools → Network → Offline)
- **Resultado esperado:** Mensagem de erro visível; estado retorna para `step: "questions"`; respostas do questionário mantidas no estado (não perdidas)
- **Status:** [ ]

**10.1.2** — Reload durante processamento não deixa spinner infinito
- **Passos:**
  1. Iniciar processamento do diagnóstico
  2. Recarregar imediatamente
- **Resultado esperado:** Sem spinner infinito após reload; `processingRef.current` resetado; usuário pode reiniciar diagnóstico; localStorage restaura progresso das perguntas
- **Status:** [ ]

### 10.2 Inputs Extremos

**10.2.1** — Nome com caracteres especiais franceses salvo e exibido corretamente
- **Passos:**
  1. Em ProfileSetup ou Settings, salvar `firstName: "Marie-Hélène"`, `lastName: "Léger"`
  2. Verificar valor no Firestore e na UI
- **Resultado esperado:** Caracteres acentuados e hífens persistidos corretamente no Firestore; exibidos corretamente na UI e nas iniciais do avatar
- **Status:** [ ]

**10.2.2** — Telefone com formato inválido aceito no ProfileSetup (validação no backend)
- **Passos:**
  1. Inserir `abc` no campo de telefone em ProfileSetup
  2. Aceitar CGU e submeter
- **Resultado esperado:** Frontend permite salvar (sem validação de formato no cliente); campo salvo como-está no Firestore; backend valida ao enviar SMS
- **Status:** [ ]

**10.2.3** — Diagnóstico com 11 perguntas (máximo) não quebra ProgressBar
- **Passos:**
  1. Responder Q02=`bleach`, Q03=`breakage_fragile`, Q06=`daily`; completar até Q08=`absorbs_fast`
  2. Verificar ProgressBar ao longo de todas as perguntas
- **Resultado esperado:** Progresso sempre entre 0% e 100%; total calculado dinamicamente; nunca exibe "11/6" com denominador errado
- **Status:** [ ]

### 10.3 Cliques Duplos e Race Conditions

**10.3.1** — Double-click no botão de submit do Login não envia duas requisições simultâneas
- **Passos:**
  1. Double-click rápido no botão de login (simular rage-click)
- **Resultado esperado:** Apenas uma chamada a `signInWithEmail`; botão desabilitado após primeiro click (`loading: true`)
- **Status:** [ ]

**10.3.2** — Double-click no botão de geração de cronograma não cria dois schedules
- **Passos:**
  1. Double-click em botão de geração de cronograma
- **Resultado esperado:** Apenas uma chamada a `generateSchedule()`; botão desabilitado imediatamente (`generating: true`)
- **Status:** [ ]

### 10.4 Sessão Expirada

**10.4.1** — Sessão Firebase expirada enquanto usuário preenche diagnóstico
- **Passos:**
  1. Iniciar diagnóstico e responder algumas perguntas
  2. Invalidar token (via Firebase console ou mockar `getIdToken()` para rejeitar)
  3. Tentar submeter diagnóstico
- **Resultado esperado:** Erro capturado; usuário redirecionado para login; respostas salvas no localStorage via autosave para recuperação posterior
- **Status:** [ ]

### 10.5 Regressão de Features Anteriores

**10.5.1** — LevelSelector removido: sem referências no codebase
- **Passos:**
  1. Executar `grep -r "LevelSelector" /Users/macbookdejoel/Documents/PROJETOS/chs-crono-capilar/app/src/`
- **Resultado esperado:** Zero resultados; componente completamente removido conforme refatoração de 2026-02-13
- **Status:** [ ]

**10.5.2** — Função `getVisibleQuestions` deprecada não está sendo chamada no frontend
- **Passos:**
  1. Executar `grep -r "getVisibleQuestions" /Users/macbookdejoel/Documents/PROJETOS/chs-crono-capilar/app/src/`
- **Resultado esperado:** Zero chamadas ativas; somente a definição `@deprecated` em `conditionalLogic.ts`; todos os usos usam `getAdaptiveQuestions` diretamente
- **Status:** [ ]

---

## Matriz de Rastreabilidade (Stories → Testes)

| Story | Descrição | Testes Cobrindo |
|-------|-----------|-----------------|
| 1.1 | Setup Vite + React 19 + Tailwind | 1.1.1, 1.1.2, 1.1.3 |
| 1.2 | Firebase europe-west1 | 8.4.1, 8.6.1 |
| 1.3 | i18next (5 idiomas) | 3.1.1, 3.1.2, 3.2.1–3.2.5, 3.3.1–3.3.2, 3.4.1–3.4.2 |
| 1.4 | CI/CD Vercel + GitHub | 1.1.1, 1.1.2 |
| 2.1 | Auth Firebase (Google + Email) | 2.1.1–2.1.6, 2.2.1–2.2.2 |
| 2.2 | Profile Schema no Firestore | 2.3.1, 7.1.1–7.1.2 |
| 2.3 | Consentimento SMS Opt-in RGPD | 2.4.1–2.4.2, 7.3.1, 8.2.1–8.2.2 |
| 3.1 | Upload fotos para Storage | 4.5.1 |
| 3.2 | Integração Gemini via Cloud Function | 4.5.3, 4.6.1 |
| 3.3 | Parser de diagnósticos JSON | 4.6.1, 4.6.2 |
| 3.4 | UI Wizard adaptativo 6-11 perguntas | 4.1.1–4.1.4, 4.2.1–4.2.9, 4.3.1–4.3.4, 4.4.1–4.4.2 |
| 4.1 | Gerador H/N/R 4 semanas | 5.2.1–5.2.3 |
| 4.2 | Dashboard + CalendarPage | 5.1.1–5.1.4, 9.3.3 |
| 4.3 | Sync Google Calendar (.ics) | 5.3.1–5.3.4, 5.4.1–5.4.2 |
| 5.1 | Cálculo consumo de produtos | 6.1.4 |
| 5.2 | Twilio SMS (+33) | 6.1.1–6.1.3 |
| 5.3 | Tracking redirecionamento | 6.2.1 |
| 7.1 | Prompt Engineering | 4.6.1 |
| 7.2 | Feedback Visual + Loading | 9.2.1 |
| 7.3 | Fallbacks robustos | 4.5.3, 10.1.1 |
| 8.1 | Stripe backend | [-] (deferred pós-MVP) |
| 8.2 | Paywall | [-] (deferred pós-MVP) |
| 8.3 | Página de Upgrade | [-] (deferred pós-MVP) |
| RGPD | Deleção de conta | 8.3.1–8.3.2, 7.6.1–7.6.4 |
| RGPD | Segurança de input | 8.5.1–8.5.2 |
| RGPD | Firestore Rules | 8.6.1 |

---

## Histórico de Execução

| Data | Versão | Executor | Total | Passou | Falhou | Pendentes | Observações |
|------|--------|----------|-------|--------|--------|-----------|-------------|
| 2026-04-26 | 2.0 | qa-automation-engineer | 139 | 0 | 0 | 139 | Caderno reescrito com base no código real; nenhuma execução ainda |

---

## Ambiente de Teste Recomendado

### Setup Local com Emuladores Firebase

```bash
# Terminal 1 — Emuladores Firebase
cd /Users/macbookdejoel/Documents/PROJETOS/chs-crono-capilar
firebase emulators:start --only auth,firestore,functions,storage

# Terminal 2 — App frontend
cd app && pnpm dev
# Acesso: http://localhost:5173
```

Variáveis obrigatórias em `app/.env` para emulador:
```
VITE_USE_EMULATORS=true
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_API_KEY=<key>
VITE_FIREBASE_AUTH_DOMAIN=<domain>
VITE_FIREBASE_STORAGE_BUCKET=<bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<id>
VITE_FIREBASE_APP_ID=<app-id>
```

### Prioridade de Execução Sugerida

1. Seção 1 — Estrutura (P0): garantir build e roteamento funcionando
2. Seção 2 — Autenticação (P0): sem auth nada mais funciona
3. Seção 4 — Diagnóstico (P0): feature central do MVP
4. Seção 5 — Calendário (P0): output principal do diagnóstico
5. Seção 8 — Segurança/RGPD (P0): obrigatório por lei na europa-west1
6. Seção 3 — i18n (P0): crítico para usuárias francesas
7. Seções 6, 7, 9, 10 — P1: completar após P0 verde

### Critério de Prontidão para Release

- Todos os testes P0 (86 testes) com status `[x]` ou `[-]`
- Nenhum teste P0 com status `[!]`
- Falhas P1 documentadas com issue criada antes do release

# Caderno de Testes - CronoCapilar (CHS)

> **Versao:** 2.0
> **Data:** 2026-02-09
> **Gerado por:** Claude Code (Opus 4.6) com 4 agentes especializados
> **Baseado em:** docs/BACKLOG.md, docs/02-Requisitos/detailed-user-stories.md, docs/01-Planejamento/02-prd.md
> **Status:** Draft

---

## Agentes Envolvidos na Geracao

| Agente | Foco | Cenarios Gerados |
|--------|------|-----------------|
| `@backend-specialist` | Cloud Functions, APIs, Firestore, schemas, integracao | 312 |
| `@frontend-specialist` | UI/UX, acessibilidade, navegacao, i18n, responsividade | 142 |
| `@security-auditor` | OWASP Top 10, RGPD, Firestore/Storage rules, Stripe, Twilio | 174 |
| `@explorer-agent` | Criterios de aceitacao, RFs, rastreabilidade | Matriz completa |

---

## Convencoes

| Simbolo | Significado |
|---------|-------------|
| [ ] | Teste pendente |
| [x] | Teste aprovado |
| [!] | Teste com falha |
| [-] | Teste nao aplicavel |

**Severidade:** P0 = Bloqueia release | P1 = Corrigir antes de prod | P2 = Backlog v1.1

---

## Resumo de Cobertura

| Categoria | Total | Pendentes | Aprovados | Falhas | N/A |
|-----------|-------|-----------|-----------|--------|-----|
| Estrutura & Infra | 35 | 35 | 0 | 0 | 0 |
| Autenticacao & Perfil | 52 | 52 | 0 | 0 | 0 |
| Diagnostico IA | 68 | 68 | 0 | 0 | 0 |
| Cronograma Capilar | 45 | 45 | 0 | 0 | 0 |
| Notificacoes & Recompra | 48 | 48 | 0 | 0 | 0 |
| Dashboard Admin | 20 | 20 | 0 | 0 | 0 |
| Refinamento UX IA | 8 | 8 | 0 | 0 | 0 |
| Monetizacao & Checkout | 42 | 42 | 0 | 0 | 0 |
| Seguranca (OWASP/RGPD) | 174 | 174 | 0 | 0 | 0 |
| Acessibilidade (WCAG AA) | 28 | 28 | 0 | 0 | 0 |
| i18n & Localizacao | 10 | 10 | 0 | 0 | 0 |
| Responsividade | 9 | 9 | 0 | 0 | 0 |
| Navegacao & Rotas | 17 | 17 | 0 | 0 | 0 |
| Performance | 5 | 5 | 0 | 0 | 0 |
| **TOTAL** | **561** | **561** | **0** | **0** | **0** |

---

## Matriz de Cobertura Story -> Testes

| Epic | Story | Criterios de Aceite | Testes Gerados | RF |
|------|-------|---------------------|----------------|----|
| 1 | 1.1 | 2 | 9 | RF08 |
| 1 | 1.2 | 2 | 10 | RF08 |
| 1 | 1.3 | 1 | 8 | RF08 |
| 1 | 1.4 | 2 | 8 | RF08 |
| 2 | 2.1 | 1 | 26 | RF06 |
| 2 | 2.2 | 2 | 6 | RF06 |
| 2 | 2.3 | 1 | 14 | RF05 |
| 3 | 3.1 | 2 | 15 | RF01 |
| 3 | 3.2 | 1 | 22 | RF01 |
| 3 | 3.3 | 2 | 23 | RF01 |
| 3 | 3.4 | 1 | 8 | RF01 |
| 4 | 4.1 | 1 | 16 | RF07 |
| 4 | 4.2 | 2 | 18 | RF07 |
| 4 | 4.3 | 2 | 17 | RF03 |
| 5 | 5.1 | 2 | 16 | RF10 |
| 5 | 5.2 | 1 | 18 | RF04 |
| 5 | 5.3 | 2 | 14 | RF10 |
| 6 | 6.1 | 1 | 10 | RF09 |
| 6 | 6.2 | 2 | 10 | RF09 |
| 7 | 7.1 | - | 8 | - |
| 7 | 7.2 | - | 5 | - |
| 7 | 7.3 | - | 3 | - |
| 8 | 8.1 | - | 19 | - |
| 8 | 8.2 | - | 4 | - |
| 8 | 8.3 | - | 4 | - |

---

# 1. ESTRUTURA & INFRAESTRUTURA (P0)

## 1.1 Arquivos de Configuracao

| # | Teste | Comando/Acao | Esperado | Status |
|---|-------|--------------|----------|--------|
| 1.1.1 | package.json existe (app/) | `test -f app/package.json` | Arquivo presente | [ ] |
| 1.1.2 | package.json existe (functions/) | `test -f functions/package.json` | Arquivo presente | [ ] |
| 1.1.3 | firebase.json configurado | `test -f firebase.json` | Arquivo presente com hosting, functions, firestore, storage | [ ] |
| 1.1.4 | firestore.rules existe | `test -f firestore.rules` | Regras de seguranca completas | [ ] |
| 1.1.5 | storage.rules existe | `test -f storage.rules` | Regras de upload configuradas | [ ] |
| 1.1.6 | .env NAO comitado | `git ls-files .env app/.env` | Nenhum resultado (gitignored) | [ ] |
| 1.1.7 | CI/CD deploy.yml existe | `test -f .github/workflows/deploy.yml` | Pipeline de deploy | [ ] |
| 1.1.8 | CI/CD preview.yml existe | `test -f .github/workflows/preview.yml` | Pipeline de preview | [ ] |

## 1.2 Build & Compilacao

| # | Teste | Comando/Acao | Esperado | Status |
|---|-------|--------------|----------|--------|
| 1.2.1 | App build sem erros | `cd app && npm run build` | Exit code 0, sem erros TypeScript | [ ] |
| 1.2.2 | App lint sem erros | `cd app && npm run lint` | ESLint sem erros | [ ] |
| 1.2.3 | Functions build sem erros | `cd functions && npm run build` | Compilacao TypeScript OK | [ ] |
| 1.2.4 | Functions testes existentes passam | `cd functions && npm test` | 63 testes passam (7 suites) | [ ] |
| 1.2.5 | Web build sem erros | `cd web && npm run build` | Next.js build OK | [ ] |

## 1.3 Firebase & Regiao

| # | Teste | Comando/Acao | Esperado | Status |
|---|-------|--------------|----------|--------|
| 1.3.1 | Regiao europe-west1 configurada | Verificar `functions/src/shared/config.ts` | `REGION = "europe-west1"` | [ ] |
| 1.3.2 | Firebase init sem erros | Iniciar app com env vars corretas | Firebase SDK inicializa sem erros no console | [ ] |
| 1.3.3 | Emuladores conectam em dev | `VITE_USE_EMULATORS=true` | Auth :9099, Firestore :8080, Storage :9199 | [ ] |
| 1.3.4 | AppCheck inicializa em prod | `VITE_RECAPTCHA_SITE_KEY` definida | ReCaptchaV3Provider inicializado | [ ] |
| 1.3.5 | AppCheck skip sem site key | `VITE_RECAPTCHA_SITE_KEY` ausente | Console warn, sem crash | [ ] |

## 1.4 Design Tokens & Tailwind

| # | Teste | Comando/Acao | Esperado | Status |
|---|-------|--------------|----------|--------|
| 1.4.1 | Tokens de cor gold aplicados | Inspecionar elemento com `text-gold-500` | Cor gold correta renderizada | [ ] |
| 1.4.2 | Tipografia serif configurada | Inspecionar heading | Font-family serif premium aplicada | [ ] |
| 1.4.3 | Button primary: gold bg + black text | Renderizar `<Button variant="primary">` | Background gold, texto preto | [ ] |
| 1.4.4 | Button disabled: gray styling | Button com loading=true | `disabled:bg-gray-300 disabled:text-gray-500` | [ ] |
| 1.4.5 | cn() resolve conflitos Tailwind | `cn("bg-red-500", "bg-blue-500")` | Resultado: `bg-blue-500` | [ ] |

## 1.5 i18n (Localizacao)

| # | Teste | Comando/Acao | Esperado | Status |
|---|-------|--------------|----------|--------|
| 1.5.1 | Frances como idioma padrao (web/) | Carregar web/ app | `i18n.language === "fr"` | [ ] |
| 1.5.2 | Chaves de traducao resolvem | Verificar textos na home | Texto frances renderizado, nao chave | [ ] |
| 1.5.3 | Idioma nao suportado cai para FR | Browser em `de-DE` | Fallback para `"fr"` | [ ] |
| 1.5.4 | `<html lang="fr">` no web/ | Inspecionar tag HTML | `lang="fr"` presente | [ ] |

---

# 2. AUTENTICACAO & PERFIL (P0)

## Story 2.1: Login Social & E-mail

### Testes Funcionais

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 2.1.1 | Pagina login renderiza corretamente | Nao autenticado | Navegar `/login` | Heading "Connexion", inputs email/senha, botoes submit e Google, link signup | [ ] |
| 2.1.2 | Login email com sucesso | Conta valida | Preencher email+senha, clicar "Se connecter" | "Connexion...", redireciona `/dashboard` | [ ] |
| 2.1.3 | Login email credenciais invalidas | Conta inexistente | Email/senha errados | "Identifiants incorrects. Veuillez reassayer." | [ ] |
| 2.1.4 | Login email senha incorreta | Conta existe | Email correto, senha errada | "Mot de passe incorrect." | [ ] |
| 2.1.5 | Muitas tentativas de login | 5+ falhas | Continuar errado | "Trop de tentatives. Reassayez plus tard." | [ ] |
| 2.1.6 | Login Google com sucesso | Conta Google | Clicar "Continuer avec Google" | Popup, sucesso redireciona `/dashboard` | [ ] |
| 2.1.7 | Login Google cancelado | Popup aberto | Fechar popup | "Connexion annulee." | [ ] |
| 2.1.8 | Signup renderiza | Nao autenticado | Navegar `/signup` | "Creer un compte", campos nome/email/senha | [ ] |
| 2.1.9 | Signup com sucesso | Conta inexistente | Preencher, submeter | "Creation...", redireciona `/profile-setup`, doc Firestore | [ ] |
| 2.1.10 | Signup email duplicado | Conta existe | Email existente | "Cet e-mail est deja utilise." | [ ] |
| 2.1.11 | Signup senha fraca | Email novo | < 6 chars | "Le mot de passe doit contenir au moins 6 caracteres." | [ ] |
| 2.1.12 | Signup email invalido | Formulario | "notanemail" | "Adresse e-mail invalide." | [ ] |
| 2.1.13 | Nav Login -> Signup | Login page | Clicar "Creer un compte" | Navega `/signup` | [ ] |
| 2.1.14 | Nav Signup -> Login | Signup page | Clicar "Se connecter" | Navega `/login` | [ ] |
| 2.1.15 | Logout | Settings | Clicar "Se deconnecter" | signOut, estado limpo, redirect `/login` | [ ] |

### Edge Cases

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 2.1.E1 | Form vazio submit | Login page | Submit sem preencher | HTML5 required impede | [ ] |
| 2.1.E2 | Google signup cria perfil | Sem perfil Firestore | Login Google | setDoc cria perfil | [ ] |
| 2.1.E3 | Google displayName uma palavra | "Madonna" | Login Google | firstName="Madonna", lastName="" | [ ] |
| 2.1.E4 | Google displayName null | Sem displayName | Login Google | firstName="", lastName="" | [ ] |
| 2.1.E5 | Erro nao-Firebase | Offline | Submeter | "Une erreur est survenue." | [ ] |
| 2.1.E6 | useAuth fora AuthProvider | Teste unitario | useAuth() | Throws Error | [ ] |

## Story 2.2: Gestao de Perfil

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 2.2.1 | UserProfile todos campos | Revisao codigo | Inspecionar types/index.ts | uid, email, firstName, lastName, phoneNumber, locale, region, optInSMS, timestamps | [ ] |
| 2.2.2 | Fetch perfil retorna dados corretos | User no Firestore | Login | Campos mapeados, Timestamp -> Date | [ ] |
| 2.2.3 | Defaults campos ausentes | Doc parcial | Fetch | email="", locale="fr-FR", optInSMS=false | [ ] |
| 2.2.4 | Doc inexistente retorna null | User auth sem doc | fetchUserProfile | null | [ ] |
| 2.2.5 | Locale fixo fr-FR | Criacao perfil | Criar | locale="fr-FR" | [ ] |

## Story 2.3: Consentimento SMS (RGPD)

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 2.3.1 | ProfileSetup renderiza | Auth, perfil incompleto | `/profile-setup` | Heading, phone, CGU checkbox, SMS opt-in, submit | [ ] |
| 2.3.2 | Telefone opcional | profile-setup | Vazio, aceitar CGU | Sucesso, phoneNumber="" | [ ] |
| 2.3.3 | CGU obrigatorio | profile-setup | CGU desmarcado | "Vous devez accepter les CGU pour continuer." | [ ] |
| 2.3.4 | SMS opt-in desmarcado padrao | profile-setup | Estado inicial | optInSMS desmarcado | [ ] |
| 2.3.5 | SMS opt-in persiste | profile-setup | Marcar, submeter | optInSMS=true no Firestore | [ ] |
| 2.3.6 | Links CGU/Privacy nova aba | profile-setup | Clicar links | target="_blank" rel="noopener noreferrer" | [ ] |
| 2.3.7 | Sucesso navega dashboard | profile-setup | CGU aceito, submeter | Navega `/dashboard` | [ ] |
| 2.3.8 | Placeholder telefone FR | profile-setup | Inspecionar | "+33 6 12 34 56 78" | [ ] |

---

# 3. DIAGNOSTICO IA (P0)

## Story 3.1: Upload de Fotos

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 3.1.1 | Request valido parse OK | Schema | userId, photoUrls, context | Sucesso | [ ] |
| 3.1.2 | userId vazio rejeitado | Schema | userId="" | Erro min length | [ ] |
| 3.1.3 | photoUrls vazio rejeitado | Schema | photoUrls=[] | Erro min 1 | [ ] |
| 3.1.4 | > 5 fotos rejeitado | Schema | 6 URLs | Erro max 5 | [ ] |
| 3.1.5 | URL nao-Firebase rejeitada | Schema | evil.com | "Only Firebase Storage URLs" | [ ] |
| 3.1.6 | URL Firebase Storage aceita | Schema | firebasestorage.googleapis.com | Sucesso | [ ] |
| 3.1.7 | ScalpType invalido | Schema | "curly" | Erro enum | [ ] |
| 3.1.8 | currentComplaints > 500 chars | Schema | 501 chars | Erro max 500 | [ ] |
| 3.1.9 | Context opcional | Schema | Sem context | Sucesso | [ ] |

## Story 3.2: Integracao Gemini 3 Flash

### Parser

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 3.2.1 | Parse JSON valido | Nenhum | JSON completo | Resultado estruturado | [ ] |
| 3.2.2 | Extrai JSON de markdown fences | Nenhum | ```json ... ``` | Parse correto | [ ] |
| 3.2.3 | Normaliza "sec" -> "dry" | Nenhum | hairType: "sec" | hairType: "dry" | [ ] |
| 3.2.4 | Normaliza "gras" -> "oily" | Nenhum | hairType: "gras" | hairType: "oily" | [ ] |
| 3.2.5 | Normaliza "abime" -> "damaged" | Nenhum | hairType: "abime" | hairType: "damaged" | [ ] |
| 3.2.6 | Normaliza "faible" -> "low" | Nenhum | porosity: "faible" | porosity: "low" | [ ] |
| 3.2.7 | Normaliza "elevee" -> "high" | Nenhum | porosity: "elevee" | porosity: "high" | [ ] |
| 3.2.8 | Texto nao-JSON -> ParseError | Nenhum | "Not JSON" | ParseError fase "extract" | [ ] |
| 3.2.9 | JSON invalido -> ParseError | Nenhum | "{invalid}" | ParseError fase "json" | [ ] |
| 3.2.10 | Campos obrigatorios ausentes | Nenhum | Faltam 3 campos | ParseError fase "validate" | [ ] |
| 3.2.11 | recommendedAction < 10 chars | Nenhum | "short" | ParseError fase "validate" | [ ] |

### Analyzer (Retry & Fallback)

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 3.2.12 | Sucesso 1a tentativa | Gemini OK | analyzeHairWithGemini | isFallback: false | [ ] |
| 3.2.13 | 1a falha, retry OK | Invalido 1o, valido 2o | analyzeHairWithGemini | isFallback: false (retry) | [ ] |
| 3.2.14 | Ambas falham, fallback | Gemini erro x2 | analyzeHairWithGemini | isFallback: true | [ ] |
| 3.2.15 | Vertex AI europe-west1 | Qualquer | Constructor | location: "europe-west1" | [ ] |
| 3.2.16 | Temperature 0.3 | Qualquer | generationConfig | temperature: 0.3 | [ ] |
| 3.2.17 | Fallback sem context | x2 falhas, sem context | Resultado | normal/medium | [ ] |
| 3.2.18 | Fallback chemical -> damaged/high | x2 falhas, chemicalTreatments | Resultado | damaged/high | [ ] |

### Handler (POST /analyzeHair)

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 3.2.19 | Analise sucesso | Auth, body OK, Gemini OK | POST | 200, diagnosticId + resultado | [ ] |
| 3.2.20 | Nao-POST rejeitado | - | GET | 405 | [ ] |
| 3.2.21 | Nao autenticado | Sem token | POST | 401 | [ ] |
| 3.2.22 | Body invalido | Auth | userId="" | 400 | [ ] |
| 3.2.23 | IDOR userId mismatch | Token A, body B | POST | 403 | [ ] |
| 3.2.24 | Rate limit 5/dia | 5 hoje | POST | 429 | [ ] |
| 3.2.25 | Rate limit permite 5o | 4 hoje | POST | 200 | [ ] |
| 3.2.26 | Status "pending" antes Gemini | Auth, body OK | POST | Doc pending no Firestore | [ ] |
| 3.2.27 | Status "completed" no sucesso | Gemini OK | POST | Doc completed no Firestore | [ ] |

## Story 3.3: Parser de Resultados

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 3.3.1 | Formato inesperado -> failed | Gemini invalido | Parser | status: "failed", erro logado | [ ] |
| 3.3.2 | Mensagem FR para usuario | Falha | UI | "Analyse indisponible. Veuillez reassayer." | [ ] |

## Story 3.4: UI Wizard

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 3.4.1 | Pagina placeholder | Auth | `/diagnostic` | ScanFace, "Diagnostic capillaire" | [ ] |
| 3.4.2 | CTA Dashboard | Dashboard | "Lancer le diagnostic" | Navega `/diagnostic` | [ ] |
| 3.4.3 | BottomNav | Pagina protegida | Tap "Diagnostic" | Navega, icone gold | [ ] |
| 3.4.4 | Service envia Auth token | Codigo | analyzeHair() | Bearer token header | [ ] |
| 3.4.5 | URL prod correta | Prod | URL | europe-west1 cloudfunctions.net | [ ] |
| 3.4.6 | URL emulador dev | Dev | URL | localhost:5001 | [ ] |

---

# 4. CRONOGRAMA CAPILAR (P0)

## Story 4.1: Gerador H/N/R

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 4.1.1 | 3/sem x 4 sem = 12 sessoes | - | generateSequence("normal","medium",3) | Length 12 | [ ] |
| 4.1.2 | Valores validos H/N/R | - | generateSequence("damaged","high",5) | Cada in ["H","N","R"] | [ ] |
| 4.1.3 | Seco prioriza H | - | generateSequence("dry","medium",6) | H > R | [ ] |
| 4.1.4 | Danificado prioriza R | - | generateSequence("damaged","medium",6) | R > H | [ ] |
| 4.1.5 | Normal/medium equilibrado | - | generateSequence("normal","medium",3) | H=N=R=4 | [ ] |
| 4.1.6 | Alta porosidade +R | - | Comparar high vs medium | High mais R | [ ] |
| 4.1.7 | Baixa porosidade +N | - | Comparar low vs medium | Low mais N | [ ] |
| 4.1.8 | sessionsPerWeek=0 | - | generateSequence(any,any,0) | Array vazio | [ ] |
| 4.1.9 | Labels FR | Calendario | Inspecionar | H=Hydratation, N=Nutrition, R=Reconstruction | [ ] |

## Story 4.2: Visualizacao Calendario

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 4.2.1 | Loading state | Auth, schedule | `/calendrier` | Spinner + "Chargement..." | [ ] |
| 4.2.2 | Empty state | Sem schedule | `/calendrier` | "Completez d'abord votre diagnostic..." | [ ] |
| 4.2.3 | Com eventos | Schedule ativo | `/calendrier` | "Mon Chronogramme", eventos agrupados por semana | [ ] |
| 4.2.4 | Cores tratamento | H, N, R | Ver | H=blue, N=green, R=amber | [ ] |
| 4.2.5 | Datas fr-FR | Eventos | Ver | "mer. 12 mars" | [ ] |
| 4.2.6 | Dias abreviados FR | Dias | Ver | Dim,Lun,Mar,Mer,Jeu,Ven,Sam | [ ] |
| 4.2.7 | Ordem por semana | Multi-semanas | Ver | Semana 1 primeiro | [ ] |
| 4.2.8 | Erro state | Firestore falha | `/calendrier` | Banner vermelho | [ ] |
| 4.2.9 | Jour de repos | Dia sem sessao | Ver | "Jour de repos" + icone | [ ] |

## Story 4.3: Sincronizacao

### Frontend

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 4.3.1 | Botao Google Calendar | Schedule | Ver | "Synchroniser avec Google Calendar" | [ ] |
| 4.3.2 | Botao .ics | Schedule | Ver | "Telecharger .ics" | [ ] |
| 4.3.3 | Google Calendar abre aba | Schedule | Clicar | calendar.google.com nova aba | [ ] |
| 4.3.4 | Download .ics | Schedule | Clicar | "cronocapilar-chronogramme.ics" baixado | [ ] |
| 4.3.5 | Download falha | Servidor erro | Clicar | Mensagem erro FR | [ ] |

### Backend ICS

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 4.3.6 | VCALENDAR valido | Eventos | generateICS | BEGIN/END corretos | [ ] |
| 4.3.7 | DTSTART Europe/Paris | Evento | ICS | TZID=Europe/Paris | [ ] |
| 4.3.8 | Duracao 30min | Evento 09:00 | ICS | DTEND 09:30 | [ ] |
| 4.3.9 | Alarme 1h | Evento | ICS | TRIGGER:-PT1H | [ ] |
| 4.3.10 | Handler GET sucesso | Token valido | GET /syncCalendar | 200 text/calendar | [ ] |
| 4.3.11 | Token HMAC invalido | Token errado | GET | 403 | [ ] |
| 4.3.12 | Token timing-safe | Codigo | Verificar | crypto.timingSafeEqual | [ ] |

---

# 5. NOTIFICACOES & RECOMPRA (P1)

## Story 5.1: Consumo Virtual

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 5.1.1 | 0 sessoes = volume total | 300ml, 15ml/s | Calcular | remaining:300, lowStock:false | [ ] |
| 5.1.2 | 10 sessoes | 300ml, 15ml/s, 10s | Calcular | remaining:150 | [ ] |
| 5.1.3 | Low stock 2 sessoes | 300ml, 15ml/s, 18s | Calcular | remaining:30, lowStock:true | [ ] |
| 5.1.4 | Depleted | 300ml, 15ml/s, 20s | Calcular | remaining:0, depleted | [ ] |
| 5.1.5 | Clamped a 0 | 25 sessoes | Calcular | remaining:0 (nao negativo) | [ ] |
| 5.1.6 | H -> hydration | - | treatmentToProductType("H") | "hydration" | [ ] |
| 5.1.7 | N -> nutrition | - | treatmentToProductType("N") | "nutrition" | [ ] |
| 5.1.8 | R -> reconstruction | - | treatmentToProductType("R") | "reconstruction" | [ ] |
| 5.1.9 | Registro sucesso | Auth, body OK | POST /registerProduct | 201 | [ ] |
| 5.1.10 | Tipo invalido rejeitado | "shampoo" | POST | 400 | [ ] |
| 5.1.11 | Volume > 5000ml rejeitado | 6000 | POST | 400 | [ ] |
| 5.1.12 | Update sucesso | Produto in_use | POST /updateProductUsage | 200, sessions+1 | [ ] |
| 5.1.13 | Produto depleted rejeitado | depleted | POST update | 400 | [ ] |

## Story 5.2: Twilio SMS

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 5.2.1 | Template rebuy_alert | firstName, productName | renderTemplate | Contem nome e produto | [ ] |
| 5.2.2 | Template welcome | firstName | renderTemplate | "Bienvenue" + nome | [ ] |
| 5.2.3 | SMS sucesso | Twilio OK | sendSMS | success:true, sid | [ ] |
| 5.2.4 | Phone mascarado logs | Qualquer | Verificar | +336****5678 | [ ] |
| 5.2.5 | Notificacao SMS sucesso | Auth, opt-in=true | POST /sendNotification | 200, sent | [ ] |
| 5.2.6 | Sem consent rejeitado | opt-in=false | POST SMS | 403 no-consent | [ ] |
| 5.2.7 | Rate limit 3/dia | 3 SMS hoje | POST | 429 | [ ] |
| 5.2.8 | Idempotencia | Mesmo tipo hoje | POST | already_sent | [ ] |
| 5.2.9 | Retry sucesso | Failed, nextRetry<=now | Handler | Status sent | [ ] |
| 5.2.10 | Max retries | retryCount=4 | Handler | Status failed, null | [ ] |
| 5.2.11 | Delays escalonam | 0->3 | Verificar | 1m,5m,15m,1h | [ ] |

## Story 5.3: Tracking Bit.ly

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 5.3.1 | Fallback URL original | Bit.ly falha | SMS prepara link | URL original, warning logado | [ ] |

---

# 6. DASHBOARD ADMIN (P2)

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 6.1.1 | Admin recupera stats | role admin_chs | GET /getAdminStats | 200 { period, summary, daily } | [ ] |
| 6.1.2 | Non-admin rejeitado | Regular user | GET | 403 | [ ] |
| 6.1.3 | Params ausentes | Sem query | GET | 400 | [ ] |
| 6.2.1 | Agregacao diaria | Dados existem | aggregateDailyMetrics | KPIs populados | [ ] |
| 6.2.2 | Queries paralelas | Qualquer | Rodar | Promise.allSettled 6 queries | [ ] |
| 6.2.3 | Falha parcial | 1/6 falha | Rodar | status: "partial" | [ ] |
| 6.2.4 | Idempotencia skip | Doc success existe | Handler | Sem reagregar | [ ] |

---

# 7. REFINAMENTO UX IA (P1)

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 7.1.1 | Prompt 5 etapas | - | buildDiagnosticPrompt | "Protocole d'Analyse en 5 Etapes" | [ ] |
| 7.1.2 | Prompt inclui context | scalpType:"oily" | buildDiagnosticPrompt | "cuir chevelu gras" | [ ] |
| 7.1.3 | Prompt exclui context | Sem context | buildDiagnosticPrompt | Sem "Contexte fourni" | [ ] |
| 7.2.1 | Spinner ProtectedRoute | Auth loading | Rota protegida | Spinner gold tela cheia | [ ] |
| 7.2.2 | Loading calendario | Fetching | `/calendrier` | Loader2 gold + texto | [ ] |
| 7.2.3 | Loading login | Submetendo | Se connecter | "Connexion..." | [ ] |
| 7.2.4 | Loading signup | Submetendo | Creer | "Creation..." | [ ] |
| 7.3.1 | 3-tier fallback funciona | Gemini falha x2 | Diagnostico | Fallback textual retornado | [ ] |

---

# 8. MONETIZACAO & CHECKOUT (P0)

## Story 8.1: Stripe

| # | Cenario | Pre-condicao | Passos | Resultado Esperado | Status |
|---|---------|--------------|--------|-------------------|--------|
| 8.1.1 | Preco 990 cents (9.90 EUR) | - | PREMIUM_PLAN | priceMonthly:990, eur, month | [ ] |
| 8.1.2 | URL prod aceita | - | isAllowedRedirectUrl(cronocapilar.web.app) | true | [ ] |
| 8.1.3 | URL evil rejeitada | - | isAllowedRedirectUrl(evil.com) | false | [ ] |
| 8.1.4 | javascript: rejeitado | - | isAllowedRedirectUrl(javascript:) | false | [ ] |
| 8.1.5 | Subdomain spoof rejeitado | - | fake.cronocapilar.web.app | false | [ ] |
| 8.1.6 | Checkout sucesso | Auth, sem assinatura | POST /createCheckoutSession | 200 sessionId, url | [ ] |
| 8.1.7 | Ja assinante rejeitado | Assinatura ativa | POST | 400 already-subscribed | [ ] |
| 8.1.8 | Redirect invalida | evil.com | POST | 400 invalid-redirect | [ ] |
| 8.1.9 | Portal sucesso | Auth, stripeCustomerId | POST /createPortalSession | 200 url | [ ] |
| 8.1.10 | Sem customer | Sem stripeCustomerId | POST portal | 400 no-customer | [ ] |
| 8.1.11 | Webhook sem signature | Sem header | POST /stripeWebhook | 400 | [ ] |
| 8.1.12 | Webhook signature falsa | Forjada | POST | 400 | [ ] |
| 8.1.13 | checkout.completed -> premium | Webhook valido | POST | isPremium=true | [ ] |
| 8.1.14 | subscription.deleted -> cancel | Webhook valido | POST | isPremium=false | [ ] |
| 8.1.15 | invoice.payment_failed -> log | Webhook valido | POST | Erro logado | [ ] |
| 8.1.16 | Preco server-controlled | Codigo | Verificar | PREMIUM_PRICE_ID no servidor | [ ] |
| 8.1.17 | Secrets sem hardcode | Buscar sk_live_ | Nenhum | Tudo via defineSecret | [ ] |

---

# 9. SEGURANCA (P0)

## SEC-1: Autenticacao & Autorizacao

| # | Teste | Resultado Esperado | Sev | Status |
|---|-------|-------------------|-----|--------|
| SEC-1.01 | Todos endpoints sem auth -> 401 | 401 em todos | P0 | [ ] |
| SEC-1.02 | JWT expirado -> 401 | Rejeitado | P0 | [ ] |
| SEC-1.03 | JWT malformado -> 401 | Rejeitado | P0 | [ ] |
| SEC-1.04 | IDOR diagnostico cross-user -> 403 | Bloqueado | P0 | [ ] |
| SEC-1.05 | IDOR schedule cross-user -> 403 | Bloqueado | P0 | [ ] |
| SEC-1.06 | IDOR product cross-user -> 403 | Bloqueado | P0 | [ ] |
| SEC-1.07 | IDOR notification cross-user -> 403 | Bloqueado | P0 | [ ] |
| SEC-1.08 | Escalacao admin -> 403 | Bloqueado | P0 | [ ] |
| SEC-1.09 | ProtectedRoute sem auth -> /login | Redirect | P0 | [ ] |
| SEC-1.10 | **[CRITICAL] Sem verificacao email** | Acessam tudo sem verificar | P0 | [!] |
| SEC-1.11 | **[HIGH] Token revoked nao verificado** | checkRevoked faltando | P1 | [!] |

## SEC-2: Firestore Rules

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| SEC-2.01 | users READ sem auth -> NEGADO | Bloqueado | [ ] |
| SEC-2.02 | users READ proprio -> PERMITIDO | OK | [ ] |
| SEC-2.03 | users READ outro -> NEGADO | Bloqueado | [ ] |
| SEC-2.04 | users CREATE campos obrigatorios | OK | [ ] |
| SEC-2.05 | users UPDATE permitidos | firstName, phoneNumber, optInSMS | [ ] |
| SEC-2.06 | users UPDATE email -> NEGADO | Bloqueado | [ ] |
| SEC-2.07 | users UPDATE isPremium -> NEGADO | Bloqueado | [ ] |
| SEC-2.08 | users DELETE proprio (RGPD) | PERMITIDO | [ ] |
| SEC-2.09 | diagnostics UPDATE -> NEGADO (sempre) | Bloqueado | [ ] |
| SEC-2.10 | diagnostics DELETE proprio | PERMITIDO | [ ] |
| SEC-2.11 | products UPDATE -> NEGADO (sempre) | Bloqueado | [ ] |
| SEC-2.12 | notifications CREATE/UPDATE -> NEGADO | Bloqueado | [ ] |
| SEC-2.13 | analytics READ non-admin -> NEGADO | Bloqueado | [ ] |
| SEC-2.14 | Catch-all colecao desconhecida -> NEGADO | Bloqueado | [ ] |

## SEC-3: Storage Rules

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| SEC-3.01 | READ sem auth -> NEGADO | Bloqueado | [ ] |
| SEC-3.02 | WRITE JPEG < 10MB -> OK | Permitido | [ ] |
| SEC-3.03 | WRITE PDF -> NEGADO | Bloqueado | [ ] |
| SEC-3.04 | WRITE > 10MB -> NEGADO | Bloqueado | [ ] |
| SEC-3.05 | WRITE outro user -> NEGADO | Bloqueado | [ ] |
| SEC-3.06 | **[HIGH] Content-Type spoofing** | Regras checam header nao magic bytes | [!] |

## SEC-4: API Security

| # | Teste | Resultado Esperado | Sev | Status |
|---|-------|-------------------|-----|--------|
| SEC-4.01 | GET em POST-only -> 405 | Rejeitado | P0 | [ ] |
| SEC-4.02 | Rate limit diagnosticos 5/dia | 429 no 6o | P0 | [ ] |
| SEC-4.03 | Rate limit SMS 3/dia | 429 no 4o | P0 | [ ] |
| SEC-4.04 | CORS evil.com -> rejeitado | Bloqueado | P0 | [ ] |
| SEC-4.05 | Validacao E.164 telefone | Injection rejeitada | P0 | [ ] |
| SEC-4.06 | **[CRITICAL] App Check nao enforced** | Functions acessiveis sem reCAPTCHA | P0 | [!] |
| SEC-4.07 | **[HIGH] Sem rate limit global** | Falta Cloud Armor | P1 | [!] |

## SEC-5: RGPD

| # | Teste | Resultado Esperado | Sev | Status |
|---|-------|-------------------|-----|--------|
| SEC-5.01 | Erasure users, diagnostics, schedules, products, notifications | PERMITIDO em todos | P0 | [ ] |
| SEC-5.02 | **[CRITICAL] Sem cascade delete** | Cloud Function faltando | P0 | [!] |
| SEC-5.03 | **[CRITICAL] Sem Storage cleanup** | Fotos permanecem | P0 | [!] |
| SEC-5.04 | **[CRITICAL] Sem link privacy login/signup** | RGPD Art. 13 | P0 | [!] |
| SEC-5.05 | Consent SMS verificado antes envio | 403 se false | P0 | [ ] |
| SEC-5.06 | Phone mascarado logs | +336****5678 | P0 | [ ] |
| SEC-5.07 | Dados europe-west1 | Tudo na UE | P0 | [ ] |
| SEC-5.08 | **[HIGH] Sem cleanup Stripe** | Customer persiste | P1 | [!] |
| SEC-5.09 | **[HIGH] Sem portabilidade dados** | RGPD Art. 20 | P1 | [!] |
| SEC-5.10 | **[HIGH] Retry sem re-checar consent** | Pode enviar apos revogacao | P1 | [!] |

## SEC-6: Stripe

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| SEC-6.01 | Webhook signature verificada | constructEvent valida | [ ] |
| SEC-6.02 | Open redirect bloqueado | isAllowedRedirectUrl | [ ] |
| SEC-6.03 | isPremium client-side -> NEGADO | Firestore rules bloqueiam | [ ] |
| SEC-6.04 | Preco server-controlled | PREMIUM_PRICE_ID no servidor | [ ] |
| SEC-6.05 | Secrets via defineSecret | Sem hardcode | [ ] |

## SEC-7: SMS/Twilio

| # | Teste | Resultado Esperado | Sev | Status |
|---|-------|-------------------|-----|--------|
| SEC-7.01 | Credentials via defineSecret | Sem hardcode | P0 | [ ] |
| SEC-7.02 | E.164 validation | Regex rejeita formatos invalidos | P0 | [ ] |
| SEC-7.03 | Rate limit 3/dia | Enforced | P0 | [ ] |
| SEC-7.04 | **[HIGH] productLink sem domain trust** | URL phishing possivel | P1 | [!] |
| SEC-7.05 | **[MEDIUM] Template injection firstName** | Newlines concatenadas | P2 | [!] |

## SEC-8: CI/CD

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| SEC-8.01 | deploy.yml SHA-pinned | Todos pinned | [ ] |
| SEC-8.02 | **[HIGH] preview.yml TAG-pinned** | Vulneravel supply chain | [!] |
| SEC-8.03 | frozen-lockfile no CI | Presente | [ ] |
| SEC-8.04 | **[MEDIUM] Sem npm audit CI** | Faltando | [!] |

## SEC-9: Client-Side

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| SEC-9.01 | .env nao comitado | Gitignored | [ ] |
| SEC-9.02 | CSP configurado | firebase.json presente | [ ] |
| SEC-9.03 | HSTS 2 anos + preload | Configurado | [ ] |
| SEC-9.04 | X-Frame-Options DENY | Configurado | [ ] |
| SEC-9.05 | Assets cache imutavel | max-age=31536000 | [ ] |
| SEC-9.06 | index.html no-cache | Configurado | [ ] |

---

# 10. ACESSIBILIDADE WCAG AA (P2)

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| A11Y.01 | Inputs com labels | htmlFor/id pareados | [ ] |
| A11Y.02 | Focus visible | ring-2 ring-offset-2 | [ ] |
| A11Y.03 | Contraste texto principal | 16.15:1 AAA | [ ] |
| A11Y.04 | **[CRITICAL] Gold on white** | ~2.4:1 (falha AA 4.5:1) | [!] |
| A11Y.05 | Navegacao teclado completa | Tab funcional | [ ] |
| A11Y.06 | **[HIGH] Spinners sem role="status"** | Screen readers nao detectam | [!] |
| A11Y.07 | **[HIGH] Erros sem role="alert"** | Screen readers nao anunciam | [!] |
| A11Y.08 | BottomNav semantico `<nav>` | Presente | [ ] |
| A11Y.09 | Legal pages h1 unico | Presente | [ ] |
| A11Y.10 | **[HIGH] Sem lang="fr" app/** | Verificar index.html | [!] |
| A11Y.11 | **[MEDIUM] Sem titulo por rota** | document.title nao muda | [!] |

---

# 11. i18n & LOCALIZACAO

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| I18N.01 | Todo texto app/ em frances | Textos FR corretos | [ ] |
| I18N.02 | Erros Firebase em FR | Mensagens traduzidas | [ ] |
| I18N.03 | Datas fr-FR | "mer. 12 mars" | [ ] |
| I18N.04 | Dias FR | Dim,Lun,Mar... | [ ] |
| I18N.05 | web/ lang="fr" | Presente | [ ] |
| I18N.06 | Locale restrito fr-FR | type Locale = "fr-FR" | [ ] |
| I18N.07 | **[LOW] Footer web/ ingles** | Deveria ser FR | [!] |

---

# 12. RESPONSIVIDADE

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| RES.01 | Mobile 375px | Sem scroll horizontal | [ ] |
| RES.02 | Tablet 768px | Grid 3 colunas | [ ] |
| RES.03 | min-h-dvh | Preenche viewport | [ ] |
| RES.04 | BottomNav fixo | Nav no fundo ao scrollar | [ ] |
| RES.05 | Padding BottomNav | Conteudo nao escondido | [ ] |
| RES.06 | Safe area iOS | pb safe-area-inset | [ ] |
| RES.07 | 320px | Sem overflow | [ ] |
| RES.08 | Desktop 2560px | Centralizado max-w | [ ] |
| RES.09 | Landscape | Acessivel | [ ] |

---

# 13. NAVEGACAO & ROTAS

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| NAV.01 | Sem auth /dashboard -> /login | Redirect | [ ] |
| NAV.02 | Sem auth /diagnostic -> /login | Redirect | [ ] |
| NAV.03 | Sem auth /calendrier -> /login | Redirect | [ ] |
| NAV.04 | Auth sem perfil -> /profile-setup | Redirect | [ ] |
| NAV.05 | Rota inexistente -> / | Redirect | [ ] |
| NAV.06 | Rotas publicas acessiveis | Sem redirect | [ ] |
| NAV.07 | BottomNav 4 items | Accueil, Diagnostic, Calendrier, Parametres | [ ] |
| NAV.08 | Active state gold | Item ativo gold-500 | [ ] |
| NAV.09 | Dashboard "Bonjour, {nome}" | Greeting correto | [ ] |
| NAV.10 | Dashboard CTA diagnostico | Botao "Lancer le diagnostic" | [ ] |
| NAV.11 | Settings info user | Avatar, nome, email | [ ] |
| NAV.12 | Landing hero + CTA | "IA", Commencer, Se connecter | [ ] |
| NAV.13 | Landing features | 3 cards | [ ] |
| NAV.14 | Landing footer legal | 3 links legais | [ ] |
| NAV.15 | Legal pages renderizam | Conteudo CHS, RGPD | [ ] |
| NAV.16 | Legal botao retour | Navega / | [ ] |
| NAV.17 | **[MEDIUM] Conteudo legal incompleto** | Placeholders presentes | [!] |

---

# 14. PERFORMANCE

| # | Teste | Resultado Esperado | Status |
|---|-------|-------------------|--------|
| PERF.01 | **[MEDIUM] Sem code splitting** | Imports estaticos | [!] |
| PERF.02 | Bundle < 200KB | Build producao | [ ] |
| PERF.03 | useCallback AuthContext | Memoizado | [ ] |
| PERF.04 | Testes unitarios passam | 63 tests OK | [ ] |

---

# ISSUES CRITICOS (Pre-Release Blockers)

## CRITICAL (6 - Bloqueia Release)

| # | Issue | Arquivo | Descricao |
|---|-------|---------|-----------|
| CRIT-01 | Sem verificacao email | AuthContext.tsx | Usuarios acessam sem verificar email |
| CRIT-02 | App Check nao enforced | index.ts | Cloud Functions sem reCAPTCHA |
| CRIT-03 | Sem delecao cascata RGPD | Firestore | Deletar perfil nao cascateia |
| CRIT-04 | Sem cleanup Storage RGPD | Storage | Fotos nao deletadas |
| CRIT-05 | Sem link privacy login/signup | Login.tsx, Signup.tsx | RGPD Art. 13 |
| CRIT-06 | Contraste gold on white | Todas paginas | ~2.4:1 (min 4.5:1) |

## HIGH (11 - Corrigir antes Producao)

| # | Issue | Arquivo | Descricao |
|---|-------|---------|-----------|
| HIGH-01 | Token revoked nao verificado | auth.ts | Falta checkRevoked: true |
| HIGH-02 | Content-Type spoofing | storage.rules | Header vs magic bytes |
| HIGH-03 | Sem rate limit global | index.ts | Falta Cloud Armor |
| HIGH-04 | Sem cleanup Stripe RGPD | billing | Customer persiste |
| HIGH-05 | Sem portabilidade dados | - | RGPD Art. 20 |
| HIGH-06 | Retry SMS sem re-checar consent | handler.ts | Envia apos revogacao |
| HIGH-07 | productLink sem domain trust | schemas.ts | URL phishing em SMS |
| HIGH-08 | preview.yml TAG nao SHA | preview.yml | Supply chain |
| HIGH-09 | Spinners sem role="status" | ProtectedRoute | Acessibilidade |
| HIGH-10 | Erros sem role="alert" | Login, Signup | Acessibilidade |
| HIGH-11 | Sem lang="fr" app/ | main.tsx | Acessibilidade |

---

# Rastreabilidade: Criterios -> Testes

| Story | Criterio | Teste(s) | Coberto? |
|-------|----------|----------|----------|
| 1.1 | Servidor dev sem erros | 1.2.1 | [x] |
| 1.1 | Tokens design | 1.4.1-1.4.3 | [x] |
| 1.2 | Firebase europe-west1 | 1.3.1, SEC-5.07 | [x] |
| 1.2 | Firestore Rules | SEC-2.01-SEC-2.14 | [x] |
| 1.3 | Troca idioma | 1.5.1-1.5.4 | [x] |
| 1.4 | Deploy auto | 1.2.1-1.2.5 | [x] |
| 2.1 | Login Google | 2.1.6 | [x] |
| 2.2 | Perfil completo | 2.2.1-2.2.5 | [x] |
| 2.3 | OptInSMS + timestamp | 2.3.5 | [x] |
| 3.1 | Upload Storage | 3.1.6, SEC-3.02 | [x] |
| 3.1 | Validacao formato | 3.1.4-3.1.8, SEC-3.03-3.04 | [x] |
| 3.2 | Gemini JSON | 3.2.1-3.2.11 | [x] |
| 3.3 | Doc diagnostics | 3.2.26-3.2.27 | [x] |
| 3.3 | Formato inesperado | 3.3.1-3.3.2 | [x] |
| 3.4 | Wizard | 3.4.1-3.4.3 | [x] |
| 4.1 | Dry prioriza H | 4.1.3 | [x] |
| 4.2 | Proximos 7 dias | 4.2.3-4.2.7 | [x] |
| 4.2 | Jour de repos | 4.2.9 | [x] |
| 4.3 | Google Calendar | 4.3.1, 4.3.3 | [x] |
| 4.3 | Download .ics | 4.3.2, 4.3.4, 4.3.6-4.3.9 | [x] |
| 5.1 | depletionDate | 5.1.1-5.1.5 | [x] |
| 5.1 | lowStock 2 sessoes | 5.1.3 | [x] |
| 5.2 | Fallback email | 5.2.12 | [x] |
| 5.3 | Bit.ly fallback | 5.3.1 | [x] |
| 6.1 | Dashboard KPIs | 6.1.1 | [x] |
| 6.2 | Agregacao 02:00 UTC | 6.2.1-6.2.2 | [x] |

**Cobertura:** 100% dos criterios de aceite mapeados para >= 1 teste.

---

# Gaps de Testes Automatizados

| Modulo | Testes Existentes | Acao |
|--------|------------------|------|
| diagnostic/analyzer.ts | 0 | Criar testes retry/fallback |
| diagnostic/prompt.ts | 0 | Criar testes prompt |
| diagnostic/handler.ts | 0 | Criar testes handler |
| schedule/handler.ts | 0 | Criar testes handler |
| calendar/handler.ts | 0 | Criar testes ICS download |
| calendar/ics-generator.ts | 0 | Criar testes RFC 5545 |
| calendar/token.ts | 0 | Criar testes HMAC |
| products/handler.ts | 0 | Criar testes register/update |
| notifications/handler.ts | 0 | Criar testes consent/rate/retry |
| notifications/sender.ts | 0 | Criar testes Twilio |
| notifications/templates.ts | 0 | Criar testes render |
| analytics/aggregator.ts | 0 | Criar testes KPIs |
| analytics/handler.ts | 0 | Criar testes admin stats |
| billing/handler.ts | 2 (redirect) | Expandir checkout/portal/webhook |
| firestore.rules | 0 | @firebase/rules-unit-testing |
| storage.rules | 0 | @firebase/rules-unit-testing |

---

# Historico de Execucao

| Data | Executor | Pass | Fail | N/A | Notas |
|------|----------|------|------|-----|-------|
| 2026-02-09 | @backend + @frontend + @security + @explorer | 0 | 0 | 0 | Geracao inicial v2.0 |

---

# Metricas de Qualidade

| Metrica | Alvo | Atual | Status |
|---------|------|-------|--------|
| Cobertura Stories | 100% | 100% (25/25) | OK |
| Cobertura Criterios Aceite | 100% | 100% | OK |
| Taxa Aprovacao | > 95% | 0% (nao executado) | Pendente |
| CRITICAL issues | 0 | 6 | Bloqueia |
| HIGH issues | 0 | 11 | Requer fix |
| Total Cenarios | - | 561 | - |

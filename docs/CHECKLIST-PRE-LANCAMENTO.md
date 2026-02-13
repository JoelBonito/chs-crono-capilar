# ✅ Checklist Pré-Lançamento MVP - CronoCapilar

**Data de criação:** 2026-02-13
**Status:** 🔴 BLOQUEADO - Aguardando dados da CHS
**Responsável:** @macbookdejoel

---

## 📋 Critérios de Go/No-Go (Product Brief 7.1)

### ✅ Critérios Técnicos
| # | Critério | Status | Evidência |
|---|----------|--------|-----------|
| 1 | 100% das stories P0 e P1 em `Done` | 🔴 **25-30%** | Backlog auditado 2026-02-12 |
| 2 | Cobertura E2E dos fluxos críticos | 🔴 **0%** | Sem testes E2E |
| 3 | Sem incidentes de segurança alta | 🟢 **OK** | Código auditado |
| 4 | Conformidade RGPD validada | 🟡 **Parcial** | Backend OK, falta frontend + docs legais |

---

## 🏢 DADOS COMERCIAIS DA H.A.M LUXURY (CHS) - OBTIDOS

### 1. Informações Legais da Empresa ✅

| Dado | Valor | Status | Onde usar |
|------|-------|--------|-----------|
| **Razão Social Completa** | H.A.M LUXURY HAIR COSMETICS | 🟢 **OK** | Footer, `/mentions-legales` |
| **SIREN** | 884 206 707 | 🟢 **OK** | Política de Privacidade |
| **SIRET** | 884 206 707 00033 | 🟢 **OK** | Política de Privacidade |
| **N° TVA Intracommunautaire** | FR30 884 206 707 | 🟢 **OK** | Faturas, documentos fiscais |
| **Endereço Completo da Sede** | 63 Avenue Claude Monet<br>13014 Marseille, France | 🟢 **OK** | Política de Privacidade |
| **Forma Jurídica** | SAS (Société par Actions Simplifiée) | 🟢 **OK** | Mentions légales |
| **Capital Social** | 1.000,00 € | 🟢 **OK** | Mentions légales |
| **Código NAF/APE** | 46.45Z - Commerce de gros de parfumerie et de produits de beauté | 🟢 **OK** | Documentação |
| **Data de Criação** | 08/06/2020 | 🟢 **OK** | Sobre a empresa |
| **Representante Legal** | Laurent HAMAMLIAN - Président de SAS | 🟢 **OK** | Termos de Uso, assinaturas |
| **Número de Telefone** | +33 6 17 76 76 75 | 🟢 **OK** | Página de Contato |
| **E-mail oficial de contato** | chs.achat@gmail.com | 🟢 **OK** | Formulário de contato |
| **E-mail do DPO** (Data Protection Officer) | chs.achat@gmail.com | 🟢 **OK** | RGPD compliance |

**Convention Collective:** IDCC 3032 - Esthétique-cosmétique et enseignement technique

---

### 2. Domínio e Hospedagem

| Dado | Necessário para | Status | Ação |
|------|-----------------|--------|------|
| **Domínio Principal** | Deploy produção | 🟢 **OK** | cronocapilar.inoveai.app.br |
| **Acesso DNS** | Configurar CNAME/A record | 🔴 | Credenciais de acesso ao DNS |
| **SSL Certificate** | HTTPS obrigatório RGPD | 🟢 | Firebase gerencia automaticamente |

---

### 3. Links de Produtos (E-commerce)

| Dado | Necessário para | Status | Onde usar |
|------|-----------------|--------|-----------|
| **URL Base da Loja Online** | Links de recompra SMS | 🔴 | Ex: `https://loja.chs.fr` |
| **URLs Específicas dos Produtos:** |  |  |  |
| - Máscara Hidratação (H) | Link direto no SMS | 🔴 | `https://loja.chs.fr/mascara-hidratacao` |
| - Máscara Nutrição (N) | Link direto no SMS | 🔴 | `https://loja.chs.fr/mascara-nutricao` |
| - Máscara Reconstrução (R) | Link direto no SMS | 🔴 | `https://loja.chs.fr/mascara-reconstrucao` |
| **Parâmetros UTM** | Tracking de conversão | 🔴 | `?utm_source=cronocapilar&utm_medium=sms` |

---

### 4. Integrações e Chaves de API

| Serviço | Dado Necessário | Quem fornece | Status |
|---------|-----------------|--------------|--------|
| **Twilio (SMS)** | Account SID | CHS ou Projeto | 🟢 Configurado |
| **Twilio (SMS)** | Auth Token | CHS ou Projeto | 🟢 Configurado |
| **Twilio (SMS)** | Número remetente (+33) | CHS compra | 🔴 **Pendente** |
| **Bitly (URL Shortener)** | API Token | CHS ou Projeto | 🟡 Configurado, validar quota |
| **Google Cloud** | Billing Account | CHS | 🟡 Verificar ownership |
| **Firebase Project ID** | Ownership | CHS ou Projeto | 🟡 Transferir para CHS |
| **Gemini/Vertex AI** | API Key | Projeto Google Cloud | 🟢 Configurado |

---

### 5. Conta Stripe (Pagamentos) - FUTURO

> ⚠️ **MVP não inclui pagamentos diretos**, mas planejar para v2.0:

| Dado | Necessário para | Status |
|------|-----------------|--------|
| Conta Stripe França | Checkout de assinatura | 🔴 Não criada |
| Webhook Secret | Validação de eventos | 🔴 N/A |

---

## 📄 DOCUMENTAÇÃO LEGAL (RGPD P0 - BLOQUEADOR)

### 6. Política de Privacidade (Politique de confidentialité)

**Status:** 🔴 **NÃO EXISTE - BLOQUEADOR CRÍTICO**

**Deve conter:**
- [ ] Identificação do controlador de dados (CHS - razão social, SIREN, endereço)
- [ ] Base legal para processamento (Art. 6 RGPD: execução de contrato + consentimento)
- [ ] Tipos de dados coletados:
  - PII: e-mail, telefone, nome
  - Dados sensíveis: fotos capilares
  - Dados de uso: diagnósticos, cronogramas
- [ ] Finalidade do tratamento (diagnóstico, cronograma, SMS marketing)
- [ ] Período de retenção (24 meses para fotos, até deleção para PII)
- [ ] Direitos do titular (RGPD Art. 15-21):
  - Direito de acesso (Art. 15)
  - Direito de retificação (Art. 16)
  - Direito ao esquecimento (Art. 17) ✅ **Implementado no backend**
  - Direito à portabilidade (Art. 20)
  - Direito de oposição (Art. 21)
- [ ] Contato do DPO (e-mail + telefone)
- [ ] Transferências internacionais (Firebase Storage UE: ok)
- [ ] Cookies e rastreamento (se houver analytics)
- [ ] Data de última atualização e versionamento

**Idioma:** 🇫🇷 Francês (obrigatório)
**Formato:** HTML/PDF acessível em `/politique-de-confidentialite`
**Assinatura:** Representante legal da CHS

---

### 7. Termos de Uso / CGU (Conditions Générales d'Utilisation)

**Status:** 🔴 **NÃO EXISTE**

**Deve conter:**
- [ ] Identificação do prestador de serviço (CHS)
- [ ] Descrição do serviço (cronograma capilar + SMS)
- [ ] Condições de acesso (conta gratuita vs futura assinatura)
- [ ] Responsabilidades da usuária
- [ ] Limitações de responsabilidade da CHS
- [ ] Propriedade intelectual (conteúdo gerado por IA)
- [ ] Modificações do serviço
- [ ] Lei aplicável (França) e jurisdição competente

**Idioma:** 🇫🇷 Francês
**Formato:** HTML acessível em `/cgu`

---

### 8. DPA (Data Processing Agreements) com Fornecedores

**Status:** 🔴 **PARCIAL - Bloqueador P0**

| Fornecedor | Tipo de Dados | Status DPA | Ação |
|-----------|---------------|------------|------|
| **Twilio** | Telefone (+33) | 🔴 Não assinado | CHS deve assinar DPA com Twilio |
| **Bitly** | URLs geradas | 🔴 Não assinado | CHS deve assinar DPA com Bitly |
| **Google Cloud** | PII + fotos | 🟢 OK | Google Cloud Terms incluem DPA |
| **Vertex AI (Gemini)** | Fotos temporárias | 🟢 OK | Coberto pelo GCP DPA |

**Evidência necessária:** Contratos assinados (PDF) arquivados em `docs/legal/dpa/`

---

## 🎨 IDENTIDADE VISUAL E CONTEÚDO

### 9. Assets Visuais

| Asset | Descrição | Status | Onde usar |
|-------|-----------|--------|-----------|
| **Logo CHS (SVG/PNG)** | Alta resolução, fundo transparente | 🔴 | Navbar, Footer, Favicon |
| **Favicon** | 32x32, 64x64, 192x192 | 🔴 | `public/favicon.ico` |
| **Imagens de Produtos** | Máscaras H/N/R (alta qualidade) | 🔴 | Dashboard, SMS templates |
| **Paleta de Cores Oficial** | Hex codes | 🟢 | Preto/Branco/Ouro (#D4AF37) |
| **Fontes** | Licença comercial | 🟢 | Newsreader + Manrope (Google Fonts) |

---

### 10. Conteúdo Editorial (Francês)

| Conteúdo | Status | Responsável |
|----------|--------|-------------|
| **Textos da Landing Page** | 🔴 | CHS Marketing |
| **FAQs (Perguntas Frequentes)** | 🔴 | CHS + Produto |
| **Templates de SMS** | 🟢 | Implementado (revisar com CHS) |
| **Mensagens de erro (UX Writing)** | 🟡 | Revisar com nativo FR |
| **E-mails transacionais** | 🔴 | Para v2.0 |

---

## 🔐 SEGURANÇA E COMPLIANCE

### 11. Checklist RGPD Operacional

| Controle | Evidência | Status | Responsável |
|----------|-----------|--------|-------------|
| **Consentimento SMS** | Checkbox opt-in no ProfileSetup | 🟢 | Implementado |
| **Direito ao Esquecimento** | Endpoint `/deleteAccount` | 🟢 | Backend OK, falta UI |
| **Exportação de Dados** | JSON download | 🔴 | Não implementado |
| **Notificação de Breach** | Processo documentado | 🔴 | Criar SOP |
| **Registro de Atividades de Processamento** | RGPD Art. 30 | 🔴 | Criar planilha |
| **Auditoria de Logs** | Cloud Logging configurado | 🟢 | OK |
| **App Check (anti-bot)** | Firebase App Check ativo | 🔴 | Configurar antes do deploy |

---

## 📱 CONFIGURAÇÕES OPERACIONAIS

### 12. Configurações de SMS (Twilio)

| Parâmetro | Valor Necessário | Status |
|-----------|------------------|--------|
| **Número remetente (+33)** | Comprado e validado | 🔴 **BLOQUEADOR** |
| **Template de Boas-vindas** | "Bienvenue sur CronoCapilar!" | 🟢 |
| **Template de Recompra** | Com {productName} e {link} | 🟢 |
| **Template de Lembrete** | Para sessões H/N/R | 🟢 |
| **Quota diária de SMS** | Configurar limite | 🔴 |
| **Fallback (Email)** | SendGrid ou similar | 🔴 Para v2.0 |

---

### 13. Google Analytics / Tracking (Opcional)

| Ferramenta | Status | RGPD Compliance |
|------------|--------|-----------------|
| Google Analytics 4 | 🔴 Não configurado | Requer banner de cookies + opt-in |
| Mixpanel | 🔴 Não configurado | Alternativa privacy-first |
| Plausible/Fathom | 🟢 Recomendado | RGPD-compliant sem cookies |

---

## 🚀 PRÓXIMOS PASSOS (ORDEM DE PRIORIDADE)

### 🔴 P0 - BLOQUEADORES CRÍTICOS (Sem isso, NÃO PODE PUBLICAR)

1. **Dados Legais da CHS:**
   - [ ] Razão social, SIREN, endereço, DPO
   - [ ] **Prazo:** 2 dias úteis

2. **Política de Privacidade em Francês:**
   - [ ] Redigir (template + advogado especialista RGPD)
   - [ ] Revisar com CHS
   - [ ] Publicar em `/politique-de-confidentialite`
   - [ ] **Prazo:** 1 semana

3. **DPAs com Twilio e Bitly:**
   - [ ] CHS assina contratos
   - [ ] Arquivar PDFs em `docs/legal/dpa/`
   - [ ] **Prazo:** 1 semana

4. **Número de Telefone Twilio (+33):**
   - [ ] Comprar número francês
   - [ ] Configurar no projeto
   - [ ] **Prazo:** 3 dias úteis

5. **Domínio de Produção:**
   - [ ] Definir domínio (ex: `app.chs.fr`)
   - [ ] Configurar DNS
   - [ ] **Prazo:** 2 dias úteis

---

### 🟡 P1 - IMPORTANTE (Faz parte do MVP)

6. **Links de Produtos (E-commerce):**
   - [ ] URLs das máscaras H/N/R
   - [ ] Parâmetros UTM configurados
   - [ ] **Prazo:** 3 dias

7. **Assets Visuais:**
   - [ ] Logo CHS (SVG alta resolução)
   - [ ] Favicon (3 tamanhos)
   - [ ] Imagens de produtos
   - [ ] **Prazo:** 1 semana

8. **Termos de Uso (CGU):**
   - [ ] Redigir (template + advogado)
   - [ ] Revisar com CHS
   - [ ] Publicar em `/cgu`
   - [ ] **Prazo:** 1 semana

9. **Completar Frontend RGPD:**
   - [ ] UI para deleção de conta (`/settings`)
   - [ ] UI para exportação de dados
   - [ ] **Prazo:** Sprint atual

10. **App Check (Firebase):**
    - [ ] Configurar reCAPTCHA v3
    - [ ] Ativar enforcement
    - [ ] **Prazo:** 2 dias

---

### 🟢 P2 - DESEJÁVEL (Pode ser pós-lançamento)

11. **Analytics Privacy-First:**
    - [ ] Configurar Plausible ou similar
    - [ ] **Prazo:** Pós-MVP

12. **Templates de Conteúdo:**
    - [ ] Landing Page (textos de marketing)
    - [ ] FAQs
    - [ ] **Prazo:** Pós-MVP

---

## 📞 CONTATO NECESSÁRIO

**Para obter esses dados, agendar reunião com:**

| Papel | Dados que fornece | Urgência |
|-------|-------------------|----------|
| **Representante Legal CHS** | Razão social, SIREN, autorização | 🔴 Imediato |
| **Responsável de TI/Digital CHS** | Domínio, DNS, Google Cloud | 🔴 Imediato |
| **Marketing CHS** | URLs produtos, assets visuais | 🟡 1 semana |
| **Advogado RGPD** | Política de Privacidade, CGU, DPAs | 🔴 Imediato |
| **Financeiro/Compras CHS** | Assinatura DPAs Twilio/Bitly | 🟡 1 semana |

---

## 📊 STATUS GERAL

| Categoria | Completude | Bloqueador? |
|-----------|------------|-------------|
| **Dados Comerciais** | 🟢 **70% (7/10)** | ⚠️ Parcial (falta telefone/e-mail) |
| **Domínio/Hospedagem** | 33% (1/3) | ✅ SIM |
| **Links Produtos** | 0% (0/4) | ⚠️ Parcial |
| **Documentação Legal** | 0% (0/3) | ✅ SIM |
| **DPAs** | 50% (2/4) | ✅ SIM |
| **Assets Visuais** | 20% (1/5) | ❌ NÃO |
| **Configurações SMS** | 60% (3/5) | ✅ SIM |
| **RGPD Operacional** | 50% (4/8) | ⚠️ Parcial |

**TOTAL:** 🟡 **~40% completo** - **Progresso significativo com dados da HAM LUXURY**

### ✅ Dados Obtidos (2026-02-13):
- Razão social, SIREN/SIRET, endereço sede, representante legal
- Forma jurídica, capital social, código NAF
- TVA intracommunautaire

---

## 🎯 ESTIMATIVA DE PRAZO PARA LANÇAMENTO

**Cenário Otimista:** 2-3 semanas (se CHS fornecer dados em 5 dias úteis)
**Cenário Realista:** 4-6 semanas (incluindo revisão jurídica)
**Cenário Pessimista:** 8+ semanas (se houver atrasos em DPAs)

---

## 📝 NOTAS FINAIS

1. **RGPD é BLOQUEADOR ABSOLUTO:** Sem Política de Privacidade e DPAs, o sistema NÃO PODE ser publicado legalmente na França/UE.

2. **Número Twilio é CRÍTICO:** Sem número francês (+33), não há SMS, e SMS é o core do produto (retenção).

3. **Backend está 95% pronto:** O problema não é técnico, é **falta de dados da CHS**.

4. **Recomendação:** Agendar call URGENTE com stakeholders CHS para coletar:
   - Dados legais (1h de reunião)
   - Definir DPO e processo de assinatura de DPAs
   - Aprovar investimento em número Twilio e domínio

---

**Última atualização:** 2026-02-13
**Próxima revisão:** Após recebimento dos dados da CHS

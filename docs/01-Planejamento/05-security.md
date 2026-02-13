# Security: CronoCapilar (CHS)

## Metadados
- **Baseado em:** Brief, PRD, UX Concept, Architecture, Stack
- **Data:** 2026-02-07
- **Autor:** AI Security Auditor
- **Versão:** 1.1
- **Status:** Aprovado com controles obrigatórios

---

## 1. Security Overview

### 1.1 Classificação do Sistema
| Aspecto | Valor |
|---------|-------|
| **Dados sensíveis** | PII (e-mail, telefone) e imagens de diagnóstico capilar |
| **Compliance obrigatório** | GDPR/RGPD (França/UE) |
| **Nível de risco** | Alto |
| **Exposição** | Internet-facing (Web/PWA + APIs serverless) |

### 1.2 Princípios de Segurança
1. **Privacy by Design** em todo fluxo de dados.
2. **Least Privilege** em auth, regras e service accounts.
3. **Defense in Depth** com App Check, validação de input, rate limiting e monitoramento.
4. **Security as Gate**: sem evidência de controle, feature não entra em `Done`.

---

## 2. Threat Model

### 2.1 Atores de Ameaça
| Ator | Motivação | Capacidade | Probabilidade |
|------|-----------|-----------|---------------|
| Atacante externo | Exfiltrar PII para fraude/spam | Média | Média |
| Bot malicioso | Abusar APIs/SMS para custo | Alta | Alta |
| Usuária maliciosa | Acessar dados de terceiros | Baixa | Média |

### 2.2 Superfície de Ataque
| Superfície | Risco Principal | Mitigação Obrigatória |
|-----------|-----------------|------------------------|
| Frontend | XSS/input malicioso | Sanitização + CSP + validação client/server |
| Cloud Functions | abuso de cota e autenticação fraca | App Check + Auth check + rate limiting por IP/UID |
| Storage | acesso indevido a fotos | Storage Rules por UID + URLs assinadas com TTL |
| Integrações (Twilio/Bitly/Gemini) | vazamento de segredos | Secret Manager + rotação + escopo mínimo |

---

## 3. OWASP Top 10 Assessment

| Categoria | Aplicável | Risco | Controle |
|-----------|-----------|-------|----------|
| A01 Broken Access Control | Sim | Alto | Rules por `request.auth.uid` + testes de autorização |
| A02 Cryptographic Failures | Sim | Médio | TLS 1.3 + criptografia em repouso GCP |
| A03 Injection | Sim | Médio | Zod schemas + validação estrita de payload |
| A07 Auth Failures | Sim | Alto | Firebase Auth + reauth para ações críticas |
| A09 Logging Failures | Sim | Médio | Logs estruturados com correlação e retenção |

---

## 4. Autenticação e Autorização

### 4.1 Estratégia de Auth
- Firebase Auth (Google + e-mail/senha).
- Sessão com expiração controlada e refresh token gerenciado.
- Reautenticação obrigatória para exclusão de conta e exportação completa de dados.

### 4.2 Modelo de Autorização
- RBAC com `user` e `admin_chs` via custom claims.
- Endpoints administrativos exigem `admin_chs=true`.
- Princípio de menor privilégio para service accounts externas.

### 4.3 Política de MFA
- **Obrigatório para `admin_chs`**.
- **Opcional para `user`** no MVP, com rollout posterior.

---

## 5. Proteção de Dados e RGPD

### 5.1 Classificação e Retenção
| Dado | Classe | Armazenamento | Retenção | Base Legal |
|------|--------|---------------|----------|------------|
| E-mail/Telefone | PII | Firestore | até deleção da conta | execução do serviço |
| Fotos capilares | dado pessoal sensível | Storage | 24 meses máx. | consentimento explícito |
| Logs de segurança | técnico | Cloud Logging | 180 dias | interesse legítimo (segurança) |

### 5.2 Direitos do Titular
- Exportação de dados em JSON em até 7 dias.
- Deleção total (`Auth + Firestore + Storage`) com confirmação e trilha de auditoria.
- Revogação de opt-in SMS a qualquer momento.

---

## 6. Controles Operacionais (Auditáveis)

### 6.1 Matriz de Controles
| Controle | Frequência | Dono | Evidência |
|----------|------------|------|-----------|
| Revisão de regras Firestore/Storage | por release | Backend | PR + teste de autorização |
| Rotação de segredos (Twilio/Bitly) | a cada 90 dias | DevOps | log no Secret Manager |
| Scan de dependências (SCA) | semanal | DevOps | relatório CI |
| Testes de segurança de endpoints críticos | por sprint | QA/Security | relatório de teste |
| Verificação RGPD (consentimento/deleção/exportação) | por release | Product/Security | checklist assinado |

### 6.2 Segurança de APIs e Integrações
- Rate limiting por `uid` e por IP para rotas de SMS.
- Chaves no Google Secret Manager, nunca no código.
- Webhook verification para provedores externos quando aplicável.
- Validação de schema em todas as Functions com Zod.

### 6.3 Logging e Alertas
- Alertas para pico anômalo de erro `401/403/429`.
- Alertas para taxa de falha SMS > 10% em 15 min.
- Alertas para tentativa de acesso cross-user detectada em regras.

---

## 7. GAP Analysis: Segurança

### 7.1 Compliance GAP
| Requisito | Estado Atual | GAP | Prioridade |
|-----------|-------------|-----|------------|
| Política de privacidade em francês | Não existe | redigir, revisar e publicar | P0 |
| DPA/contratos com fornecedores | Parcial | formalizar com Twilio/Bitly | P0 |

### 7.2 GAP Inventory
| ID | Área | AS-IS | TO-BE | GAP | Severidade | Prioridade |
|----|------|-------|-------|-----|------------|------------|
| G-SEC-01 | Jurídico | sem política publicada | política aprovada e versionada | falta documentação legal FR | Alta | P0 |
| G-SEC-02 | Proteção anti-bot | parcial | proteção completa com App Check + rate limiting | endurecer abuso de API | Média | P1 |

---

## 8. Incident Response Plan
1. **Detecção:** alerta automático por anomalia de segurança.
2. **Classificação:** severidade `SEV1` a `SEV3` em até 30 min.
3. **Contenção:** revogar credenciais/token e bloquear rotas afetadas.
4. **Erradicação:** patch e validação com testes de regressão.
5. **Comunicação:** notificar titulares e autoridade quando aplicável (até 72h no RGPD).
6. **Pós-morte:** RCA com ações corretivas e prazo.

---

## 9. Gate de Segurança para `Done`
Uma story só pode ir para `Done` se tiver:
1. Evidência de teste de autorização/autenticação.
2. Evidência de validação de inputs.
3. Evidência de logs/alertas para falhas críticas.
4. Evidência de aderência RGPD quando envolver dados pessoais.

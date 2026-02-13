# Product Brief: CronoCapilar (CHS)

## Metadados
- **Data de criação:** 2026-02-06
- **Autor:** AI Product Manager
- **Versão:** 1.1
- **Status:** Aprovado para execução

---

## 1. Visão do Produto

### 1.1 Declaração de Visão
> "Para **mulheres francesas** que **buscam otimizar a saúde capilar através de um tratamento estruturado**, o **CronoCapilar** é um **assistente digital de cronograma capilar** que **automatiza o diagnóstico, a organização e a recompra de produtos da CHS**. Diferente de **anotações manuais ou tentativa e erro**, nosso produto **oferece um plano personalizado guiado por IA com lembretes inteligentes via SMS e integração com calendários digitais**."

### 1.2 Elevator Pitch (30 segundos)
O CronoCapilar é uma solução SaaS projetada para a Cosmetic Hair Shop (CHS) na França, que transforma a experiência de compra de cronogramas capilares em uma jornada de sucesso garantida. Através de um diagnóstico inteligente com análise de fotos via IA, o sistema gera um calendário personalizado exportável para o Google Calendar. O diferencial estratégico reside na retenção: o sistema prevê o esgotamento dos produtos e envia convites de recompra via SMS, combatendo o abandono do tratamento e aumentando o LTV (Life Time Value) para a loja.

---

## 2. Problema

### 2.1 Declaração do Problema
| Aspecto | Descrição |
|---------|-----------|
| **O problema** | Descontinuidade e ineficácia no tratamento capilar por falta de orientação e organização. |
| **Afeta** | Consumidoras francesas (18-45 anos) de produtos capilares CHS. |
| **O impacto é** | Abandono do tratamento, percepção de ineficácia do produto e perda de vendas recorrentes para a loja. |
| **Hoje é resolvido por** | Orientação verbal no PDV, anotações manuais e alarmes improvisados (falhos). |

### 2.2 Evidências do Problema
- Clientes compram as máscaras (H/N/R) mas não sabem a sequência correta para seu tipo de cabelo.
- Esquecimento de sessões leva ao prolongamento excessivo do tratamento, reduzindo resultados visíveis.
- O fim não antecipado do produto gera hiatos no tratamento, desmotivando a recompra imediata.

### 2.3 Consequências de Não Resolver
- **Curto prazo:** Usuárias insatisfeitas com resultados lentos.
- **Médio prazo:** Alta taxa de abandono do regime de cronograma capilar.
- **Longo prazo:** Diminuição da fidelidade à marca CHS e perda de market share para concorrentes com melhor suporte digital.

---

## 3. Solução

### 3.1 Descrição da Solução
CronoCapilar é uma plataforma web (mobile-first) que atua como o "cérebro" do tratamento capilar. Ela guia a usuária desde o diagnóstico inicial (usando IA para analisar o estado do fio) até a conclusão de cada ciclo de tratamento. A solução é 100% em francês e integrada aos serviços que o público local já utiliza (SMS, Google Calendar), garantindo fricção mínima e conformidade total com o RGPD.

### 3.2 Proposta de Valor Única (UVP)
| Diferencial | Como entregamos | Benefício para usuário |
|-------------|-----------------|----------------------|
| **Diagnóstico IA** | Gemini 3 Flash analisa fotos enviadas pela usuária. | Precisão científica na escolha do tratamento. |
| **Calendário Integrado** | Exportação nativa para Google Calendar/.ics. | Fim do esquecimento; tratamento vira um compromisso. |
| **Smart Rebuy** | Alertas de SMS baseados no cálculo real de consumo. | Conveniência total; nunca ficar sem o produto. |

### 3.3 Funcionalidades Core do MVP
| # | Funcionalidade | Descrição | Justificativa (Por que MVP?) |
|---|----------------|-----------|------------------------------|
| 1 | **Diagnóstico Inteligente** | Questionário + Análise de fotos via IA (Gemini). | Base para a personalização do tratamento. |
| 2 | **Cronograma Customizável** | Geração automática de H/N/R com ajuste de dias/horas. | Organização do tratamento conforme a rotina da cliente. |
| 3 | **Exportação de Calendário** | Integração com Google Calendar e arquivo .ics. | Garante a adesão ao tratamento através de alarmes. |
| 4 | **Alertas de Recompra (SMS)** | Notificações via Twilio com link direto para recompra. | Principal motor de receita e continuidade do plano. |
| 5 | **Módulo RGPD** | Gerenciamento de privacidade e opt-ins. | Obrigatório para operação legal no mercado francês. |

### 3.4 Fora do Escopo (Explicitamente)
| Funcionalidade | Por que não está no MVP | Versão planejada |
|----------------|-------------------------|------------------|
| E-commerce Nativo | Uso de link externo para a loja atual da CHS. | v2.0 |
| App iOS/Android Nativo | Web App (PWA) é suficiente para o lançamento. | v2.0 |
| Gamificação | Foco inicial na funcionalidade e utilidade. | v1.5 |

---

## 4. Público-Alvo

### 4.1 Persona Primária
| Atributo | Descrição |
|----------|-----------|
| **Nome fictício** | Marie, a Parisiense Cuidadosa |
| **Cargo/Papel** | Consumidora final |
| **Empresa/Contexto** | Residente em centros urbanos (Paris, Lyon), 28 anos. |
| **Objetivos** | Recuperar o brilho e saúde do cabelo de forma prática. |
| **Frustrações** | Comprar muitos produtos e não ver resultado por falta de constância. |
| **Comportamento digital** | Usuária intensa de smartphone, prefere SMS a e-mail. |
| **Quote característica** | "Eu quero cuidar do meu cabelo, mas sempre me perco em qual máscara usar hoje." |

### 4.2 Persona Secundária
| Atributo | Descrição |
|----------|-----------|
| **Nome fictício** | Marc, Gerente de Loja CHS |
| **Cargo/Papel** | Administrador do sistema |
| **Contexto** | Gerencia uma das 3 unidades físicas da CHS. |
| **Objetivos** | Aumentar a taxa de retorno das clientes e entender o giro de estoque. |
| **Frustrações** | Clientes que compram uma vez e nunca mais voltam por esquecer o produto. |

### 4.3 Anti-Persona (Quem NÃO é o público)
| Atributo | Descrição |
|----------|-----------|
| **Nome fictício** | Léa, a Minimalista |
| **Perfil** | Mulher que prefere rotinas simples e não quer compromisso com cronogramas. |
| **Por que não é o público** | Não valoriza tratamentos estruturados; prefere soluções "one-step". |
| **Comportamento** | Compra produtos aleatoriamente, não segue rotinas, desinstala apps que enviam lembretes. |
| **Risco** | Se adquirida, terá alto churn e baixo LTV. |

---

## 5. Métricas de Sucesso

### 5.1 North Star Metric
> **Active Treatment Cycles:** Número de usuárias que completaram pelo menos 1 mês de cronograma sem interrupções. Meta: **200 usuárias ativas** no primeiro trimestre (Q1 2026).

### 5.2 Métricas de Acompanhamento
| Categoria | Métrica | Meta MVP | Como medir |
|-----------|---------|----------|------------|
| **Aquisição** | Diagnósticos realizados | 500+ | Firestore |
| **Ativação** | Sincronização com Calendário | 60% das usuárias | Mixpanel / Custom Log |
| **Retenção** | Taxa de Recompra | 40% | Tracking de cliques no SMS |
| **Qualidade** | Taxa de Entrega SMS | 90%+ | Twilio Logs |

### 5.3 Critérios de Sucesso do MVP
O MVP será considerado bem-sucedido se:
- [ ] Pelo menos 500 diagnósticos forem gerados no lançamento.
- [ ] A taxa de conversão do link de recompra no SMS for superior a 15%.
- [ ] Zero incidentes de conformidade RGPD relatados.

---

## 6. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Baixa precisão da IA nas fotos** | Média | Médio | Modal explicativo de como tirar fotos boas + diagnóstico textual como backup. |
| **Custo de SMS (Twilio) na França** | Alta | Baixo | Uso do e-mail como fallback e links encurtados para reduzir caracteres. |
| **Bloqueio RGPD** | Baixa | Muito Alto | Consultoria jurídica básica sobre os termos em francês e data processing na Europa. |

---

## 7. Premissas e Restrições de Execução
| Tipo | Item | Regra |
|------|------|-------|
| Premissa | Mercado inicial | França (idioma `fr-FR`, telefone +33) |
| Premissa | Região de dados | UE (`europe-west1`) |
| Restrição | Orçamento MVP | Priorizar serverless e evitar operação manual 24/7 |
| Restrição | Prazo | Entrega incremental por sprints definidos no planejamento |
| Restrição | Qualidade | Story só fecha com evidência de teste e atualização de backlog |

### 7.1 Critérios de Go/No-Go para release MVP
1. 100% das stories P0 e P1 em `Done` com evidência.
2. Cobertura dos fluxos críticos validada em E2E.
3. Sem incidentes de segurança abertos de severidade alta.
4. Conformidade RGPD validada para consentimento, exportação e deleção.

---

## Aprovações

| Papel | Nome | Status | Data |
|-------|------|--------|------|
| Product Owner | @macbookdejoel | Pendente | - |
| Tech Lead | Antigravity AI | Pendente | - |

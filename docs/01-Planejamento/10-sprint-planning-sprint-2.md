# Sprint Planning 2: Refinamento IA & Monetização (P0/P1)

> **Contexto:**
> Após o sucesso da Sprint 1 (Infraestrutura, Diagnóstico Básico, Agenda), a Sprint 2 foca em:
> 1. Melhorar a experiência do usuário durante a análise da IA (reduzir ansiedade de espera, tratar erros).
> 2. Implementar a camada de Monetização (Checkout Stripe) para viabilizar o negócio.
> 3. Refinar a precisão da IA para garantir recomendações de qualidade.

---

## Metas da Sprint
1. **UX de Análise**: Implementar skeletons, progress bars e mensagens de espera engajantes.
2. **Robustez IA**: Tratamento de erros (retry, fallback) e melhoria nos prompts.
3. **Checkout**: Integração com Stripe para venda do plano Premium.
4. **Paywall**: Bloquear acesso total ao conteúdo para usuários Free.

---

## Tasks Planejadas (Agente Antigravity - AG)

### Epic 7: Refinamento & UX da IA
- [x] **Task AG-2.1 (Story 7.2):** Implementar Skeleton Screens e Loading State na tela de diagnóstico (`web/src/components/diagnostic/loading-state.tsx`). (2026-02-07)
- [x] **Task AG-2.2 (Story 7.2):** Criar mensagens de espera dinâmicas ("Analisando porosidade...", "Identificando curvatura..."). (2026-02-07)

### Epic 8: Monetização & Checkout
- [x] **Task AG-2.3 (Story 8.2):** Implementar lógica de Paywall no `CalendarPage` (mostrar 3 dias, bloquear o resto). (2026-02-07)
- [x] **Task AG-2.4 (Story 8.3):** Criar `UpgradePage` com comparação de planos e chamada para ação. (2026-02-07)

---

## Tasks Planejadas (Agente Claude Code - CC)

### Epic 7: Refinamento & UX da IA
- [ ] **Task CC-2.1 (Story 7.1):** Refinar Prompt do Gemini (System Instructions) para maior assertividade em fotos caseiras.
- [ ] **Task CC-2.2 (Story 7.3):** Implementar lógica de Retry (Exponential Backoff) e Fallback no Cloud Function `analyzeHair`.

### Epic 8: Monetização & Checkout
- [ ] **Task CC-2.3 (Story 8.1):** Criar endpoint `createCheckoutSession` no Firebase Functions (integração Stripe).
- [ ] **Task CC-2.4 (Story 8.1):** Configurar Webhooks do Stripe para liberar acesso Premium no Firestore.

---

## Critérios de Aceite (DoD Sprint 2)
1. Usuário vê progresso claro durante a análise (sem tela branca travada).
2. Se a análise falhar, usuário recebe orientação clara para tentar novamente.
3. Usuário Free vê apenas 3 dias do calendário e botão de "Upgrade".
4. Fluxo de pagamento no Stripe funciona em modo Teste e libera acesso imediatamente.

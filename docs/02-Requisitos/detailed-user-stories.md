# User Stories Refinadas: CronoCapilar (CHS)

Este documento contém o detalhamento técnico e os critérios de aceite (Gherkin) para todas as User Stories do Backlog, servindo como guia mestre para implementação e testes.

---

## Epic 1: Infraestrutura & Localização (P0)

### Story 1.1: Setup Vite + React 19 + Tailwind CSS
**Como** desenvolvedor, **quero** um projeto base configurado com Vite, React 19 e Tailwind CSS **para que** o time tenha uma fundação moderna, performática e padronizada para iniciar o desenvolvimento.

**Cenário: Projeto inicializado e funcional**
- **DADO QUE** o repositório está vazio ou sem estrutura de frontend.
- **QUANDO** eu executo os scripts de setup (`npm create vite@latest`, instalação de dependências e configuração de tokens Tailwind).
- **ENTÃO** o servidor de desenvolvimento deve iniciar sem erros na porta padrão.
- **E** a página inicial deve renderizar com os tokens de design (cores, tipografia) aplicados corretamente.

**Cenário: Tokens de design premium configurados**
- **DADO QUE** o Tailwind CSS está instalado.
- **QUANDO** eu verifico o arquivo `tailwind.config.ts`.
- **ENTÃO** os tokens de cores primárias, secundárias, neutras e semânticas devem estar definidos.
- **E** a escala tipográfica com as fontes do Design System deve estar configurada.

---

### Story 1.2: Configuração Firebase (Região Europeia)
**Como** desenvolvedor, **quero** o projeto Firebase configurado na região `europe-west1` **para que** os dados das usuárias francesas sejam armazenados em conformidade com o RGPD e com baixa latência.

**Cenário: Projeto Firebase inicializado na região europeia**
- **DADO QUE** o Firebase CLI está instalado e autenticado.
- **QUANDO** eu executo `firebase init` com Firestore, Auth, Functions e Storage.
- **ENTÃO** o projeto deve ser criado com a região padrão `europe-west1`.
- **E** o arquivo `.firebaserc` deve conter o ID do projeto CHS.

**Cenário: Firestore Rules com segurança básica**
- **DADO QUE** o Firestore está inicializado.
- **QUANDO** eu verifico as regras de segurança (`firestore.rules`).
- **ENTÃO** as coleções `users` e `diagnostics` devem exigir autenticação para leitura e escrita.
- **E** cada usuária só deve poder acessar seus próprios documentos (`request.auth.uid == resource.data.userId`).

---

### Story 1.3: Framework de Localização (i18next)
**Como** desenvolvedor, **quero** um sistema de internacionalização configurado **para que** a aplicação suporte múltiplos idiomas, com foco inicial no francês (FR) e inglês (EN).

**Cenário: Troca de idioma dinâmica**
- **DADO QUE** a aplicação está configurada com i18next e chaves em `fr` e `en`.
- **QUANDO** eu altero o idioma nas configurações para "English".
- **ENTÃO** todos os componentes que utilizam a hook `useTranslation` devem atualizar seu texto instantaneamente sem recarregar a página.
- **E** o idioma escolhido deve ser persistido no `localStorage`.

### Story 1.4: CI/CD Pipeline (Vercel/GitHub Actions)
**Como** desenvolvedor, **quero** um pipeline de CI/CD automatizado **para que** cada push na branch `main` gere um deploy automático com verificações de qualidade.

**Cenário: Deploy automático via push na main**
- **DADO QUE** o repositório está conectado ao Vercel e ao GitHub Actions.
- **QUANDO** eu faço um push na branch `main`.
- **ENTÃO** o GitHub Actions deve executar lint, type-check e build sem erros.
- **E** o Vercel deve realizar o deploy automático para o ambiente de produção.

**Cenário: Preview deploy em Pull Request**
- **DADO QUE** uma Pull Request é aberta contra a branch `main`.
- **QUANDO** o CI completa com sucesso.
- **ENTÃO** o Vercel deve gerar uma URL de preview única para aquela PR.
- **E** o status check deve aparecer como "passed" no GitHub.

---

## Epic 2: Autenticação & Perfil de Usuária (P0)

### Story 2.1: Login Social & E-mail (Firebase Auth)
**Como** usuária, **quero** me autenticar de forma simples usando Google ou e-mail/senha **para que** meus dados de diagnóstico sejam salvos com segurança.

**Cenário: Login com Google com sucesso**
- **DADO QUE** estou na tela de Login.
- **QUANDO** clico no botão "Se connecter com Google".
- **ENTÃO** um pop-up de autenticação do Google deve aparecer.
- **E** após o sucesso, devo ser redirecionada para o Dashboard principal.
- **E** meu registro deve ser criado na coleção `users` se for o primeiro acesso.

### Story 2.2: Gestão de Perfil & Preferências
**Como** usuária, **quero** completar e editar meu perfil com informações capilares e preferências de notificação **para que** o sistema personalize meu cronograma e comunicações.

**Cenário: Preenchimento de perfil na primeira vez**
- **DADO QUE** fiz login pela primeira vez e meu perfil está incompleto.
- **QUANDO** eu preencho os campos `hairType`, `hairLength`, `preferredLanguage` e `phoneNumber` e clico em "Enregistrer".
- **ENTÃO** os dados devem ser salvos na coleção `users` no Firestore com o campo `profileComplete: true`.
- **E** devo ser redirecionada para o Dashboard principal.

**Cenário: Edição de preferências existentes**
- **DADO QUE** meu perfil já está completo.
- **QUANDO** eu acesso "Mon Profil" e altero meu número de telefone.
- **ENTÃO** o campo `phoneNumber` deve ser atualizado no Firestore.
- **E** o campo `updatedAt` deve refletir o timestamp da alteração.

### Story 2.3: Gestão de Consentimento SMS (Opt-in)
**Como** sistema responsável, **quero** capturar o consentimento explícito da usuária para envio de SMS **para que** a operação esteja em conformidade com o RGPD.

**Cenário: Consentimento obrigatório para notificações SMS**
- **DADO QUE** estou na tela de conclusão de perfil.
- **QUANDO** seleciono a opção "Receber alertas de tratamento por SMS".
- **ENTÃO** o campo `optInSMS` deve ser salvo como `true` no Firestore.
- **E** deve ser registrado um log com o Timestamp do consentimento.

---

## Epic 3: Módulo de Diagnóstico IA (P0)

### Story 3.1: Upload de Fotos (Firebase Storage)
**Como** usuária, **quero** enviar fotos do meu cabelo durante o diagnóstico **para que** a IA possa analisar visualmente o estado capilar.

**Cenário: Upload de foto com sucesso**
- **DADO QUE** estou no passo de upload do Wizard de Diagnóstico.
- **QUANDO** eu seleciono uma foto da galeria ou tiro uma foto com a câmera do celular.
- **ENTÃO** a imagem deve ser enviada para o Firebase Storage no path `users/{userId}/diagnostics/{diagnosticId}/`.
- **E** uma barra de progresso deve indicar o percentual de upload.
- **E** um preview da imagem deve ser exibido após o upload completo.

**Cenário: Validação de formato e tamanho**
- **DADO QUE** estou no passo de upload.
- **QUANDO** eu tento enviar um arquivo que não é imagem (ex: PDF) ou uma imagem maior que 10MB.
- **ENTÃO** o sistema deve exibir uma mensagem de erro em francês: "Format non supporté. Veuillez envoyer une image JPG ou PNG de moins de 10 Mo."
- **E** o upload não deve ser iniciado.

### Story 3.2: Integração Gemini 3 Flash (Cloud Function)
**Como** sistema, **quero** enviar as fotos capilares para a API do Gemini **para que** a IA realize uma análise técnica detalhada.

**Cenário: Análise bem-sucedida de foto capilar**
- **DADO QUE** uma foto foi enviada para o Firebase Storage.
- **QUANDO** a Cloud Function `analyzeHair` é triggada.
- **ENTÃO** ela deve invocar o modelo Gemini 3 Flash com o prompt técnico em francês.
- **E** o retorno deve ser um JSON estruturado contendo `{ hairType, porosity, recommendedAction, technicalSummary }`.

### Story 3.3: Parser de Resultados de Diagnóstico
**Como** sistema, **quero** converter a resposta bruta do Gemini em uma entidade estruturada `diagnostics` **para que** os dados possam ser armazenados no Firestore e consumidos pelo frontend.

**Cenário: Parsing bem-sucedido da resposta da IA**
- **DADO QUE** a Cloud Function `analyzeHair` retornou um JSON bruto do Gemini.
- **QUANDO** o parser processa a resposta.
- **ENTÃO** deve ser criado um documento na coleção `diagnostics` com os campos `userId`, `hairType`, `porosity`, `recommendedAction`, `technicalSummary`, `photoUrls[]` e `createdAt`.
- **E** o campo `status` deve ser definido como `"completed"`.

**Cenário: Resposta da IA com formato inesperado**
- **DADO QUE** o Gemini retorna uma resposta que não segue o schema esperado.
- **QUANDO** o parser tenta extrair os campos obrigatórios.
- **ENTÃO** o sistema deve registrar o erro no Cloud Logging com o payload bruto da resposta.
- **E** o campo `status` do diagnóstico deve ser definido como `"failed"`.
- **E** a usuária deve ver a mensagem: "Analyse indisponible. Veuillez réessayer."

### Story 3.4: UI de Diagnóstico (Wizard)
**Como** usuária, **quero** um fluxo guiado de diagnóstico **para que** a coleta de informações seja clara e não exaustiva.

**Cenário: Navegação entre passos do Wizard**
- **DADO QUE** iniciei o diagnóstico.
- **QUANDO** preencho as perguntas do passo 1 e clico em "Continuer".
- **ENTÃO** o Wizard deve avançar para o passo 2 com uma animação suave.
- **E** deve haver uma barra de progresso indicando que estou em "1 de 4".

---

## Epic 4: Cronograma Capilar Inteligente (P0)

### Story 4.1: Gerador de Ciclo H/N/R
**Como** sistema, **quero** aplicar regras lógicas ao resultado do diagnóstico **para que** um calendário de 4 semanas seja gerado.

**Cenário: Geração de ciclo para cabelo ressecado (Dry)**
- **DADO QUE** o diagnóstico resultou em `hairType: "dry"`.
- **QUANDO** o gerador processa o ciclo.
- **ENTÃO** a sequência deve priorizar Hidratação (H), com pelo menos 2 sessões de H por semana nas primeiras 2 semanas.

### Story 4.2: Visualização de Calendário (Next 7 Days)
**Como** usuária, **quero** ver os próximos 7 dias do meu cronograma capilar **para que** eu saiba qual tratamento aplicar a cada dia da semana.

**Cenário: Exibição dos próximos 7 dias**
- **DADO QUE** meu cronograma foi gerado com sucesso.
- **QUANDO** eu acesso a tela "Mon Calendrier".
- **ENTÃO** devo ver uma lista dos próximos 7 dias com o tipo de tratamento (H, N ou R) e o produto recomendado para cada dia.
- **E** o dia atual deve estar visualmente destacado.

**Cenário: Dia sem tratamento agendado**
- **DADO QUE** o cronograma não prevê tratamento para um dia específico.
- **QUANDO** esse dia aparece na lista dos próximos 7 dias.
- **ENTÃO** ele deve exibir a mensagem "Jour de repos" com um ícone de descanso.

### Story 4.3: Sincronização (.ics / G-Calendar)
**Como** usuária, **quero** exportar meu cronograma capilar para o Google Calendar ou como arquivo .ics **para que** eu receba lembretes nativos no meu celular.

**Cenário: Exportação para Google Calendar**
- **DADO QUE** meu cronograma está definido e eu estou autenticada com Google.
- **QUANDO** eu clico em "Synchroniser avec Google Calendar".
- **ENTÃO** os eventos de tratamento devem ser criados no Google Calendar da usuária via API.
- **E** cada evento deve incluir um alarme (reminder) 1 hora antes do horário configurado.

**Cenário: Download de arquivo .ics**
- **DADO QUE** meu cronograma está definido.
- **QUANDO** eu clico em "Télécharger .ics".
- **ENTÃO** um arquivo `.ics` contendo todos os eventos das 4 semanas deve ser gerado e baixado.
- **E** o arquivo deve ser compatível com Apple Calendar e Outlook.

---

## Epic 5: Engine de Notificação & Recompra (P1)

### Story 5.1: Cálculo de Consumo Virtual
**Como** sistema, **quero** estimar o consumo de produto da usuária com base no cronograma e na quantidade por sessão **para que** eu saiba quando o produto vai acabar e dispare alertas de recompra.

**Cenário: Cálculo de estoque virtual após geração do cronograma**
- **DADO QUE** a usuária possui um cronograma ativo e registrou o produto com volume inicial (ex: 300ml).
- **QUANDO** o sistema calcula o consumo com base em `mlPerSession` (ex: 30ml) e frequência de uso.
- **ENTÃO** o campo `estimatedDepletionDate` deve ser calculado e salvo na coleção `userProducts`.
- **E** o campo `remainingMl` deve ser atualizado após cada sessão do cronograma.

**Cenário: Produto próximo do esgotamento**
- **DADO QUE** o `remainingMl` é menor ou igual a `mlPerSession * 2` (duas sessões restantes).
- **QUANDO** o cron job diário verifica os estoques virtuais.
- **ENTÃO** o sistema deve marcar o produto como `lowStock: true`.
- **E** deve agendar o envio de um alerta SMS de recompra.

### Story 5.2: Integração Twilio SMS (+33)
**Como** sistema, **quero** enviar SMS antes de cada tratamento **para que** a usuária não esqueça de realizar o cronograma.

**Cenário: Falha no envio de SMS**
- **DADO QUE** o serviço do Twilio retorna erro ao tentar enviar um SMS para a França (+33).
- **QUANDO** o erro é capturado pela Cloud Function.
- **ENTÃO** o sistema deve registrar a falha no log e tentar um fallback via E-mail (SendGrid).

### Story 5.3: Encurtamento de Links (Bit.ly)
**Como** sistema, **quero** encurtar os links de recompra via Bit.ly **para que** os SMS sejam concisos e os cliques possam ser rastreados para métricas de conversão.

**Cenário: Encurtamento de link com sucesso**
- **DADO QUE** um alerta de recompra SMS está pronto para envio.
- **QUANDO** a Cloud Function chama a API do Bit.ly com a URL do produto na loja CHS.
- **ENTÃO** a API deve retornar um link encurtado no formato `https://bit.ly/xxxxx`.
- **E** o link encurtado deve ser inserido no corpo do SMS antes do envio.
- **E** o `bitlyId` deve ser salvo na coleção `smsLogs` para rastreamento.

**Cenário: Fallback quando Bit.ly está indisponível**
- **DADO QUE** a API do Bit.ly retorna um erro ou timeout.
- **QUANDO** a Cloud Function tenta encurtar o link.
- **ENTÃO** o sistema deve usar a URL original (não encurtada) no SMS.
- **E** deve registrar um warning no Cloud Logging.

---

## Epic 6: Dashboard Admin & Analytics (P2)

### Story 6.1: Dashboard de Conversão
**Como** administrador, **quero** ver o funil de vendas **para que** eu saiba quantas usuárias que fizeram diagnóstico clicaram no link de compra.

**Cenário: Visualização de Taxa de Cliques (CTR)**
- **DADO QUE** estou no Dashboard Admin.
- **QUANDO** seleciono o período "Últimos 30 dias".
- **ENTÃO** devo ver um gráfico comparando `diagnósticos_feitos` vs `links_bitly_clicados`.

### Story 6.2: Agregador de Métricas (Cloud Schedule)
**Como** sistema, **quero** consolidar métricas de uso diariamente via Cloud Scheduler **para que** o Dashboard Admin exiba dados atualizados sem impactar a performance em tempo real.

**Cenário: Execução diária do agregador**
- **DADO QUE** o Cloud Scheduler está configurado para executar às 02:00 UTC diariamente.
- **QUANDO** a Cloud Function `aggregateMetrics` é triggada.
- **ENTÃO** deve consolidar os KPIs do dia anterior: `totalDiagnostics`, `totalSMSSent`, `totalBitlyClicks`, `conversionRate`.
- **E** o documento consolidado deve ser salvo na coleção `adminMetrics` com a data como ID.

**Cenário: Falha na agregação**
- **DADO QUE** a Cloud Function `aggregateMetrics` falha durante a execução.
- **QUANDO** o erro é capturado.
- **ENTÃO** o sistema deve registrar o erro no Cloud Logging com severidade `ERROR`.
- **E** deve enviar uma notificação ao e-mail do administrador CHS via SendGrid.
- **E** a execução anterior (dia anterior) deve permanecer intacta na coleção `adminMetrics`.

---

## ✅ Definição de Concluído (DoD Genérico)
Para todas as stories acima, a implementação só será considerada **DONE** se:
1.  Os cenários Gherkin passarem em testes manuais ou automatizados.
2.  Textos na UI estiverem em Francês fluente.
3.  Logs de erro estejam implementados para monitoramento.

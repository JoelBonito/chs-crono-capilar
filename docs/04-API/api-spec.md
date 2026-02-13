# API Specification: CronoCapilar (CHS)

## Metadados
- **Baseado em:** Architecture, PRD, Detailed User Stories
- **Data:** 2026-02-07
- **Base URL:** `https://europe-west1-{project-id}.cloudfunctions.net`
- **Autor:** AI Backend Specialist
- **Versão:** 1.0

---

## 1. Visão Geral
Esta API é composta por **Firebase Cloud Functions (2nd Gen)** servidas na região `europe-west1`. Ela gerencia a inteligência do diagnóstico capilar, as integrações de terceiros e a automação do cronograma.

---

## 2. Endpoints: Diagnóstico & IA

### `POST /analyzeHair`
Envia metadados de uma foto já hospedada no Firebase Storage para processamento via Gemini 3 Flash (Vertex AI).

- **Auth:** Firebase JWT (Bearer Token)
- **Rate Limit:** 5 requisições/dia por UID
- **Requisição:**
```json
{
  "userId": "uid_123",
  "photoUrls": ["https://firebasestorage.../photo1.jpg"],
  "context": {
    "scalpType": "oily",
    "washingFrequency": "daily"
  }
}
```

- **Resposta (200 OK):**
```json
{
  "diagnosticId": "diag_123",
  "hairType": "dry",
  "porosity": "medium",
  "recommendedAction": "Prioriser l'hydratation (H) avec 2 séances par semaine.",
  "technicalSummary": "Cheveux secs avec porosité moyenne. Cuticules légèrement ouvertes.",
  "analyzedAt": "2026-02-07T14:30:00Z",
  "geminiModelVersion": "gemini-3-flash-001"
}
```

- **Erros:**
  - `400 Bad Request`: Dados inválidos ou fotos ausentes.
  - `429 Too Many Requests`: Rate limit excedido.
  - `500 Error`: Falha na integração com Gemini (fallback: diagnóstico textual).

---

### `POST /generateSchedule`
Gera o ciclo de 4 semanas baseado no diagnóstico.

- **Auth:** Firebase JWT (Bearer Token)
- **Requisição:**
```json
{
  "diagnosticId": "diag_456",
  "userId": "uid_123",
  "startAt": "2026-02-10T00:00:00Z",
  "daysOfWeek": [1, 3, 5],
  "time": "20:00"
}
```

- **Resposta (201 Created):**
```json
{
  "scheduleId": "sch_789",
  "diagnosticId": "diag_456",
  "sequence": ["H", "H", "N", "H", "R", "H", "N", "H", "R", "H", "N", "R"],
  "status": "active",
  "calendarEvents": [...]
}
```

---

## 3. Endpoints: Notificações & Canais

### `POST /triggerNotification` (Internal/System Only)
Envia SMS (Twilio) ou E-mail (SendGrid) baseado em gatilhos do sistema.

- **Segurança:** Apenas Admin SDK (Cloud Functions). Não exposto publicamente.
- **Rate Limit:** 3 SMS/dia por UID
- **Corpo:**
```json
{
  "userId": "uid_123",
  "type": "rebuy_alert" | "treatment_reminder" | "welcome",
  "channel": "sms" | "email",
  "data": {
    "productLink": "https://bit.ly/...",
    "treatmentName": "Hydratation",
    "phoneNumber": "+33612345678"
  }
}
```

- **Resposta (200 OK):**
```json
{
  "notificationId": "notif_456",
  "status": "sent",
  "channel": "sms",
  "bitlyLink": "https://bit.ly/abc123"
}
```

- **Fallback:** Se Twilio falha, tenta SendGrid (email). Status registrado na coleção `notifications`.
```

---

## 4. Endpoints: Utilitários & Admin

### `GET /syncCalendar/{uid}.ics`
Gera um arquivo iCal para ser assinado no Google Calendar ou Outlook.

- **Resposta:** Header `Content-Type: text/calendar`.

### `GET /getAdminStats`
Retorna métricas consolidadas para o Dashboard Admin.

- **Auth:** Firebase JWT com Custom Claim `role: "admin_chs"`
- **Filtros (Query Params):** `startDate`, `endDate`
- **Resposta (200 OK):**
```json
{
  "period": { "start": "2026-01-01", "end": "2026-01-31" },
  "totalDiagnostics": 1250,
  "totalSMSSent": 890,
  "smsDelivered": 872,
  "smsFailed": 18,
  "bitlyClicks": 401,
  "conversionRate": 0.45,
  "newUsers": 320,
  "activeSchedules": 580
}
```

---

## 5. Padrão de Erros

| Código | Descrição | Sugestão de UI |
|--------|-----------|---------------|
| `auth/unauthorized` | Falta Token JWT | Redirecionar para Login |
| `diagnostic/invalid-photo` | Foto com baixa qualidade | Pedir para tirar nova foto |
| `integration/provider-down` | Twilio/Gemini fora do ar | Mostrar "Modo Offline" ou Fallback |

---

## 6. GAP Analysis: API & Backend

| ID | Área | GAP | Impacto | Esforço |
|----|------|-----|---------|---------|
| G-API-01 | Performance | Cold Start nas Functions de IA. | Latência > 5s no primeiro diagnóstico. | Baixo (Warm-up instances) |
| G-API-02 | Segurança | Rate Limit no endpoint de diagnóstico. | Custo de API IA se houver abuso. | Médio (App Check + Throttling) |

---

## ✅ Definição de Concluído (Backend API)
- [ ] Endpoints testados localmente via Firebase Emulator.
- [ ] Documentação de schemas Zod integrada no código.
- [ ] Logs estruturados presentes em todas as funções.

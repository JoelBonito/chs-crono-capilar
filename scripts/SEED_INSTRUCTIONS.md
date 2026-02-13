# 🌱 Como Popular o Emulator com Dados de Teste

## Método 1: Via Interface do Emulator (Recomendado)

1. **Acesse a UI do Emulator**: http://127.0.0.1:4000

2. **Crie um usuário de teste no Auth**:
   - Vá em "Authentication"
   - Clique em "Add user"
   - Email: `marie@test.fr`
   - Password: `password123`
   - Copie o **User UID** gerado

3. **Faça login no app**:
   - Abra http://localhost:5174/login
   - Use `marie@test.fr` / `password123`
   - Complete o onboarding se necessário

4. **Use o app normalmente**:
   - Faça o diagnostic
   - Os dados serão salvos automaticamente no emulator
   - Visualize no Firestore em http://127.0.0.1:4000/firestore

---

## Método 2: Script Automático (Em desenvolvimento)

O script `npm run seed` está em desenvolvimento. Por enquanto, use o Método 1 acima.

---

## Ver Dados Criados

- **Auth**: http://127.0.0.1:4000/auth
- **Firestore**: http://127.0.0.1:4000/firestore
- **Functions Logs**: http://127.0.0.1:4000/logs

---

## Resetar Dados

Para limpar todos os dados e recomeçar:

```bash
# Parar os emulators (Ctrl+C)
# Reiniciar
npm run dev:emulators
```

Os emulators sempre começam vazios (dados não persistem entre reinícios).

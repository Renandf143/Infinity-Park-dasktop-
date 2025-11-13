# 🚀 COMO INICIAR O PROJETO SERVIFLEX

## 📋 PRÉ-REQUISITOS

- Node.js 18+ instalado
- MongoDB Atlas configurado
- Firebase configurado

---

## ⚡ INÍCIO RÁPIDO (3 PASSOS)

### 1️⃣ Backend de Upload (Terminal 1)

```bash
cd backend-upload
npm install
copy .env.example .env
```

Edite o `.env` e adicione sua senha do MongoDB:
```env
MONGODB_URI=mongodb+srv://renangomesdf3_db_user:SUA_SENHA@serviflex.p2ce0wt.mongodb.net/?appName=ServiFlex
```

Inicie o backend:
```bash
npm run dev
```

✅ Backend rodando em: `http://localhost:5001`

---

### 2️⃣ Frontend (Terminal 2)

```bash
cd ..
npm install
```

Edite o `.env` e adicione:
```env
VITE_UPLOAD_BACKEND_URL=http://localhost:5001
```

Inicie o frontend:
```bash
npm run dev
```

✅ Frontend rodando em: `http://localhost:5173`

---

### 3️⃣ Configurar Firebase Storage (Opcional)

Para usar Firebase Storage em vez de GridFS:

1. Acesse: https://console.firebase.google.com/project/serviflex-f5ba3/storage/rules

2. Cole estas regras:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Clique em "Publicar"

---

## 🧪 TESTAR

### 1. Testar Backend:
```bash
curl http://localhost:5001/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "mongodb": "connected"
}
```

### 2. Testar Frontend:
1. Abra: http://localhost:5173
2. Faça login
3. Abra um chat
4. Tente enviar uma imagem
5. Deve funcionar! ✅

---

## 📁 ESTRUTURA DO PROJETO

```
projeto-serviflex-main/
├── backend-upload/          # Backend Node.js para uploads
│   ├── server.js           # Servidor Express + GridFS
│   ├── package.json
│   └── .env               # Configurações do backend
│
├── src/                    # Frontend React
│   ├── components/        # Componentes React
│   ├── services/          # Serviços (API, Firebase, etc)
│   └── pages/             # Páginas
│
├── .env                    # Configurações do frontend
└── package.json
```

---

## 🔧 CONFIGURAÇÕES

### Backend (.env):
```env
MONGODB_URI=mongodb+srv://...
PORT=5001
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env):
```env
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Backend de Upload
VITE_UPLOAD_BACKEND_URL=http://localhost:5001
```

---

## 🐛 PROBLEMAS COMUNS

### Backend não inicia:
```bash
# Verificar se a porta 5001 está livre
netstat -ano | findstr :5001

# Matar processo se necessário
taskkill /PID <PID> /F
```

### Erro de CORS:
- Verificar se `FRONTEND_URL` no backend está correto
- Verificar se backend está rodando
- Limpar cache do navegador

### MongoDB não conecta:
- Verificar senha no `.env`
- Verificar se IP está na whitelist do MongoDB Atlas
- Testar conexão: https://cloud.mongodb.com/

### Firebase Storage bloqueado:
- Seguir passo 3 acima para configurar regras
- Ou usar GridFS (já configurado)

---

## 📊 PORTAS USADAS

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend Upload | 5001 | http://localhost:5001 |
| Backend Principal | 5000 | http://localhost:5000 |

---

## ✅ CHECKLIST

- [ ] Node.js instalado
- [ ] MongoDB Atlas configurado
- [ ] Firebase configurado
- [ ] Backend de upload rodando (porta 5001)
- [ ] Frontend rodando (porta 5173)
- [ ] Teste de upload funcionando
- [ ] Chat funcionando

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Testar todas as funcionalidades do chat
2. ✅ Configurar Firebase Storage (opcional)
3. ✅ Fazer deploy do backend
4. ✅ Fazer deploy do frontend
5. ✅ Configurar domínio personalizado

---

## 📞 SUPORTE

Problemas? Verifique:
1. Logs do backend (Terminal 1)
2. Console do navegador (F12)
3. Arquivos `.env` configurados
4. Portas não estão em uso

---

**Tempo estimado:** 10 minutos
**Dificuldade:** ⭐⭐ Fácil
**Status:** ✅ Pronto para uso

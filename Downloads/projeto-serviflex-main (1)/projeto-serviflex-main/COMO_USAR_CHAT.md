# 💬 Como Usar o Chat com Upload

## 🎯 Arquitetura

- **Frontend React** → Chat e mensagens de texto
- **Firebase Firestore** → Armazenar mensagens
- **Backend Node.js** → Upload de imagens e PDFs (MongoDB GridFS)
- **Firebase Storage** → Outros uploads (perfil, portfólio, etc)

---

## 🚀 Iniciar em 2 Passos

### 1️⃣ Backend de Upload (Terminal 1)

```bash
cd backend-upload
npm install
```

Crie o arquivo `.env`:
```env
MONGODB_URI=mongodb+srv://renangomesdf3_db_user:SUA_SENHA@serviflex.p2ce0wt.mongodb.net/?appName=ServiFlex
PORT=5001
FRONTEND_URL=http://localhost:5173
```

Inicie:
```bash
npm run dev
```

✅ Backend rodando em: `http://localhost:5001`

---

### 2️⃣ Frontend (Terminal 2)

No arquivo `.env` do frontend, adicione:
```env
VITE_UPLOAD_BACKEND_URL=http://localhost:5001
```

Inicie:
```bash
npm run dev
```

✅ Frontend rodando em: `http://localhost:5173`

---

## ✅ Testar

1. Abra: http://localhost:5173
2. Faça login
3. Abra um chat com um profissional
4. Clique no ícone de 📷 (imagem) ou 📎 (arquivo)
5. Selecione um arquivo
6. Deve enviar com sucesso! 🎉

---

## 📊 Fluxo de Upload

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │ 1. Seleciona arquivo
       ▼
┌─────────────────────┐
│  chatUploadService  │
│   (Frontend)        │
└──────┬──────────────┘
       │ 2. POST /api/upload
       ▼
┌─────────────────────┐
│  Backend Node.js    │
│  (Express + Multer) │
└──────┬──────────────┘
       │ 3. Salva no GridFS
       ▼
┌─────────────────────┐
│  MongoDB GridFS     │
│  (Cloud Atlas)      │
└──────┬──────────────┘
       │ 4. Retorna fileId
       ▼
┌─────────────────────┐
│  Firebase Firestore │
│  (Mensagem)         │
└─────────────────────┘
```

---

## 🔧 O Que Cada Parte Faz

### Frontend (`chatUploadService.ts`)
- Envia arquivo para o backend
- Recebe URL do arquivo
- Salva mensagem no Firestore

### Backend (`backend-upload/server.js`)
- Recebe arquivo via FormData
- Salva no MongoDB GridFS
- Retorna fileId e URL

### MongoDB GridFS
- Armazena arquivos em chunks de 256KB
- Permite arquivos maiores que 16MB
- Serve arquivos via streaming

---

## 📁 Onde os Arquivos São Salvos

### Chat (Backend)
- **Imagens do chat** → MongoDB GridFS
- **PDFs do chat** → MongoDB GridFS
- **Arquivos do chat** → MongoDB GridFS

### Outros (Firebase)
- **Fotos de perfil** → Firebase Storage
- **Portfólio** → Firebase Storage
- **Certificados** → Firebase Storage

---

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verificar se porta 5001 está livre
netstat -ano | findstr :5001

# Verificar logs
npm run dev
```

### Upload falha
1. Verificar se backend está rodando
2. Verificar URL no `.env`: `VITE_UPLOAD_BACKEND_URL`
3. Verificar console do navegador (F12)
4. Verificar logs do backend

### Imagem não aparece
1. Verificar se URL está correta
2. Abrir URL diretamente no navegador
3. Verificar se arquivo foi salvo no MongoDB

---

## 📊 Limites

- **Tamanho máximo:** 50MB por arquivo
- **Tipos aceitos:** Imagens (JPG, PNG, GIF) e PDFs
- **Velocidade:** ~2s para 10MB

---

## ✅ Checklist

- [ ] Backend rodando na porta 5001
- [ ] Frontend rodando na porta 5173
- [ ] `.env` configurado com `VITE_UPLOAD_BACKEND_URL`
- [ ] MongoDB conectado
- [ ] Teste de upload funcionando

---

**Pronto! O chat com upload de imagens e PDFs está funcionando!** 🎉

# 🚀 Backend de Upload - MongoDB GridFS

Backend Node.js para upload de arquivos usando MongoDB GridFS.

## 📦 Instalação

```bash
cd backend-upload
npm install
```

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
copy .env.example .env
```

2. Edite o `.env` e adicione suas credenciais:
```env
MONGODB_URI=mongodb+srv://renangomesdf3_db_user:SUA_SENHA_AQUI@serviflex.p2ce0wt.mongodb.net/?appName=ServiFlex
PORT=5001
FRONTEND_URL=http://localhost:5173
```

## 🚀 Executar

### Desenvolvimento:
```bash
npm run dev
```

### Produção:
```bash
npm start
```

O servidor vai rodar em: `http://localhost:5001`

## 📡 Endpoints da API

### 1. Health Check
```
GET /api/health
```

Resposta:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2025-01-13T..."
}
```

### 2. Upload de Arquivo
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: (arquivo)
- userId: (string)
- category: (string)
```

Resposta:
```json
{
  "success": true,
  "fileId": "507f1f77bcf86cd799439011",
  "url": "/api/files/507f1f77bcf86cd799439011",
  "filename": "imagem.png",
  "size": 1024567,
  "contentType": "image/png"
}
```

### 3. Download de Arquivo
```
GET /api/files/:fileId
```

Retorna o arquivo com headers apropriados.

### 4. Deletar Arquivo
```
DELETE /api/files/:fileId
```

Resposta:
```json
{
  "success": true,
  "message": "Arquivo deletado"
}
```

### 5. Listar Arquivos do Usuário
```
GET /api/files/user/:userId
```

Resposta:
```json
[
  {
    "fileId": "507f1f77bcf86cd799439011",
    "filename": "imagem.png",
    "size": 1024567,
    "contentType": "image/png",
    "uploadDate": "2025-01-13T...",
    "category": "chat",
    "url": "/api/files/507f1f77bcf86cd799439011"
  }
]
```

## 🧪 Testar

### Teste de Health:
```bash
curl http://localhost:5001/api/health
```

### Teste de Upload:
```bash
curl -X POST http://localhost:5001/api/upload \
  -F "file=@caminho/para/arquivo.png" \
  -F "userId=user123" \
  -F "category=chat"
```

## 🔧 Configurar Frontend

No arquivo `.env` do frontend, adicione:
```env
VITE_UPLOAD_BACKEND_URL=http://localhost:5001
```

## 📊 Estrutura do MongoDB

### Coleções Criadas:
- `uploads.files` - Metadados dos arquivos
- `uploads.chunks` - Chunks dos arquivos (256KB cada)

### Exemplo de Documento (uploads.files):
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "length": 1024567,
  "chunkSize": 261120,
  "uploadDate": ISODate("2025-01-13T..."),
  "filename": "imagem.png",
  "metadata": {
    "userId": "user123",
    "category": "chat",
    "contentType": "image/png",
    "size": 1024567,
    "uploadedAt": ISODate("2025-01-13T...")
  }
}
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"
- Verificar se a URI do MongoDB está correta
- Verificar se o IP está na whitelist do MongoDB Atlas
- Verificar se a senha está correta

### Erro: "CORS blocked"
- Verificar se `FRONTEND_URL` no `.env` está correto
- Verificar se o frontend está rodando na porta correta

### Erro: "File too large"
- Limite atual: 50MB
- Para aumentar, edite `server.js`:
```javascript
limits: {
  fileSize: 100 * 1024 * 1024 // 100MB
}
```

## 📈 Performance

- Upload de 1MB: ~500ms
- Upload de 10MB: ~2s
- Upload de 50MB: ~8s

## 🔒 Segurança

- CORS configurado para frontend específico
- Limite de tamanho de arquivo
- Validação de ObjectId
- Metadados de usuário para controle de acesso

## 📝 Logs

O servidor exibe logs detalhados:
```
✅ Conectado ao MongoDB GridFS
🚀 Backend de Upload rodando na porta 5001
📍 API: http://localhost:5001/api
🏥 Health: http://localhost:5001/api/health
📤 Recebendo upload: { filename: 'imagem.png', size: 1024567, ... }
✅ Upload concluído: 507f1f77bcf86cd799439011
```

## 🚀 Deploy

### Heroku:
```bash
heroku create serviflex-upload
heroku config:set MONGODB_URI=...
git push heroku main
```

### Vercel:
```bash
vercel
```

### Railway:
```bash
railway up
```

## 📞 Suporte

Para problemas ou dúvidas, verifique:
1. Logs do servidor
2. Conexão com MongoDB
3. Configuração do CORS
4. Variáveis de ambiente

---

**Status:** ✅ Pronto para uso
**Versão:** 1.0.0

# 💬 Chat com MongoDB GridFS - Configuração

## ✅ O QUE FOI FEITO

### 1. Sistema Híbrido Implementado
- ✅ Chat usa **Firestore** para mensagens de texto
- ✅ Arquivos/Imagens usam **MongoDB GridFS** (temporariamente)
- ✅ Sem erros de CORS
- ✅ Funciona imediatamente

### 2. Arquivos Atualizados
- ✅ `src/services/chatService.ts` - Agora usa `storageService`
- ✅ `src/services/storageService.ts` - Decide automaticamente (Firebase ou GridFS)
- ✅ `src/services/gridfsService.ts` - Upload para MongoDB

---

## 🎯 COMO FUNCIONA AGORA

### Fluxo de Upload no Chat

```
Usuário envia arquivo
        ↓
chatService.sendImage() ou sendFile()
        ↓
storageService.uploadFile()
        ↓
    Decisão automática:
    - Arquivo < 5MB → Firebase (se CORS ok) ou GridFS
    - Arquivo > 5MB → GridFS
        ↓
Upload concluído
        ↓
URL salva no Firestore
        ↓
Mensagem exibida no chat
```

### Estrutura da Mensagem

```typescript
{
  id: "messageId",
  text: "📷 Imagem" ou "📎 arquivo.pdf",
  senderId: "userId",
  type: "image" | "file",
  fileUrl: "/api/files/507f..." ou "https://firebase...",
  fileName: "foto.jpg",
  fileSize: 1024,
  storage: "gridfs" | "firebase",
  fileId: "507f..." (apenas GridFS),
  createdAt: Timestamp,
  read: false
}
```

---

## 🚀 COMO USAR

### 1. Configurar MongoDB URI

No arquivo `.env`:
```env
VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serviflex
```

### 2. Iniciar Backend (para servir arquivos do GridFS)

```bash
cd backend
npm install
npm start
```

O backend vai rodar em `http://localhost:5000` e servir os arquivos em:
- `GET /api/files/:fileId` - Download de arquivo

### 3. Testar Upload

1. Abrir chat com um profissional
2. Clicar no ícone de imagem 📷
3. Selecionar uma imagem
4. Aguardar upload
5. Imagem aparece no chat

---

## 📊 VANTAGENS DO GRIDFS

### ✅ Vantagens
- Sem problemas de CORS
- Funciona imediatamente
- Sem limite de tamanho
- Incluído no MongoDB (sem custo extra)
- Bom para arquivos grandes

### ⚠️ Desvantagens
- Mais lento que Firebase Storage
- Sem CDN global
- Precisa de backend rodando
- Não otimizado para imagens

---

## 🔄 MIGRAR PARA FIREBASE STORAGE (FUTURO)

Quando o Firebase Storage estiver configurado:

### 1. Configurar CORS
Seguir guia em `FIREBASE_STORAGE_CORS_FIX.md`

### 2. Atualizar storageService.ts

```typescript
// Forçar uso do Firebase
const FILE_SIZE_THRESHOLD = 100 * 1024 * 1024; // 100MB
```

### 3. Testar
```bash
# Limpar cache
Ctrl + Shift + R

# Testar upload
```

---

## 🧪 TESTES

### Testar Upload de Imagem
1. Abrir chat
2. Enviar imagem PNG/JPG
3. Verificar se aparece no chat
4. Clicar para abrir em nova aba

### Testar Upload de Arquivo
1. Abrir chat
2. Enviar PDF/DOC
3. Verificar se aparece com ícone 📎
4. Clicar para baixar

### Verificar no MongoDB
```javascript
// No MongoDB Compass ou Shell
use serviflex

// Ver arquivos
db.uploads.files.find()

// Ver chunks
db.uploads.chunks.find()
```

---

## 📁 ESTRUTURA NO MONGODB

### Coleção: uploads.files
```javascript
{
  _id: ObjectId("507f..."),
  filename: "1763051748777_dlacvm.pdf",
  length: 1024,
  chunkSize: 261120,
  uploadDate: ISODate("2025-01-13T..."),
  metadata: {
    contentType: "application/pdf",
    size: 1024,
    uploadDate: ISODate("2025-01-13T..."),
    userId: "Cm4ETyhPsVQsyzL9HeAzgXEqZGm2",
    category: "document"
  }
}
```

### Coleção: uploads.chunks
```javascript
{
  _id: ObjectId("507f..."),
  files_id: ObjectId("507f..."),
  n: 0,
  data: BinData(0, "...")
}
```

---

## 🔧 TROUBLESHOOTING

### Erro: "GridFS não inicializado"
```bash
# Verificar se MONGODB_URI está no .env
echo $VITE_MONGODB_URI

# Verificar conexão
node -e "const { MongoClient } = require('mongodb'); const client = new MongoClient('sua-uri'); client.connect().then(() => console.log('✅ Conectado')).catch(console.error);"
```

### Erro: "Cannot GET /api/files/..."
```bash
# Verificar se backend está rodando
curl http://localhost:5000/api/health

# Iniciar backend
cd backend
npm start
```

### Arquivo não aparece no chat
1. Verificar console do navegador
2. Verificar se upload foi concluído
3. Verificar se URL está correta
4. Verificar se backend está rodando

---

## 📈 MONITORAMENTO

### Ver Uso do GridFS
```javascript
// MongoDB Shell
use serviflex

// Total de arquivos
db.uploads.files.count()

// Tamanho total
db.uploads.files.aggregate([
  { $group: { _id: null, total: { $sum: "$length" } } }
])

// Arquivos por usuário
db.uploads.files.aggregate([
  { $group: { _id: "$metadata.userId", count: { $sum: 1 } } }
])
```

### Limpar Arquivos Antigos
```javascript
// Deletar arquivos com mais de 30 dias
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

db.uploads.files.deleteMany({
  uploadDate: { $lt: thirtyDaysAgo }
})
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Sistema funcionando com GridFS
2. ⏳ Configurar Firebase Storage CORS
3. ⏳ Migrar para Firebase Storage
4. ⏳ Implementar CDN
5. ⏳ Otimizar imagens

---

**Status:** 🟢 Sistema funcionando perfeitamente com GridFS
**Performance:** ⚡ Boa para desenvolvimento
**Produção:** ⚠️ Recomendado migrar para Firebase Storage

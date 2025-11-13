# 📦 Guia de Armazenamento - ServiFlex

## 🎯 Estratégia de Armazenamento

### ✅ Firebase Storage (Recomendado - JÁ IMPLEMENTADO)

**Usado para:**
- ✅ Fotos de perfil
- ✅ Imagens de portfólio
- ✅ Certificados (PDF/Imagens)
- ✅ Documentos de verificação

**Vantagens:**
- CDN global (rápido em qualquer lugar do mundo)
- Otimização automática de imagens
- Integração nativa com Firebase Auth
- Fácil de usar
- Segurança integrada

**Implementação:**
```typescript
import { uploadService } from './services/uploadService';

// Upload de foto de perfil
const url = await uploadService.uploadProfilePhoto(userId, file);

// Upload de portfólio
const url = await uploadService.uploadPortfolioImage(professionalId, file);

// Upload de certificado
const url = await uploadService.uploadCertificate(professionalId, file, 'pdf');
```

**No MongoDB você salva apenas a URL:**
```javascript
{
  userId: "abc123",
  profileImage: "https://firebasestorage.googleapis.com/...",
  portfolio: [
    "https://firebasestorage.googleapis.com/image1.jpg",
    "https://firebasestorage.googleapis.com/image2.jpg"
  ]
}
```

---

### ⚠️ MongoDB GridFS (Apenas para casos específicos)

**Use APENAS quando:**
- Arquivos > 16MB (vídeos longos, arquivos grandes)
- Precisa de transações ACID com os arquivos
- Não pode usar serviços externos

**NÃO use para:**
- ❌ Imagens de perfil
- ❌ Fotos de portfólio
- ❌ Certificados pequenos
- ❌ PDFs normais

**Implementação GridFS (se necessário):**

```javascript
const { MongoClient, GridFSBucket } = require('mongodb');

const client = new MongoClient(uri);
await client.connect();

const db = client.db('serviflex');
const bucket = new GridFSBucket(db, {
  bucketName: 'videos' // Nome da coleção
});

// Upload
const uploadStream = bucket.openUploadStream('video.mp4', {
  metadata: {
    userId: 'abc123',
    type: 'portfolio-video'
  }
});

fs.createReadStream('./video.mp4').pipe(uploadStream);

uploadStream.on('finish', (file) => {
  console.log('Arquivo salvo:', file._id);
  
  // Salvar referência no documento do usuário
  db.collection('users').updateOne(
    { _id: 'abc123' },
    { $push: { videos: file._id } }
  );
});

// Download
const downloadStream = bucket.openDownloadStream(fileId);
downloadStream.pipe(fs.createWriteStream('./downloaded.mp4'));
```

---

## 📊 Comparação

| Recurso | Firebase Storage | MongoDB GridFS |
|---------|-----------------|----------------|
| **Velocidade** | ⚡ Muito rápido (CDN) | 🐌 Lento |
| **Custo** | 💰 $0.026/GB | 💰💰 Mais caro |
| **Limite** | 5TB por arquivo | 16MB por chunk |
| **Otimização** | ✅ Automática | ❌ Manual |
| **CDN** | ✅ Global | ❌ Não |
| **Backup** | ✅ Automático | ⚠️ Manual |
| **Complexidade** | 😊 Simples | 😰 Complexo |

---

## 🚀 Recomendação Final

**Para o ServiFlex:**

1. **Use Firebase Storage** para 99% dos casos:
   - Fotos de perfil ✅
   - Portfólio ✅
   - Certificados ✅
   - Documentos ✅

2. **Use MongoDB GridFS** apenas se:
   - Precisar armazenar vídeos > 16MB
   - Tiver requisitos específicos de transação

3. **No MongoDB salve apenas:**
   - URLs dos arquivos
   - Metadados (nome, tipo, tamanho)
   - Referências

---

## 🔧 Configuração Atual

Seu projeto **JÁ ESTÁ CONFIGURADO** com Firebase Storage:

```typescript
// src/firebase.ts
export const storage = getStorage(app);

// src/services/uploadService.ts
export const uploadService = new UploadService();
```

**Pronto para usar!** 🎉

---

## 📝 Exemplo Completo

```typescript
// 1. Upload da imagem
const handleUpload = async (file: File) => {
  try {
    // Upload para Firebase Storage
    const url = await uploadService.uploadProfilePhoto(
      user.uid,
      file,
      (progress) => {
        console.log(`${progress.progress}%`);
      }
    );
    
    // 2. Salvar URL no MongoDB
    await fetch('/api/users/update-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        photoUrl: url
      })
    });
    
    console.log('✅ Foto atualizada!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};
```

---

## 🔒 Segurança

**Firebase Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Apenas usuários autenticados podem fazer upload
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /portfolio/{professionalId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == professionalId;
    }
  }
}
```

---

## 💡 Dicas

1. **Comprima imagens antes do upload:**
   ```typescript
   const compressed = await uploadService.compressImage(file);
   const url = await uploadService.uploadProfilePhoto(userId, compressed);
   ```

2. **Valide o tipo de arquivo:**
   ```typescript
   const validation = uploadService.validateFile(file, 'image');
   if (!validation.valid) {
     alert(validation.error);
     return;
   }
   ```

3. **Mostre progresso ao usuário:**
   ```typescript
   await uploadService.uploadFile(file, path, 'image', (progress) => {
     setUploadProgress(progress.progress);
   });
   ```

---

## 📚 Recursos

- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
- [MongoDB GridFS Docs](https://www.mongodb.com/docs/manual/core/gridfs/)
- [Código do uploadService.ts](./src/services/uploadService.ts)

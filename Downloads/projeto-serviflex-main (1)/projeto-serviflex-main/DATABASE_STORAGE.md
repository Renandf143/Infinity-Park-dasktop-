# 📦 Sistema de Armazenamento de Arquivos - MongoDB GridFS

## 📋 Visão Geral

Este sistema utiliza **MongoDB GridFS** para armazenar imagens, PDFs e outros arquivos do ServiFlex. GridFS é ideal para arquivos grandes (>16MB) e oferece melhor performance que armazenamento em base64.

## 🗂️ Estrutura do Banco de Dados

### Database: `serviflex_storage`
- **Collection**: `files.files` (metadados dos arquivos)
- **Collection**: `files.chunks` (chunks dos arquivos)

### Categorias de Arquivos

- **profile**: Fotos de perfil dos usuários
- **portfolio**: Imagens do portfólio de profissionais
- **certificate**: Certificados e documentos de qualificação
- **document**: Documentos gerais (contratos, propostas, etc.)
- **other**: Outros tipos de arquivos

## 🚀 Configuração

### 1. Instalar MongoDB

```bash
# Windows (com Chocolatey)
choco install mongodb

# Ou baixe em: https://www.mongodb.com/try/download/community
```

### 2. Iniciar MongoDB

```bash
# Iniciar serviço
mongod --dbpath C:\data\db

# Ou como serviço do Windows
net start MongoDB
```

### 3. Configurar Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
# MongoDB Storage
VITE_MONGODB_STORAGE_URI=mongodb://localhost:27017
```

### 4. Instalar Dependências

```bash
npm install mongodb
```

## 💻 Como Usar

### Upload de Arquivo

```typescript
import { FileUploadManager } from './components/FileUploadManager';

function MyComponent() {
  return (
    <FileUploadManager
      category="portfolio"
      relatedTo={userId}
      onUploadComplete={(fileId) => {
        console.log('Arquivo enviado:', fileId);
      }}
      acceptedTypes="image/*,application/pdf"
      maxSizeMB={5}
      multiple={true}
    />
  );
}
```

### Galeria de Arquivos

```typescript
import { FileGallery } from './components/FileGallery';

function MyGallery() {
  return (
    <FileGallery
      userId={currentUserId}
      category="portfolio"
      onFileDelete={(fileId) => {
        console.log('Arquivo deletado:', fileId);
      }}
    />
  );
}
```

### Uso Direto do Hook

```typescript
import { useFileStorage } from './hooks/useFileStorage';

function MyComponent() {
  const { upload, download, getPreviewURL, remove } = useFileStorage();

  const handleUpload = async (file: File) => {
    const fileId = await upload(file, {
      uploadedBy: userId,
      category: 'profile',
      relatedTo: userId
    });
    
    if (fileId) {
      console.log('Upload concluído:', fileId);
    }
  };

  const handleDownload = async (fileId: string) => {
    const buffer = await download(fileId);
    // Processar buffer...
  };

  const handlePreview = async (fileId: string) => {
    const url = await getPreviewURL(fileId);
    // Usar URL para exibir imagem
  };

  return (
    // Seu componente...
  );
}
```

## 📊 Estrutura de Metadados

Cada arquivo armazenado contém os seguintes metadados:

```typescript
{
  filename: string;           // Nome do arquivo
  contentType: string;        // MIME type (image/jpeg, application/pdf, etc.)
  size: number;              // Tamanho em bytes
  uploadedBy: string;        // ID do usuário que fez upload
  category: string;          // Categoria do arquivo
  relatedTo?: string;        // ID da entidade relacionada
  uploadedAt: Date;          // Data do upload
}
```

## 🔒 Validações

### Tipos de Arquivo Permitidos

**Imagens:**
- image/jpeg
- image/jpg
- image/png
- image/gif
- image/webp

**Documentos:**
- application/pdf
- application/msword
- application/vnd.openxmlformats-officedocument.wordprocessingml.document

### Tamanhos Máximos

- **Imagens**: 5 MB
- **Documentos**: 10 MB

## 🛠️ API de Serviços

### fileStorageService.ts

```typescript
// Upload
uploadFile(buffer: Buffer, metadata: FileMetadata): Promise<string>

// Download
downloadFile(fileId: string): Promise<Buffer>

// Informações
getFileInfo(fileId: string): Promise<StoredFile | null>

// Listar
listUserFiles(userId: string): Promise<StoredFile[]>
listFilesByCategory(category: string, relatedTo?: string): Promise<StoredFile[]>

// Deletar
deleteFile(fileId: string): Promise<boolean>
deleteMultipleFiles(fileIds: string[]): Promise<number>

// Preview
getFileDataURL(fileId: string): Promise<string>

// Validações
validateFileType(contentType: string, allowedTypes: string[]): boolean
validateFileSize(size: number, maxSizeMB: number): boolean
```

## 🔧 Manutenção

### Limpar Arquivos Órfãos

```javascript
// Script para limpar arquivos sem referência
const { MongoClient } = require('mongodb');

async function cleanOrphanFiles() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  
  const db = client.db('serviflex_storage');
  const bucket = new GridFSBucket(db);
  
  // Implementar lógica de limpeza...
  
  await client.close();
}
```

### Backup

```bash
# Backup do banco de dados
mongodump --db serviflex_storage --out ./backup

# Restaurar backup
mongorestore --db serviflex_storage ./backup/serviflex_storage
```

## 📈 Performance

### Índices Recomendados

```javascript
// Criar índices para melhor performance
db.files.files.createIndex({ "metadata.uploadedBy": 1 });
db.files.files.createIndex({ "metadata.category": 1 });
db.files.files.createIndex({ "metadata.relatedTo": 1 });
db.files.files.createIndex({ "uploadDate": -1 });
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"

1. Verifique se o MongoDB está rodando
2. Confirme a URI de conexão no `.env`
3. Verifique firewall e permissões

### Erro: "File too large"

1. Verifique os limites de tamanho configurados
2. Aumente o limite se necessário
3. Considere compressão de imagens

### Erro: "Invalid file type"

1. Verifique os tipos permitidos
2. Adicione novos tipos se necessário em `ALLOWED_*_TYPES`

## 📝 Exemplos de Uso

### Upload de Foto de Perfil

```typescript
const handleProfilePictureUpload = async (file: File) => {
  const fileId = await upload(file, {
    uploadedBy: user.uid,
    category: 'profile',
    relatedTo: user.uid
  });
  
  // Atualizar perfil do usuário com fileId
  await updateUserProfile({ profilePictureId: fileId });
};
```

### Upload de Certificado

```typescript
const handleCertificateUpload = async (file: File) => {
  const fileId = await upload(file, {
    uploadedBy: professionalId,
    category: 'certificate',
    relatedTo: professionalId
  });
  
  // Adicionar certificado ao perfil
  await addCertificate({ fileId, name: file.name });
};
```

### Galeria de Portfólio

```typescript
function PortfolioGallery({ professionalId }: { professionalId: string }) {
  return (
    <FileGallery
      userId={professionalId}
      category="portfolio"
      onFileDelete={async (fileId) => {
        // Remover referência do portfólio
        await removeFromPortfolio(fileId);
      }}
    />
  );
}
```

## 🔐 Segurança

- ✅ Validação de tipos de arquivo
- ✅ Validação de tamanho
- ✅ Metadados de propriedade (uploadedBy)
- ✅ Controle de acesso por categoria
- ⚠️ Implementar autenticação nas rotas de API
- ⚠️ Implementar rate limiting
- ⚠️ Scan de vírus para arquivos enviados

## 📚 Recursos Adicionais

- [MongoDB GridFS Documentation](https://docs.mongodb.com/manual/core/gridfs/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)

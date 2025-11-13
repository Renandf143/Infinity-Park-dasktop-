# 🚀 Instalação Rápida - Sistema de Storage

## Passo 1: Instalar MongoDB

### Windows

**Opção 1: Instalador Oficial**
1. Baixe em: https://www.mongodb.com/try/download/community
2. Execute o instalador
3. Escolha "Complete" installation
4. Marque "Install MongoDB as a Service"

**Opção 2: Chocolatey**
```bash
choco install mongodb
```

### Verificar Instalação
```bash
mongod --version
```

## Passo 2: Iniciar MongoDB

### Como Serviço (Recomendado)
```bash
# Iniciar
net start MongoDB

# Parar
net stop MongoDB
```

### Manualmente
```bash
# Criar pasta de dados
mkdir C:\data\db

# Iniciar MongoDB
mongod --dbpath C:\data\db
```

## Passo 3: Instalar Dependências do Projeto

```bash
npm install mongodb
```

## Passo 4: Configurar Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
VITE_MONGODB_STORAGE_URI=mongodb://localhost:27017
```

## Passo 5: Inicializar Banco de Dados

```bash
npm run init-storage
```

Este comando irá:
- ✅ Criar o banco `serviflex_storage`
- ✅ Criar as coleções necessárias
- ✅ Criar índices para performance
- ✅ Configurar o GridFS

## Passo 6: Testar o Sistema

### Opção 1: Usar a Página de Exemplo

Adicione a rota no seu `AppRouter.tsx`:

```typescript
import { FileStorageExample } from './pages/FileStorageExample';

// Adicione na lista de rotas:
<Route path="/storage-example" element={<FileStorageExample />} />
```

Acesse: `http://localhost:5173/storage-example`

### Opção 2: Usar nos Seus Componentes

```typescript
import { FileUploadManager } from './components/FileUploadManager';
import { FileGallery } from './components/FileGallery';

function MeuComponente() {
  return (
    <div>
      <FileUploadManager
        category="portfolio"
        relatedTo={userId}
        onUploadComplete={(fileId) => console.log('Upload:', fileId)}
      />
      
      <FileGallery
        userId={userId}
        category="portfolio"
      />
    </div>
  );
}
```

## 🎯 Pronto!

Agora você pode:
- ✅ Fazer upload de imagens
- ✅ Fazer upload de PDFs
- ✅ Visualizar arquivos em galeria
- ✅ Baixar arquivos
- ✅ Deletar arquivos

## 🔧 Comandos Úteis

### Verificar Status do MongoDB
```bash
# Windows
sc query MongoDB

# Ou
net start | findstr MongoDB
```

### Acessar MongoDB Shell
```bash
mongosh
```

### Ver Bancos de Dados
```javascript
show dbs
```

### Ver Coleções
```javascript
use serviflex_storage
show collections
```

### Ver Arquivos Armazenados
```javascript
db.files.files.find().pretty()
```

### Limpar Todos os Arquivos (CUIDADO!)
```javascript
db.files.files.deleteMany({})
db.files.chunks.deleteMany({})
```

## 🐛 Problemas Comuns

### "Cannot connect to MongoDB"

**Solução:**
1. Verifique se o MongoDB está rodando: `net start MongoDB`
2. Verifique a porta: MongoDB usa porta 27017 por padrão
3. Verifique firewall

### "Access denied"

**Solução:**
1. Execute o terminal como Administrador
2. Verifique permissões da pasta `C:\data\db`

### "Port already in use"

**Solução:**
1. Outro processo está usando a porta 27017
2. Pare o processo ou use outra porta:
   ```bash
   mongod --port 27018
   ```
3. Atualize o `.env`:
   ```env
   VITE_MONGODB_STORAGE_URI=mongodb://localhost:27018
   ```

## 📊 Monitoramento

### Ver Tamanho do Banco
```javascript
use serviflex_storage
db.stats()
```

### Ver Arquivos por Categoria
```javascript
db.files.files.aggregate([
  { $group: { _id: "$metadata.category", count: { $sum: 1 } } }
])
```

### Ver Espaço Usado
```javascript
db.files.files.aggregate([
  { $group: { _id: null, totalSize: { $sum: "$length" } } }
])
```

## 🔐 Segurança (Produção)

Para produção, configure autenticação:

```bash
# Criar usuário admin
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "senha_segura",
  roles: ["root"]
})
```

Atualize o `.env`:
```env
VITE_MONGODB_STORAGE_URI=mongodb://admin:senha_segura@localhost:27017
```

## 📚 Próximos Passos

1. ✅ Integre o upload de fotos de perfil
2. ✅ Adicione galeria de portfólio
3. ✅ Implemente upload de certificados
4. ✅ Configure backup automático
5. ✅ Adicione compressão de imagens
6. ✅ Implemente CDN para produção

## 💡 Dicas

- Use categorias para organizar arquivos
- Implemente validação de tipos no backend
- Configure limites de tamanho apropriados
- Faça backup regular do banco
- Monitore o espaço em disco
- Use índices para queries rápidas

## 🆘 Suporte

Documentação completa: `DATABASE_STORAGE.md`

Problemas? Verifique:
1. MongoDB está rodando?
2. Variáveis de ambiente configuradas?
3. Dependências instaladas?
4. Banco inicializado?

# 🚀 Serviflix - Plataforma de Serviços Autônomos

**Serviflix** é uma plataforma inovadora desenvolvida em **NuxtJS 3** que conecta profissionais autônomos a clientes, facilitando a contratação de serviços de reparos, limpeza, tecnologia, beleza e muito mais.

---

## 📖 Documentação

Para mais informações sobre o framework utilizado, consulte a **[documentação oficial do Nuxt 3](https://nuxt.com/docs/getting-started/introduction)**.

---

## ⚡ Setup Rápido

Antes de começar, certifique-se de instalar as dependências do projeto com:

```sh
pnpm install
```

---

## 🛠️ Desenvolvimento

Para iniciar o servidor localmente em **http://localhost:3000**, utilize:

```sh
pnpm run dev
```

---

## 🚀 Produção

### 📦 Criando o Build

Para gerar os arquivos otimizados para produção:

```sh
pnpm run generate
```

Os arquivos serão gerados na pasta **/dist**.

### 🔍 Visualizando o Build Localmente

Se quiser testar o build de produção antes de fazer o deploy:

```sh
pnpm run preview
```

---

## 🌍 Deploy

Para publicar seu projeto, confira a **[documentação de deployment do Nuxt 3](https://nuxt.com/docs/getting-started/deployment)**.

---

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação Completo
- **Login/Cadastro** com email e senha
- **Autenticação Google** integrada
- **Recuperação de senha** via email
- **Verificação de email** obrigatória
- **Middlewares de segurança** para proteção de rotas

### 👥 Tipos de Usuário
- **👤 Cliente**: Para quem quer contratar serviços
- **🧑‍🔧 Profissional**: Para quem quer oferecer serviços
- **🏢 Empresa**: Para empresas que querem divulgar serviços

### 🛡️ Segurança
- **Firebase Authentication** integrado
- **Validação de senhas fortes** (8+ caracteres, maiúscula, minúscula, número)
- **Proteção de rotas** com middlewares
- **Verificação de email** obrigatória
- **Tratamento de erros** em português

### 🎨 Interface
- **Design responsivo** para todos os dispositivos
- **Componentes reutilizáveis** e organizados
- **Feedback visual** claro para o usuário
- **Loading states** em todas as ações

## 📂 Estrutura do Projeto

- 📁 **`assets/`** → Imagens, fontes e estilos CSS globais
- 📁 **`components/`** → Componentes Vue reutilizáveis (Nav, Footer, etc.)
- 📁 **`composables/`** → Lógica de autenticação Firebase e serviços
- 📁 **`middleware/`** → Proteção de rotas (auth, email-verified)
- 📁 **`pages/`** → Páginas da aplicação (login, cadastro, dashboards)
- 📁 **`plugins/`** → Configuração do Firebase
- 📁 **`server/api/`** → APIs do backend (sincronização de usuários)
- 📁 **`stores/`** → Gerenciamento de estado com Pinia
- 📝 **`nuxt.config.ts`** → Configurações do Nuxt e Firebase

---

## ⚙️ Scripts Disponíveis

Comandos úteis para desenvolvimento e produção:

- `pnpm run dev` → Inicia o servidor de desenvolvimento
- `pnpm run build` → Gera o build para produção
- `pnpm run generate` → Gera versão estática
- `pnpm run preview` → Visualiza o build localmente
- `pnpm run db:migrate` → Executa migrações do banco
- `pnpm run db:seed` → Popula o banco com dados iniciais
- `pnpm run db:studio` → Abre o Prisma Studio

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/serviflix"

# Firebase Configuration
FIREBASE_API_KEY="sua-api-key"
FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
FIREBASE_PROJECT_ID="seu-projeto-id"
# ... outras configurações do Firebase

# JWT Secret
JWT_SECRET="sua-chave-secreta-jwt"

# Ambiente
NODE_ENV="development"
NUXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Authentication** com Email/Senha e Google
3. Configure o **Firestore Database**
4. Adicione as credenciais no arquivo `.env`

## 🚀 Deploy

O projeto está configurado para deploy em:
- **Vercel** (recomendado para Nuxt)
- **Netlify**
- **Firebase Hosting**

Para mais informações, consulte a [documentação de deployment do Nuxt 3](https://nuxt.com/docs/getting-started/deployment).

---

## 📱 Tecnologias Utilizadas

- **⚡ Nuxt 3** - Framework Vue.js full-stack
- **🔥 Firebase** - Autenticação e banco de dados
- **🗃️ Prisma** - ORM para banco de dados
- **🎨 CSS Custom Properties** - Estilização personalizada
- **📱 Design Responsivo** - Mobile-first approach
- **🛡️ TypeScript** - Tipagem estática

---

🔥 **Serviflix - Conectando talentos a oportunidades reais!** 🚀

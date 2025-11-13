# 🚀 ServiFlex

Plataforma moderna de contratação e prestação de serviços profissionais.

## 📋 Sobre o Projeto

ServiFlex é uma plataforma que conecta clientes a profissionais qualificados de diversas áreas. Com sistema de avaliações, gamificação e chat em tempo real.

## ✨ Funcionalidades

- 🔐 Autenticação segura (Email/Senha e Google)
- 👥 Perfis de Cliente e Profissional
- ⭐ Sistema de avaliações e reviews
- 💬 Chat em tempo real
- 🏆 Sistema de gamificação com níveis
- 📊 Dashboard completo
- 🔍 Busca e filtros avançados
- 📱 Design responsivo

## 🛠️ Tecnologias

- **Frontend:** React + TypeScript + Vite
- **Styling:** TailwindCSS
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Icons:** Lucide React
- **Routing:** React Router v6

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Firebase

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/serviflex.git
cd serviflex
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais do Firebase

5. Execute o projeto:
```bash
npm run dev
```

6. Acesse: http://localhost:5173

## 🔧 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication (Email/Password e Google)
3. Crie um banco Firestore
4. Crie um Storage
5. Copie as credenciais para o arquivo `.env`
6. Aplique as regras de segurança (veja `docs/FIREBASE_SETUP.md`)

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`

## 🔒 Segurança

- ✅ Variáveis de ambiente protegidas
- ✅ Firestore Security Rules implementadas
- ✅ Storage Security Rules implementadas
- ✅ Validação de entrada de dados
- ✅ Sanitização contra XSS
- ✅ Content Security Policy (CSP)
- ✅ Rate limiting

Veja mais em: `docs/SEGURANCA.md`

## 📚 Documentação

- [Configuração do Firebase](docs/FIREBASE_SETUP.md)
- [Guia de Segurança](docs/SEGURANCA.md)
- [Estrutura do Projeto](docs/ESTRUTURA.md)
- [Deploy](docs/DEPLOY.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para conectar profissionais e clientes.

## 📞 Suporte

Para dúvidas ou suporte, abra uma [issue](https://github.com/seu-usuario/serviflex/issues).

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

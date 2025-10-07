# Serviflix-Web

Uma plataforma web para conectar prestadores de serviços com clientes, oferecendo uma experiência completa de agendamento e avaliação de serviços.

## 🚀 Tecnologias

### Frontend
- **Nuxt.js 3** - Framework Vue.js para aplicações web
- **Tailwind CSS** - Framework CSS utilitário
- **Supabase** - Backend-as-a-Service para autenticação e banco de dados

### Backend
- **Django** - Framework web Python
- **SQLite** - Banco de dados para desenvolvimento
- **Django REST Framework** - API REST

## 📁 Estrutura do Projeto

```
serviflix-web/
├── frontend/           # Aplicação Nuxt.js
│   ├── components/     # Componentes Vue
│   ├── pages/         # Páginas da aplicação
│   ├── composables/   # Composables Vue
│   ├── layouts/       # Layouts da aplicação
│   └── ...
├── backend/           # API Django
│   ├── accounts/      # Sistema de usuários
│   ├── bookings/      # Sistema de agendamentos
│   ├── services/      # Gerenciamento de serviços
│   ├── reviews/       # Sistema de avaliações
│   └── ...
└── assets/           # Recursos estáticos
    ├── imagem/       # Imagens
    └── videos/       # Vídeos
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Node.js 18+ 
- Python 3.8+
- Git

### Frontend (Nuxt.js)

1. Navegue até a pasta frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

### Backend (Django)

1. Navegue até a pasta backend:
```bash
cd backend
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

5. Execute as migrações:
```bash
python manage.py migrate
```

6. Inicie o servidor:
```bash
python manage.py runserver
```

A API estará disponível em `http://localhost:8000`

## 🔧 Configuração do Supabase

O projeto utiliza Supabase para autenticação e banco de dados. Consulte os arquivos de configuração:

- `frontend/SUPABASE_SETUP.md` - Guia de configuração
- `supabase_tables.sql` - Estrutura das tabelas
- `supabase_security_policies.sql` - Políticas de segurança
- `supabase_initial_data.sql` - Dados iniciais

## 📚 Documentação Adicional

- `CONFIGURACAO_GOOGLE_OAUTH.md` - Configuração do OAuth Google
- `frontend/README-EMAIL-SYSTEM.md` - Sistema de emails
- `NOVA_PAGINA_INICIAL.md` - Especificações da página inicial
- `RESPONSIVIDADE_CORRIGIDA.md` - Correções de responsividade

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através do GitHub.
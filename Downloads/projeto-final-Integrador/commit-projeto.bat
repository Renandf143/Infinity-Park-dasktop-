@echo off
echo ========================================
echo    SERVIFLIX - Commit do Projeto
echo ========================================
echo.

echo Adicionando todos os arquivos...
git add .

echo.
echo Fazendo commit...
git commit -m "feat: sistema completo de autenticacao implementado

✨ Funcionalidades implementadas:
- Sistema de login/cadastro com email e senha
- Autenticacao Google OAuth integrada
- Recuperacao de senha via email automatico
- Verificacao de email obrigatoria
- Tres tipos de usuario: Cliente, Profissional, Empresa
- Middlewares de seguranca (auth, email-verified)
- Interface responsiva e moderna
- Componentes reutilizaveis organizados

🛡️ Seguranca:
- Firebase Authentication configurado
- Validacao de senhas fortes
- Protecao de rotas sensíveis
- Tratamento de erros em portugues

🎨 Interface:
- Design responsivo mobile-first
- Feedback visual claro
- Loading states em todas as acoes
- Mensagens de erro/sucesso

🔧 Tecnologias:
- Nuxt 3 + TypeScript
- Firebase Auth + Firestore
- Prisma ORM
- CSS Custom Properties
- Pinia para estado global"

echo.
echo Enviando para o GitHub...
git push origin main

echo.
echo ========================================
echo    SUCESSO! Projeto atualizado no GitHub
echo ========================================
echo.
echo Repositorio: https://github.com/Renandf143/Serviflix
echo.
pause

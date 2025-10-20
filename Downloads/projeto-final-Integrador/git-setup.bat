@echo off
echo ========================================
echo    SERVIFLIX - Setup do Repositorio Git
echo ========================================
echo.

echo Verificando se o Git esta instalado...
git --version
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Git nao encontrado!
    echo Por favor, instale o Git em: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo.
echo Configurando repositorio...

echo Adicionando todos os arquivos...
git add .

echo.
echo Fazendo commit inicial...
git commit -m "feat: implementacao completa do sistema de autenticacao

- Sistema de login/cadastro com email e senha
- Autenticacao Google integrada
- Recuperacao de senha via email
- Verificacao de email obrigatoria
- Middlewares de seguranca
- Tres tipos de usuario: Cliente, Profissional, Empresa
- Interface responsiva e moderna
- Firebase Authentication configurado
- Prisma ORM para banco de dados
- Componentes reutilizaveis organizados"

echo.
echo Configurando branch principal...
git branch -M main

echo.
echo Verificando repositorio remoto...
git remote -v
if %errorlevel% neq 0 (
    echo Adicionando repositorio remoto...
    git remote add origin https://github.com/Renandf143/Serviflix.git
) else (
    echo Repositorio remoto ja configurado.
)

echo.
echo Enviando para o GitHub...
git push -u origin main

echo.
echo ========================================
echo    SUCESSO! Projeto enviado para GitHub
echo ========================================
echo.
echo Repositorio: https://github.com/Renandf143/Serviflix
echo.
pause

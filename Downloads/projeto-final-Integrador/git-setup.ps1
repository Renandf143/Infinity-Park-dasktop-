Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SERVIFLIX - Setup do Repositorio Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Verificando se o Git esta instalado..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: Git nao encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git em: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Configurando repositorio..." -ForegroundColor Yellow

Write-Host "Adicionando todos os arquivos..." -ForegroundColor Blue
git add .

Write-Host ""
Write-Host "Fazendo commit inicial..." -ForegroundColor Blue
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

Write-Host ""
Write-Host "Configurando branch principal..." -ForegroundColor Blue
git branch -M main

Write-Host ""
Write-Host "Verificando repositorio remoto..." -ForegroundColor Blue
$remotes = git remote -v
if ($remotes) {
    Write-Host "✓ Repositorio remoto ja configurado:" -ForegroundColor Green
    Write-Host $remotes -ForegroundColor Gray
} else {
    Write-Host "Adicionando repositorio remoto..." -ForegroundColor Blue
    git remote add origin https://github.com/Renandf143/Serviflix.git
}

Write-Host ""
Write-Host "Enviando para o GitHub..." -ForegroundColor Blue
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   SUCESSO! Projeto enviado para GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repositorio: https://github.com/Renandf143/Serviflix" -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione Enter para sair"

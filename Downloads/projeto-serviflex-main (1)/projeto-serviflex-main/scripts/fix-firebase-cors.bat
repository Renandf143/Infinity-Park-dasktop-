@echo off
echo ========================================
echo CORRIGIR CORS DO FIREBASE STORAGE
echo ========================================
echo.

echo [1/3] Verificando Google Cloud SDK...
where gcloud >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Google Cloud SDK nao encontrado!
    echo.
    echo Por favor, instale o Google Cloud SDK:
    echo https://cloud.google.com/sdk/docs/install
    echo.
    echo Ou configure manualmente via Firebase Console:
    echo https://console.firebase.google.com/project/serviflex-f5ba3/storage/rules
    echo.
    pause
    exit /b 1
)

echo [OK] Google Cloud SDK encontrado
echo.

echo [2/3] Fazendo login no Google Cloud...
gcloud auth login
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha no login
    pause
    exit /b 1
)

echo [OK] Login realizado
echo.

echo [3/3] Aplicando configuracao CORS...
gcloud config set project serviflex-f5ba3
gsutil cors set cors.json gs://serviflex-f5ba3.appspot.com

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [SUCESSO] CORS configurado!
    echo ========================================
    echo.
    echo Agora:
    echo 1. Recarregue a pagina (Ctrl + Shift + R)
    echo 2. Tente enviar uma imagem no chat
    echo.
) else (
    echo.
    echo ========================================
    echo [ERRO] Falha ao configurar CORS
    echo ========================================
    echo.
    echo Tente configurar manualmente:
    echo 1. Acesse: https://console.firebase.google.com/project/serviflex-f5ba3/storage/rules
    echo 2. Cole as regras do arquivo FIREBASE_STORAGE_CORS_FIX.md
    echo 3. Clique em "Publicar"
    echo.
)

pause

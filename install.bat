@echo off
echo ========================================
echo  Instalacao do AppRHPonto
echo ========================================
echo.

echo [1/4] Verificando npm...
call npm --version
if errorlevel 1 (
    echo ERRO: npm nao encontrado!
    echo Instale o Node.js primeiro: https://nodejs.org/
    pause
    exit /b 1
)
echo OK!
echo.

echo [2/4] Instalando pnpm globalmente...
call npm install -g pnpm
if errorlevel 1 (
    echo ERRO ao instalar pnpm!
    pause
    exit /b 1
)
echo OK!
echo.

echo [3/4] Verificando pnpm...
call pnpm --version
if errorlevel 1 (
    echo ERRO: pnpm nao foi instalado corretamente!
    pause
    exit /b 1
)
echo OK!
echo.

echo [4/4] Instalando dependencias do projeto...
echo (Isso pode levar alguns minutos...)
call pnpm install
if errorlevel 1 (
    echo ERRO ao instalar dependencias!
    pause
    exit /b 1
)
echo OK!
echo.

echo ========================================
echo  INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Proximos passos:
echo 1. Recarregue o VS Code (Ctrl+Shift+P ^> Reload Window)
echo 2. Verifique se os erros desapareceram
echo 3. Rode o projeto: pnpm --filter admin-web dev
echo.
pause
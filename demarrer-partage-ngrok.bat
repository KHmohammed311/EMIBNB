@echo off
echo ===============================================
echo   AirBnB Clone Maroc - Partage via ngrok
echo   Tes potes accedent depuis n'importe ou !
echo ===============================================
echo.

REM Vérifie si ngrok est installé
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ngrok n'est pas installe.
    echo     1. Va sur https://ngrok.com/download
    echo     2. Cree un compte gratuit
    echo     3. Telecharge ngrok.exe et mets-le dans ce dossier
    echo     4. Lance: ngrok config add-authtoken TON_TOKEN
    echo     5. Relance ce script
    pause
    exit /b 1
)

echo [1/3] Démarrage du tunnel ngrok pour le backend (port 8080)...
echo     Une fenetre ngrok va s'ouvrir.
echo     Copie l'URL https://xxx.ngrok-free.app et note-la.
echo.
start "ngrok-backend" cmd /k "ngrok http 8080"

echo.
echo Attends 3 secondes que ngrok demarre...
timeout /t 3 /nobreak >nul

echo.
echo [2/3] Quelle est l'URL ngrok de ton backend ?
echo     (ex: https://abc123.ngrok-free.app)
echo.
set /p NGROK_URL="Colle l'URL ici : "

echo.
echo [3/3] Mise a jour d'Angular avec l'URL ngrok...
echo export const environment = { > "frontend\src\environments\environment.ts"
echo   production: false, >> "frontend\src\environments\environment.ts"
echo   apiUrl: '%NGROK_URL%' >> "frontend\src\environments\environment.ts"
echo }; >> "frontend\src\environments\environment.ts"

echo.
echo Demarrage d'Angular...
echo.
echo ===============================================
echo   Partage ces liens avec tes potes :
echo.
echo   API backend : %NGROK_URL%
echo   Frontend    : lance "ngrok http 4200" dans
echo                 un autre terminal, puis copie
echo                 cette URL pour tes potes
echo.
echo   OU plus simple : partage juste l'URL ngrok
echo   du backend, tes potes ont besoin du frontend
echo   -> lance aussi: ngrok http 4200
echo ===============================================
echo.

cd frontend
call npx ng serve --host 0.0.0.0 --port 4200

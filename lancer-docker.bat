@echo off
cd /d "%~dp0"
echo ================================================
echo   AirBnB Clone Maroc - Lancement Docker complet
echo ================================================
echo.

REM Vérifier que le token ngrok est bien configuré
findstr /C:"colle_ton_token_ici" .env >nul 2>&1
if %errorlevel% == 0 (
    echo [!] ATTENTION : Tu n'as pas encore mis ton token ngrok !
    echo.
    echo     1. Va sur : https://dashboard.ngrok.com/get-started/your-authtoken
    echo     2. Connecte-toi / cree un compte gratuit
    echo     3. Copie ton token
    echo     4. Ouvre le fichier .env dans ce dossier
    echo     5. Remplace "colle_ton_token_ici" par ton token
    echo     6. Relance ce script
    echo.
    pause
    exit /b 1
)

echo  Services qui vont demarrer :
echo    [1] MongoDB
echo    [2] Neo4j      (UI : http://localhost:7474)
echo    [3] Backend    (Spring Boot - interne)
echo    [4] Frontend   (nginx - http://localhost)
echo    [5] ngrok      (tunnel internet)
echo.
echo  Premier lancement : 5-10 min (build des images)
echo  Lancements suivants : ~1 min
echo.
echo  Lancement en cours...
echo ================================================

REM Lancer en arrière-plan pour pouvoir afficher l'URL
docker compose -f docker-compose.full.yml up --build -d

echo.
echo  En attente du démarrage de ngrok...
timeout /t 8 /nobreak >nul

echo.
echo ================================================
echo   URL DE TON SITE (à partager avec tes potes) :
echo ================================================
echo.

REM Récupérer l'URL ngrok via son API locale
curl -s http://localhost:4040/api/tunnels 2>nul | python -c "
import sys, json
try:
    data = json.load(sys.stdin)
    tunnels = data.get('tunnels', [])
    for t in tunnels:
        url = t.get('public_url', '')
        if url.startswith('https'):
            print('  SITE  : ' + url)
            print('  NEO4J : Visible dans l app')
    if not tunnels:
        print('  ngrok demarre encore... Va sur http://localhost:4040')
except:
    print('  Va sur http://localhost:4040 pour voir l URL ngrok')
"

echo.
echo  Pour arreter tout :
echo    docker compose -f docker-compose.full.yml down
echo.
echo  Pour voir les logs en direct :
echo    docker compose -f docker-compose.full.yml logs -f
echo ================================================
pause

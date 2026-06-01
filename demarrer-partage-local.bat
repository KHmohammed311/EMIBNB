@echo off
echo ===============================================
echo   AirBnB Clone Maroc - Partage Réseau Local
echo   Tes potes doivent etre sur le MEME WIFI
echo ===============================================
echo.

set MON_IP=192.168.1.5

echo [1/3] Mise a jour de l'URL API avec ton IP locale...
echo export const environment = { > "frontend\src\environments\environment.ts"
echo   production: false, >> "frontend\src\environments\environment.ts"
echo   apiUrl: 'http://%MON_IP%:8080' >> "frontend\src\environments\environment.ts"
echo }; >> "frontend\src\environments\environment.ts"

echo [2/3] Ouverture du pare-feu Windows pour les ports 4200 et 8080...
netsh advfirewall firewall add rule name="AirBnB-Frontend" dir=in action=allow protocol=TCP localport=4200 >nul 2>&1
netsh advfirewall firewall add rule name="AirBnB-Backend"  dir=in action=allow protocol=TCP localport=8080 >nul 2>&1
echo     OK - ports ouverts

echo.
echo [3/3] Demarrage d'Angular (accessible depuis le reseau)...
echo.
echo ===============================================
echo   Partage ces liens avec tes potes :
echo.
echo   SITE  : http://%MON_IP%:4200
echo   API   : http://%MON_IP%:8080
echo.
echo   Ils doivent etre connectes au meme WiFi !
echo ===============================================
echo.

cd frontend
call npx ng serve --host 0.0.0.0 --port 4200

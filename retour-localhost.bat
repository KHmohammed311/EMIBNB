@echo off
echo Remise en mode localhost...

echo export const environment = { > "frontend\src\environments\environment.ts"
echo   production: false, >> "frontend\src\environments\environment.ts"
echo   apiUrl: 'http://localhost:8080' >> "frontend\src\environments\environment.ts"
echo }; >> "frontend\src\environments\environment.ts"

echo OK - environment.ts remis sur localhost:8080

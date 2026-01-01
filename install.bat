@echo off
setlocal

set "URL=https://raw.githubusercontent.com/woidzero/stylizer/refs/heads/main/dist/stylizer.js"
set "TARGET=%APPDATA%\spicetify\Extensions"

if not exist "%TARGET%" (
    mkdir "%TARGET%"
)

powershell -Command "Invoke-WebRequest -Uri \"%URL%\" -OutFile \"%TARGET%\stylizer.js\""

echo Stylizer installed.

pause

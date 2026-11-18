@echo off
setlocal
chcp 65001 >nul
title Qianna Website - Local development
cd /d "%~dp0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-dev.ps1" %*
set "START_EXIT_CODE=%ERRORLEVEL%"
if not "%START_EXIT_CODE%"=="0" (
    echo.
    echo Website startup failed. See the error above.
    pause
)
exit /b %START_EXIT_CODE%

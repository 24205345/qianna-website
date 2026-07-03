@echo off
chcp 65001 >nul
title Qianna Website - 启动中
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-dev.ps1"
if errorlevel 1 (
    echo.
    echo 启动失败，请查看上方错误信息。
    pause
)

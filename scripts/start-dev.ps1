# 一键启动本地网站并打开浏览器
# 说明：本项目是 Next.js 全栈，npm run dev 同时提供前台页面与 /admin 后台；数据后端在 Supabase 云端，无需本地另起服务。
#
# 用法：
#   双击项目根目录 start.bat
#   或在 PowerShell： .\scripts\start-dev.ps1
#   或： npm run start:site

param(
    [string]$Port = "3000",
    [string]$Url = "http://localhost:3000",
    [int]$MaxWaitSeconds = 90
)

$ErrorActionPreference = "Stop"

# 项目根目录（scripts 的上一级）
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

# 公司电脑 Node 路径（可按需修改）
$NodeDir = "G:\node-v24.16.0-win-x64"
if (Test-Path $NodeDir) {
    $env:Path = "$NodeDir;" + $env:Path
} else {
    Write-Host "警告: 未找到 $NodeDir，将使用系统 PATH 中的 node/npm" -ForegroundColor Yellow
}

function Test-ServerReady {
    param([string]$TargetUrl)
    try {
        $null = Invoke-WebRequest -Uri $TargetUrl -UseBasicParsing -TimeoutSec 3 -Method Head
        return $true
    } catch {
        try {
            $null = Invoke-WebRequest -Uri $TargetUrl -UseBasicParsing -TimeoutSec 3
            return $true
        } catch {
            return $false
        }
    }
}

function Test-PortInUse {
    param([int]$TargetPort)
    $conn = Get-NetTCPConnection -LocalPort $TargetPort -State Listen -ErrorAction SilentlyContinue
    return $null -ne $conn
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Qianna Website - 本地开发一键启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "项目: $ProjectRoot"
Write-Host "地址: $Url"
Write-Host ""

# 可选：首页封面缺失时提示
$heroPath = Join-Path $ProjectRoot "public\images\hero-image.jpg"
if (-not (Test-Path $heroPath)) {
    Write-Host "提示: 首页封面缺失，可运行 .\scripts\download-home-hero.ps1" -ForegroundColor Yellow
}

if (Test-ServerReady -TargetUrl $Url) {
    Write-Host "开发服务器已在运行，直接打开浏览器..." -ForegroundColor Green
    Start-Process $Url
    Write-Host "已打开 $Url"
    exit 0
}

if (Test-PortInUse -TargetPort ([int]$Port)) {
    Write-Host "端口 $Port 已被占用，但网站未响应。请检查是否有其他程序占用该端口。" -ForegroundColor Red
    exit 1
}

Write-Host "正在新窗口启动 npm run dev ..." -ForegroundColor Green

$devCommand = @"
`$env:Path = '$NodeDir;' + `$env:Path
Set-Location '$ProjectRoot'
Write-Host 'Next.js 开发服务器启动中...' -ForegroundColor Cyan
Write-Host '关闭本窗口即可停止网站' -ForegroundColor Yellow
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $devCommand

Write-Host "等待服务器就绪（最多 ${MaxWaitSeconds}s）..."

$ready = $false
for ($i = 1; $i -le $MaxWaitSeconds; $i++) {
    if (Test-ServerReady -TargetUrl $Url) {
        $ready = $true
        Write-Host "服务器已就绪（${i}s）" -ForegroundColor Green
        break
    }
    Write-Host "  等待中... $i/$MaxWaitSeconds"
    Start-Sleep -Seconds 1
}

if (-not $ready) {
    Write-Host "超时：服务器未在 ${MaxWaitSeconds}s 内响应。" -ForegroundColor Red
    Write-Host "请查看弹出的 dev 窗口是否有报错。" -ForegroundColor Yellow
    exit 1
}

Start-Process $Url
Write-Host ""
Write-Host "已打开浏览器: $Url" -ForegroundColor Green
Write-Host ""
Write-Host "常用地址:" -ForegroundColor Cyan
Write-Host "  首页        $Url"
Write-Host "  后台登录    $Url/admin/login"
Write-Host "  项目管理    $Url/admin/projects"
Write-Host ""
Write-Host "停止网站：关闭标题为 dev 的 PowerShell 窗口即可。" -ForegroundColor Yellow
Write-Host ""

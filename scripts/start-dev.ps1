# 双击根目录 start.bat；服务与日志保留在同一窗口，Ctrl+C 停止。
# -NoBrowser 供终端检查使用；-Port 同时控制服务端口和默认打开地址。
param(
    [ValidateRange(1, 65535)]
    [int]$Port = 3000,
    [string]$Url,
    [ValidateRange(1, 600)]
    [int]$MaxWaitSeconds = 120,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $ProjectRoot
$SiteOrigin = "http://127.0.0.1:$Port"
$ReadyUrl = "$SiteOrigin/favicon.ico"
if (-not $Url) { $Url = $SiteOrigin }

function Find-Node {
    $candidates = @()
    $systemNode = Get-Command node.exe -ErrorAction SilentlyContinue
    if ($systemNode) { $candidates += $systemNode.Source }

    # Explorer 不一定继承终端的 PATH；从项目旁的便携运行时找 Node 24。
    $runtimeRoot = Join-Path (Split-Path $ProjectRoot -Parent) '.runtimes'
    if (Test-Path -LiteralPath $runtimeRoot) {
        $candidates += Get-ChildItem -LiteralPath $runtimeRoot -Directory -Filter 'node-v24*-win-x64' |
            Sort-Object LastWriteTime -Descending |
            ForEach-Object { Join-Path $_.FullName 'node.exe' }
    }

    foreach ($candidate in $candidates | Select-Object -Unique) {
        if (-not (Test-Path -LiteralPath $candidate)) { continue }
        $nodeVersion = & $candidate --version
        if ($LASTEXITCODE -eq 0 -and $nodeVersion -match '^v(\d+)\.' -and [int]$Matches[1] -ge 24) {
            return $candidate
        }
    }
    throw '未找到 Node.js 24。请安装 Node 24，或将便携运行时放在项目旁的 .runtimes 目录。'
}

function Test-ServerReady {
    param([string]$TargetUrl)
    $response = $null
    try {
        $request = [System.Net.WebRequest]::Create($TargetUrl)
        $request.Proxy = $null
        $request.Method = 'HEAD'
        $request.Timeout = 2000
        $response = $request.GetResponse()
        return [int]$response.StatusCode -eq 200
    } catch {
        return $false
    } finally {
        if ($response) { $response.Close() }
    }
}

function Test-PortInUse {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $connection = $client.ConnectAsync('127.0.0.1', $Port)
        return $connection.Wait(500) -and $client.Connected
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

$browserJob = $null
$launcherExitCode = 0
try {
    Write-Host ''
    Write-Host 'Qianna Website - 本地开发' -ForegroundColor Cyan
    Write-Host "项目: $ProjectRoot"
    Write-Host "地址: $Url"

    if (Test-ServerReady -TargetUrl $ReadyUrl) {
        Write-Host '网站已在运行，复用现有服务。' -ForegroundColor Green
        if (-not $NoBrowser) { Start-Process -FilePath $Url }
        exit 0
    }
    if (Test-PortInUse) {
        throw "端口 $Port 已被占用，但网站未就绪。请先关闭占用该端口的程序，或使用 -Port 指定其他端口。"
    }

    $nodePath = Find-Node
    $nodeDirectory = Split-Path $nodePath -Parent
    $npmPath = Join-Path $nodeDirectory 'npm.cmd'
    if (-not (Test-Path -LiteralPath $npmPath)) { throw "Node 目录缺少 npm.cmd：$nodeDirectory" }
    $env:Path = "$nodeDirectory;" + $env:Path
    Write-Host "Node: $nodePath"

    $lockFile = Join-Path $ProjectRoot 'package-lock.json'
    $moduleMarker = Join-Path $ProjectRoot 'node_modules/.package-lock.json'
    $nextCli = Join-Path $ProjectRoot 'node_modules/next/dist/bin/next'
    $needsInstall = -not (Test-Path -LiteralPath $moduleMarker) -or -not (Test-Path -LiteralPath $nextCli)
    if (-not $needsInstall -and (Test-Path -LiteralPath $lockFile)) {
        $needsInstall = (Get-Item -LiteralPath $lockFile).LastWriteTimeUtc -gt (Get-Item -LiteralPath $moduleMarker).LastWriteTimeUtc
    }
    if ($needsInstall) {
        Write-Host '正在安装或更新项目依赖…' -ForegroundColor Yellow
        & $npmPath install
        if ($LASTEXITCODE -ne 0) { throw "npm install 失败（退出码 $LASTEXITCODE），请查看上方错误。" }
    }

    if (-not $NoBrowser) {
        # 后台只负责等待就绪并打开页面；开发服务本身始终在当前窗口。
        $browserJob = Start-Job -ArgumentList $ReadyUrl, $Url, $MaxWaitSeconds -ScriptBlock {
            param($HealthUrl, $OpenUrl, $WaitSeconds)
            $timer = [System.Diagnostics.Stopwatch]::StartNew()
            while ($timer.Elapsed.TotalSeconds -lt $WaitSeconds) {
                $response = $null
                $ready = $false
                try {
                    $request = [System.Net.WebRequest]::Create($HealthUrl)
                    $request.Proxy = $null
                    $request.Method = 'HEAD'
                    $request.Timeout = 2000
                    $response = $request.GetResponse()
                    $ready = [int]$response.StatusCode -eq 200
                } catch {
                    $ready = $false
                } finally {
                    if ($response) { $response.Close() }
                }
                if ($ready) {
                    Start-Process -FilePath $OpenUrl
                    return
                }
                Start-Sleep -Seconds 1
            }
            Write-Warning "自动打开页面超时，请查看启动日志，并在服务就绪后手动打开 $OpenUrl"
        }
    }

    Write-Host ''
    Write-Host '启动日志就在本窗口；按 Ctrl+C 或关闭窗口停止网站。' -ForegroundColor Yellow
    Write-Host "交互实验室: $SiteOrigin/notes/ui-prototype-ergonomics/interface-lab.html?lang=zh"
    Write-Host "后台登录: $SiteOrigin/admin/login"
    Write-Host ''
    & $nodePath $nextCli dev --hostname 127.0.0.1 --port $Port
    $launcherExitCode = $LASTEXITCODE
    if ($launcherExitCode -ne 0) { throw "Next.js 启动失败（退出码 $launcherExitCode），请查看上方错误。" }
} catch {
    Write-Host ''
    Write-Host "启动失败：$($_.Exception.Message)" -ForegroundColor Red
    $launcherExitCode = 1
} finally {
    if ($browserJob) {
        Stop-Job -Job $browserJob
        Receive-Job -Job $browserJob
        Remove-Job -Job $browserJob
    }
}
exit $launcherExitCode

# 下载首页 Hero 封面（sparse-checkout 未包含 public/images/ 时使用）
$base = "https://raw.githubusercontent.com/24205345/qianna-website/main"
$root = "G:\project\qianna-website"
$rel = "public/images/hero-image.jpg"
$dest = Join-Path $root $rel
$dir = Split-Path $dest -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
Write-Host "Downloading $rel (~16MB, may take a minute) ..."
Invoke-WebRequest -Uri "$base/$rel" -OutFile $dest -UseBasicParsing
Write-Host "OK ($([math]::Round((Get-Item $dest).Length/1MB,2)) MB)"

# 从 GitHub raw 下载 Field Notes 媒体（63 张图）
$base = "https://raw.githubusercontent.com/24205345/qianna-website/main"
$root = "G:\project\qianna-website"

$files = @(
  # nanjiluo (17)
  "public/field-notes/nanjiluo/images/00_nanjiluo_cover.jpg"
)
for ($i = 1; $i -le 16; $i++) {
  $files += "public/field-notes/nanjiluo/images/{0:D2}_nanjiluo_hike_{1}.jpg" -f $i, $i
}
# yubeng (9)
$files += "public/field-notes/yubeng/images/00_yubeng_cover.jpg"
for ($i = 1; $i -le 8; $i++) {
  $files += "public/field-notes/yubeng/images/{0:D2}_yubeng_hike_{1}.jpg" -f $i, $i
}
# whitecliffs (11)
$files += "public/field-notes/whitecliffs/images/00_whitecliffs_cover.jpg"
for ($i = 1; $i -le 10; $i++) {
  $files += "public/field-notes/whitecliffs/images/{0:D2}_whitecliffs_hike_{1}.jpg" -f $i, $i
}
# gliding (21)
$files += "public/field-notes/gliding/images/00_gliding_cover.jpg"
for ($i = 1; $i -le 20; $i++) {
  $files += "public/field-notes/gliding/images/{0:D2}_gliding_flight_{1}.jpg" -f $i, $i
}
# snowboard (5)
$files += "public/field-notes/snowboard/images/00_superdevoluy_cover_map.jpg"
$files += "public/field-notes/snowboard/images/01_superdevoluy_slope_panorama.jpg"
$files += "public/field-notes/snowboard/images/02_superdevoluy_alpine_basin.jpg"
$files += "public/field-notes/snowboard/images/03_superdevoluy_board_rest_view.jpg"
$files += "public/field-notes/snowboard/images/04_superdevoluy_spring_chute.jpg"

foreach ($rel in $files) {
  $dest = Join-Path $root $rel
  $dir = Split-Path $dest -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $url = "$base/$($rel -replace ' ','%20')"
  Write-Host "Downloading $rel ..."
  try {
    Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
    Write-Host "  OK ($([math]::Round((Get-Item $dest).Length/1KB,0)) KB)"
  } catch {
    Write-Host "  FAILED: $_"
  }
}

Write-Host "DONE ($($files.Count) files)"

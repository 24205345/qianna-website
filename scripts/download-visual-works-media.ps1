# 从 GitHub raw 下载 Visual Works 媒体
$base = "https://raw.githubusercontent.com/24205345/qianna-website/main"
$root = "G:\project\qianna-website"

$files = @(
  "public/drawings/pen-drawing/pen_drawing_01.jpg",
  "public/drawings/pen-drawing/pen_drawing_02.jpg",
  "public/drawings/pen-drawing/pen_drawing_03.jpg",
  "public/drawings/pen-drawing/pen_drawing_04.jpg",
  "public/drawings/pen-drawing/pen_drawing_05.jpg",
  "public/drawings/pen-drawing/pen_drawing_06.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_01.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_02.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_03.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_04.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_05.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_06.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_07.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_08.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_09.jpg",
  "public/drawings/pen-and-wash/pen_and_wash_10.jpg",
  "public/drawings/watercolor/watercolor_01.jpg",
  "public/drawings/watercolor/watercolor_02.jpg",
  "public/drawings/watercolor/watercolor_03.jpg",
  "public/drawings/watercolor/watercolor_04.jpg",
  "public/drawings/watercolor/watercolor_05.jpg",
  "public/drawings/watercolor/watercolor_06.jpg"
)

foreach ($rel in $files) {
  $dest = Join-Path $root $rel
  $dir = Split-Path $dest -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $url = "$base/$rel"
  Write-Host "Downloading $rel ..."
  try {
    Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
    Write-Host "  OK ($([math]::Round((Get-Item $dest).Length/1KB,0)) KB)"
  } catch {
    Write-Host "  FAILED: $_"
  }
}

Write-Host "DONE ($($files.Count) files)"

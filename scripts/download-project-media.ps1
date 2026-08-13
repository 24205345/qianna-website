# 从 GitHub raw 下载项目媒体（sparse-checkout 太慢时的备用方案）
$base = "https://raw.githubusercontent.com/24205345/qianna-website/main"
$root = "G:\project\qianna-website"

$files = @(
  "public/projects/thesis/video/01_hero_video.mp4",
  "public/projects/thesis/images/01_Transport Gaps.jpg",
  "public/projects/thesis/images/02_Facility Services Analysis.jpg",
  "public/projects/thesis/images/03_Sensing Transport.jpg",
  "public/projects/thesis/images/04_T-Distributed Stochastic Neighbor Embedding (t-SNE) Spatial Clusters.jpg",
  "public/projects/thesis/images/05_Principles of Data Collection.jpg",
  "public/projects/thesis/images/06_Data Translation and Skeleton Generation.jpg",
  "public/projects/thesis/images/07_Strategic Overview.jpg",
  "public/projects/thesis/images/08_Rendering and Possibility.jpg",
  "public/projects/xicaoshi-red-temple/images/00_landscape_cover.jpg",
  "public/projects/xicaoshi-red-temple/images/01_site_analysis.jpg",
  "public/projects/xicaoshi-red-temple/images/02_current_situation_analysis.png",
  "public/projects/xicaoshi-red-temple/images/03_landscape_rendering.jpg",
  "public/projects/xicaoshi-red-temple/images/04_planning_guidelines.jpg",
  "public/projects/xicaoshi-red-temple/images/05_important_node_updates.png",
  "public/projects/xicaoshi-red-temple/images/07_courtyard_location_analysis.jpg",
  "public/projects/xicaoshi-red-temple/images/08_current_situation.png",
  "public/projects/xicaoshi-red-temple/images/09_morphological_evolution.png",
  "public/projects/xicaoshi-red-temple/images/10_analysis_chart.png",
  "public/projects/xicaoshi-red-temple/images/11_profile_view.jpg",
  "public/projects/xicaoshi-red-temple/images/12_ground_floor_plan.jpg",
  "public/projects/xicaoshi-red-temple/images/13_exploded_axonometric.jpg"
)

for ($page = 1; $page -le 15; $page++) {
  $files += ("public/projects/undergraduate-portfolio/pages/{0:D2}.jpg" -f $page)
}

foreach ($rel in $files) {
  $dest = Join-Path $root $rel
  $dir = Split-Path $dest -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $url = "$base/$($rel -replace ' ','%20')"
  Write-Host "Downloading $rel ..."
  try {
    Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
    $size = (Get-Item $dest).Length
    Write-Host "  OK ($([math]::Round($size/1MB,2)) MB)"
  } catch {
    Write-Host "  FAILED: $_"
  }
}

Write-Host "DONE"

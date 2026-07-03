# 从 GitHub raw 下载摄影模块媒体（sparse-checkout 排除 public/ 时使用）
$base = "https://raw.githubusercontent.com/24205345/qianna-website/main"
$root = "G:\project\qianna-website"

$files = @(
  # portraits-human-scale (10)
  "public/photography/portraits-human-scale/01_the_cat_charmer.jpg",
  "public/photography/portraits-human-scale/02_dune_scroller.jpg",
  "public/photography/portraits-human-scale/03_pilgrim_in_light.jpg",
  "public/photography/portraits-human-scale/04_beachcomber.jpg",
  "public/photography/portraits-human-scale/05_the_arched_lovers.jpg",
  "public/photography/portraits-human-scale/06_triangle_and_faith.jpg",
  "public/photography/portraits-human-scale/07_the_vicens_little_guest.jpg",
  "public/photography/portraits-human-scale/08_the_muscle_angler.jpg",
  "public/photography/portraits-human-scale/09_seafront_solitude.jpg",
  "public/photography/portraits-human-scale/10_rex_rooftop_play.jpg",
  # architecture-tectonics (18)
  "public/photography/architecture-tectonics/01_getty_travertine_curve.jpg",
  "public/photography/architecture-tectonics/02_getty_light_and_shadow.jpg",
  "public/photography/architecture-tectonics/03_getty_courtyard_view.jpg",
  "public/photography/architecture-tectonics/04_getty_modern_columns.jpg",
  "public/photography/architecture-tectonics/05_getty_garden_terraces.jpg",
  "public/photography/architecture-tectonics/06_getty_reflection_pool.jpg",
  "public/photography/architecture-tectonics/07_getty_architecture_lines.jpg",
  "public/photography/architecture-tectonics/08_getty_cactus_garden.jpg",
  "public/photography/architecture-tectonics/09_getty_winding_path.jpg",
  "public/photography/architecture-tectonics/10_getty_central_garden.jpg",
  "public/photography/architecture-tectonics/11_getty_tree_silhouette.jpg",
  "public/photography/architecture-tectonics/12_getty_azalea_pool.jpg",
  "public/photography/architecture-tectonics/13_getty_tram_ascending.jpg",
  "public/photography/architecture-tectonics/14_getty_city_distant.jpg",
  "public/photography/architecture-tectonics/15_getty_geometric_facade.jpg",
  "public/photography/architecture-tectonics/16_getty_marble_detail.jpg",
  "public/photography/architecture-tectonics/17_getty_viewing_terrace.jpg",
  "public/photography/architecture-tectonics/18_getty_evening_glow.jpg",
  # venice-biennale (18)
  "public/photography/venice-biennale/01_venice_biennale.jpg",
  "public/photography/venice-biennale/02_venice_biennale.jpg",
  "public/photography/venice-biennale/03_venice_biennale.jpg",
  "public/photography/venice-biennale/04_venice_biennale.jpg",
  "public/photography/venice-biennale/05_venice_biennale.jpg",
  "public/photography/venice-biennale/06_venice_biennale.jpg",
  "public/photography/venice-biennale/07_venice_biennale.jpg",
  "public/photography/venice-biennale/08_venice_biennale.jpg",
  "public/photography/venice-biennale/09_venice_biennale.jpg",
  "public/photography/venice-biennale/10_venice_biennale.jpg",
  "public/photography/venice-biennale/11_venice_biennale.jpg",
  "public/photography/venice-biennale/12_venice_biennale.jpg",
  "public/photography/venice-biennale/13_venice_biennale.jpg",
  "public/photography/venice-biennale/14_venice_biennale.jpg",
  "public/photography/venice-biennale/15_venice_biennale.jpg",
  "public/photography/venice-biennale/16_venice_biennale.jpg",
  "public/photography/venice-biennale/17_venice_biennale.jpg",
  "public/photography/venice-biennale/18_venice_biennale.jpg"
)

foreach ($rel in $files) {
  $dest = Join-Path $root $rel
  $dir = Split-Path $dest -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $url = "$base/$($rel -replace ' ','%20')"
  Write-Host "Downloading $rel ..."
  try {
    Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
    $size = (Get-Item $dest).Length
    Write-Host "  OK ($([math]::Round($size/1KB,0)) KB)"
  } catch {
    Write-Host "  FAILED: $_"
  }
}

Write-Host "DONE ($($files.Count) files)"

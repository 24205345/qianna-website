-- =============================================================================
-- seed-projects.sql
-- 将站点现有的 2 个项目导入 projects 表（可选，便于快速联通验证）。
-- 在 0001_init.sql 执行之后运行。封面图字段留空（cover_image_url = null），
-- 你可后续在后台编辑项目时上传封面到 portfolio-media。
--
-- 使用 on conflict (slug) 保证可重复执行（幂等）。
-- =============================================================================

insert into public.projects
  (title, slug, description, category, tags, year, status, sort_order)
values
  (
    'Between Destinations',
    'thesis',
    'The project investigates the emotional costs of London''s public transport system using geospatial analysis and wearable GSR sensors, proposing a dual intervention of a mobile app and a parasitic architectural system to redefine urban mobility and social interaction.',
    'Thesis & Design Research',
    array['Emotional Costs', 'Geospatial Analysis', 'Parasitic Architecture'],
    '2025',
    'published',
    0
  ),
  (
    'Landscape Description',
    'xicaoshi-red-temple',
    'Block preservation and renewal design for Xicaoshi Red Temple block on Beijing''s central axis, using urban acupuncture strategy for sustainable micro-renewal of historic urban areas.',
    'Architecture Project',
    array['Urban Acupuncture', 'Heritage Preservation', 'Micro-renewal'],
    '2023',
    'published',
    1
  )
on conflict (slug) do update set
  title       = excluded.title,
  description = excluded.description,
  category    = excluded.category,
  tags        = excluded.tags,
  year        = excluded.year,
  status      = excluded.status,
  sort_order  = excluded.sort_order;

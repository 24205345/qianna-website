-- 灌入 3 个摄影系列元数据（照片由 npm run migrate:photography 上传后写入）
insert into public.photography_collections (slug, title, subtitle, description, status, sort_order)
values
  (
    'portraits-human-scale',
    'Portraits & Human Scale',
    '10 photos · 2025',
    null,
    'published',
    0
  ),
  (
    'architecture-tectonics',
    'Architecture Tectonics',
    '18 photos · 2025',
    'Richard Meier''s modernist masterpiece — a symphony of travertine, light, and geometric precision perched above Los Angeles.',
    'published',
    1
  ),
  (
    'venice-biennale',
    'Venice Architecture Biennale 2025',
    '18 photos · June 2025',
    'The world''s most influential architectural exhibition — pavilions, installations, and spatial experiments across Giardini and Arsenale.',
    'published',
    2
  )
on conflict (slug) do update set
  title       = excluded.title,
  subtitle    = excluded.subtitle,
  description = excluded.description,
  status      = excluded.status,
  sort_order  = excluded.sort_order;

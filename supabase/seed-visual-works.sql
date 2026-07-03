insert into public.visual_work_categories (slug, title, subtitle, description, status, sort_order)
values
  (
    'pen-drawing',
    'Pen Drawings',
    '6 works · 2019',
    'Pure line work — the precision of ink capturing form and texture.',
    'published',
    0
  ),
  (
    'pen-and-wash',
    'Pen & Wash',
    '10 works · 2019-2020',
    'The marriage of ink and watercolor — structured lines softened by translucent washes.',
    'published',
    1
  ),
  (
    'watercolor',
    'Watercolors',
    '6 works · 2019',
    'Fluid pigments dancing on paper — light, transparency, and atmosphere.',
    'published',
    2
  )
on conflict (slug) do update set
  title       = excluded.title,
  subtitle    = excluded.subtitle,
  description = excluded.description,
  status      = excluded.status,
  sort_order  = excluded.sort_order;

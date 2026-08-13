-- Undergraduate portfolio project (Issuu-style spreads)
-- Run after seed-projects.sql or standalone via Supabase SQL Editor.

alter table public.projects drop constraint if exists projects_layout_template_check;
alter table public.projects add constraint projects_layout_template_check
  check (layout_template in ('default', 'thesis', 'xicaoshi', 'portfolio'));

insert into public.projects (
  title,
  slug,
  subtitle,
  description,
  category,
  tags,
  year,
  status,
  sort_order,
  layout_template,
  cover_image_url,
  overview_paragraphs,
  project_details
)
values (
  'Selected Works',
  'undergraduate-portfolio',
  '2019–2023 · Beijing Jiaotong University',
  'Undergraduate architectural portfolio from Beijing Jiaotong University (2019–2023), featuring four studio projects presented as full-page spreads.',
  'Architecture Project',
  array['BJTU', 'Architecture Design', 'Portfolio'],
  '2019–2023',
  'published',
  2,
  'portfolio',
  '/projects/undergraduate-portfolio/pages/01.jpg',
  array[
    'Selected undergraduate studio work from Beijing Jiaotong University, compiled as a four-project architectural portfolio for graduate applications.',
    'The booklet moves from community-scale housing near campus, to a speculative floating high-rise, a historic block renewal study on Beijing''s central axis, and an urban insertion project along Xiangchang Road.',
    'Pages are presented below as full spreads in a vertical scroll, similar to a digital Issuu booklet, so visitors can read the portfolio in its original layout rather than as isolated thumbnails.'
  ],
  '[
    {"label":"Institution","value":"Beijing Jiaotong University (BJTU)"},
    {"label":"Programme","value":"Architecture Design"},
    {"label":"Period","value":"2019–2023"}
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  category = excluded.category,
  tags = excluded.tags,
  year = excluded.year,
  status = excluded.status,
  sort_order = excluded.sort_order,
  layout_template = excluded.layout_template,
  cover_image_url = excluded.cover_image_url,
  overview_paragraphs = excluded.overview_paragraphs,
  project_details = excluded.project_details;

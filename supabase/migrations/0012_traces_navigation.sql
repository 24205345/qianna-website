-- =============================================================================
-- 0012_traces_navigation.sql
-- Traces hub navigation: four homepage pillars, traces_category group
-- =============================================================================

alter table public.site_navigation_items
  drop constraint if exists site_navigation_items_item_group_check;

alter table public.site_navigation_items
  add constraint site_navigation_items_item_group_check
  check (item_group in ('section', 'project_category', 'traces_category', 'page_link'));

update public.site_navigation_items
set
  title = 'Projects',
  label = 'View all projects'
where item_key = 'projects-preview';

insert into public.site_navigation_items (
  item_key,
  item_group,
  label,
  title,
  description,
  href,
  sort_order
) values (
  'traces-preview',
  'section',
  'View all traces',
  'Traces',
  'Photography, drawing, and field observation — quiet records of light, form, and movement.',
  '/traces',
  35
)
on conflict (item_key) do update set
  item_group = excluded.item_group,
  label = excluded.label,
  title = excluded.title,
  description = excluded.description,
  href = excluded.href,
  sort_order = excluded.sort_order;

update public.site_navigation_items
set
  item_group = 'traces_category',
  label = 'Photography',
  title = 'Quiet urban frames',
  description = 'A separate collection of observations in light, movement, and place.',
  href = '/traces?tab=photography',
  sort_order = 40
where item_key = 'photography';

update public.site_navigation_items
set
  item_group = 'traces_category',
  label = 'Drawings',
  title = 'Drawings and sketches',
  description = 'Studies in form, rhythm, and atmosphere developed by hand and mixed media.',
  href = '/traces?tab=drawings',
  sort_order = 50
where item_key = 'visual-works';

update public.site_navigation_items
set
  item_group = 'traces_category',
  label = 'Field Notes',
  title = 'Trails and movement',
  description = 'Trails, slopes, and open landscapes.',
  href = '/traces?tab=field-notes',
  sort_order = 60
where item_key = 'field-notes';

update public.site_navigation_items
set
  item_group = 'section',
  label = 'View all',
  title = 'Spatial Thinking, AI Products',
  description = 'A path from architecture and urban research to SaaS systems and AI product work, focused on turning complex workflows into usable digital tools.',
  sort_order = 70
where item_key = 'about';

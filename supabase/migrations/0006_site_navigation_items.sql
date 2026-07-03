-- =============================================================================
-- 0006_site_navigation_items.sql
-- Site Navigation: homepage cards and linked page headings
-- =============================================================================

create table if not exists public.site_navigation_items (
  item_key    text primary key,
  item_group  text not null
    check (item_group in ('section', 'project_category', 'page_link')),
  label       text not null,
  title       text not null,
  description text not null default '',
  href        text not null,
  sort_order  int not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

drop trigger if exists site_navigation_items_set_updated_at on public.site_navigation_items;
create trigger site_navigation_items_set_updated_at
  before update on public.site_navigation_items
  for each row execute function public.set_updated_at();

grant select on public.site_navigation_items to anon;
grant select, insert, update, delete on public.site_navigation_items to authenticated;
grant all on public.site_navigation_items to service_role;

alter table public.site_navigation_items enable row level security;

drop policy if exists "site_navigation_items_anon_select" on public.site_navigation_items;
create policy "site_navigation_items_anon_select"
  on public.site_navigation_items for select to anon using (true);

drop policy if exists "site_navigation_items_auth_select_all" on public.site_navigation_items;
create policy "site_navigation_items_auth_select_all"
  on public.site_navigation_items for select to authenticated using (true);

drop policy if exists "site_navigation_items_auth_insert" on public.site_navigation_items;
create policy "site_navigation_items_auth_insert"
  on public.site_navigation_items for insert to authenticated with check (true);

drop policy if exists "site_navigation_items_auth_update" on public.site_navigation_items;
create policy "site_navigation_items_auth_update"
  on public.site_navigation_items for update to authenticated
  using (true)
  with check (true);

drop policy if exists "site_navigation_items_auth_delete" on public.site_navigation_items;
create policy "site_navigation_items_auth_delete"
  on public.site_navigation_items for delete to authenticated using (true);

insert into public.site_navigation_items (
  item_key,
  item_group,
  label,
  title,
  description,
  href,
  sort_order
) values
  (
    'projects-preview',
    'section',
    'View all projects',
    'Projects Preview',
    '',
    '/projects',
    0
  ),
  (
    'thesis-design-research',
    'project_category',
    'Projects',
    'Thesis & Design Research',
    'Urban systems, public life, and spatial narratives developed through mapping and critical inquiry.',
    '/projects?category=thesis-design-research',
    10
  ),
  (
    'architecture-projects',
    'project_category',
    'Projects',
    'Architecture Projects',
    'Studio and built work shaped by context, material sensitivity, and lived experience.',
    '/projects?category=architecture-projects',
    20
  ),
  (
    'digital-product-work',
    'project_category',
    'Projects',
    'Digital Product Work',
    'Interface concepts translating complex spatial data into clear tools for people and cities.',
    '/projects?category=digital-product-work',
    30
  ),
  (
    'photography',
    'page_link',
    'Photography',
    'Quiet urban frames',
    'A separate collection of observations in light, movement, and place.',
    '/photography',
    40
  ),
  (
    'visual-works',
    'page_link',
    'Visual Works',
    'Drawings and sketches',
    'Studies in form, rhythm, and atmosphere developed by hand and mixed media.',
    '/visual-works',
    50
  ),
  (
    'field-notes',
    'page_link',
    'Field Notes',
    'Trails and movement',
    'Hiking journeys, outdoor routes, and movement-based observation of landscapes.',
    '/field-notes',
    60
  ),
  (
    'about',
    'page_link',
    'About',
    'Background and approach',
    'Architecture training, urban design direction, and how research translates into design decisions.',
    '/about',
    70
  )
on conflict (item_key) do nothing;

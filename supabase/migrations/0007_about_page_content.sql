-- =============================================================================
-- 0007_about_page_content.sql
-- About page body CMS (timeline, tags, current focus)
-- Page title/description remain in site_navigation_items (item_key = about)
-- =============================================================================

create table if not exists public.about_page_content (
  singleton_key   text primary key default 'about'
    check (singleton_key = 'about'),
  current_focus   text not null default '',
  working_across  text[] not null default '{}',
  timeline_items  jsonb not null default '[]'::jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

drop trigger if exists about_page_content_set_updated_at on public.about_page_content;
create trigger about_page_content_set_updated_at
  before update on public.about_page_content
  for each row execute function public.set_updated_at();

grant select on public.about_page_content to anon;
grant select, insert, update, delete on public.about_page_content to authenticated;
grant all on public.about_page_content to service_role;

alter table public.about_page_content enable row level security;

drop policy if exists "about_page_content_anon_select" on public.about_page_content;
create policy "about_page_content_anon_select"
  on public.about_page_content for select to anon using (true);

drop policy if exists "about_page_content_auth_select_all" on public.about_page_content;
create policy "about_page_content_auth_select_all"
  on public.about_page_content for select to authenticated using (true);

drop policy if exists "about_page_content_auth_insert" on public.about_page_content;
create policy "about_page_content_auth_insert"
  on public.about_page_content for insert to authenticated
  with check (singleton_key = 'about');

drop policy if exists "about_page_content_auth_update" on public.about_page_content;
create policy "about_page_content_auth_update"
  on public.about_page_content for update to authenticated
  using (singleton_key = 'about')
  with check (singleton_key = 'about');

drop policy if exists "about_page_content_auth_delete" on public.about_page_content;
create policy "about_page_content_auth_delete"
  on public.about_page_content for delete to authenticated
  using (singleton_key = 'about');

insert into public.about_page_content (
  singleton_key,
  current_focus,
  working_across,
  timeline_items
) values (
  'about',
  'Today, I am interested in AI products that help people observe, organize, and act on complex information, especially in spatial, industrial, and operational contexts.',
  array[
    'Spatial systems',
    'Enterprise workflows',
    'Urban data and mapping',
    'Visual communication',
    'AI product development'
  ],
  '[
    {
      "period": "2025-Now",
      "title": "AI Product Manager",
      "description": "Working on digital platform development in the optical display manufacturing industry, focusing on AI product management and platform-based workflows.",
      "sort_order": 0
    },
    {
      "period": "2024-2025",
      "title": "Urban Design",
      "description": "Studied Urban Design at University College London. In the RC15 cluster, researched urban biodiversity mapping through spatial data, visual mapping, and AI-assisted workflows.",
      "sort_order": 1
    },
    {
      "period": "2023-2024",
      "title": "SaaS ERP Product Internship",
      "description": "Worked in a software company serving the FMCG industry, moving from UI design to product management and learning how enterprise workflows become digital tools.",
      "sort_order": 2
    },
    {
      "period": "2018-2023",
      "title": "Architecture Design",
      "description": "Studied Architecture Design at Beijing Jiaotong University (BJTU), building a foundation in spatial design, public life, visual storytelling, and design research.",
      "sort_order": 3
    }
  ]'::jsonb
)
on conflict (singleton_key) do nothing;

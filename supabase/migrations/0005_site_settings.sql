-- =============================================================================
-- 0005_site_settings.sql
-- Site Settings：首页 Hero 轻量 CMS 配置
-- =============================================================================

create table if not exists public.site_settings (
  singleton_key  text primary key default 'home'
    check (singleton_key = 'home'),
  hero_title     text not null default 'Qianna Wang',
  hero_subtitle  text not null default 'Urban design, visual storytelling, and spatial observation.',
  hero_cta_label text not null default 'Enter',
  hero_image_url text not null default '/images/hero-image.jpg',
  hero_image_alt text not null default 'Qianna Wang cover image',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_anon_select" on public.site_settings;
create policy "site_settings_anon_select"
  on public.site_settings for select to anon using (true);

drop policy if exists "site_settings_auth_select_all" on public.site_settings;
create policy "site_settings_auth_select_all"
  on public.site_settings for select to authenticated using (true);

drop policy if exists "site_settings_auth_insert" on public.site_settings;
create policy "site_settings_auth_insert"
  on public.site_settings for insert to authenticated with check (singleton_key = 'home');

drop policy if exists "site_settings_auth_update" on public.site_settings;
create policy "site_settings_auth_update"
  on public.site_settings for update to authenticated
  using (singleton_key = 'home')
  with check (singleton_key = 'home');

drop policy if exists "site_settings_auth_delete" on public.site_settings;
create policy "site_settings_auth_delete"
  on public.site_settings for delete to authenticated using (singleton_key = 'home');

insert into public.site_settings (
  singleton_key,
  hero_title,
  hero_subtitle,
  hero_cta_label,
  hero_image_url,
  hero_image_alt
) values (
  'home',
  'Qianna Wang',
  'Urban design, visual storytelling, and spatial observation.',
  'Enter',
  '/images/hero-image.jpg',
  'Qianna Wang cover image'
) on conflict (singleton_key) do nothing;

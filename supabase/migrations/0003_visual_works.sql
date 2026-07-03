-- =============================================================================
-- 0003_visual_works.sql
-- Visual Works 模块：visual_work_categories + visual_works
-- =============================================================================

create table if not exists public.visual_work_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  subtitle    text,
  description text,
  status      text not null default 'published' check (status in ('draft', 'published')),
  sort_order  int not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists visual_work_categories_status_idx on public.visual_work_categories (status);
create index if not exists visual_work_categories_sort_order_idx on public.visual_work_categories (sort_order);

create table if not exists public.visual_works (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.visual_work_categories (id) on delete cascade,
  url         text not null,
  title       text not null,
  date        text,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz default now()
);

create index if not exists visual_works_category_id_idx on public.visual_works (category_id);

drop trigger if exists visual_work_categories_set_updated_at on public.visual_work_categories;
create trigger visual_work_categories_set_updated_at
  before update on public.visual_work_categories
  for each row execute function public.set_updated_at();

grant select on public.visual_work_categories to anon;
grant select on public.visual_works to anon;
grant select, insert, update, delete on public.visual_work_categories to authenticated;
grant select, insert, update, delete on public.visual_works to authenticated;
grant all on public.visual_work_categories to service_role;
grant all on public.visual_works to service_role;

alter table public.visual_work_categories enable row level security;
alter table public.visual_works enable row level security;

drop policy if exists "visual_work_categories_anon_select_published" on public.visual_work_categories;
create policy "visual_work_categories_anon_select_published"
  on public.visual_work_categories for select to anon using (status = 'published');

drop policy if exists "visual_work_categories_auth_select_all" on public.visual_work_categories;
create policy "visual_work_categories_auth_select_all"
  on public.visual_work_categories for select to authenticated using (true);

drop policy if exists "visual_work_categories_auth_insert" on public.visual_work_categories;
create policy "visual_work_categories_auth_insert"
  on public.visual_work_categories for insert to authenticated with check (true);

drop policy if exists "visual_work_categories_auth_update" on public.visual_work_categories;
create policy "visual_work_categories_auth_update"
  on public.visual_work_categories for update to authenticated using (true) with check (true);

drop policy if exists "visual_work_categories_auth_delete" on public.visual_work_categories;
create policy "visual_work_categories_auth_delete"
  on public.visual_work_categories for delete to authenticated using (true);

drop policy if exists "visual_works_anon_select_published" on public.visual_works;
create policy "visual_works_anon_select_published"
  on public.visual_works for select to anon
  using (exists (select 1 from public.visual_work_categories c where c.id = category_id and c.status = 'published'));

drop policy if exists "visual_works_auth_select_all" on public.visual_works;
create policy "visual_works_auth_select_all"
  on public.visual_works for select to authenticated using (true);

drop policy if exists "visual_works_auth_insert" on public.visual_works;
create policy "visual_works_auth_insert"
  on public.visual_works for insert to authenticated with check (true);

drop policy if exists "visual_works_auth_update" on public.visual_works;
create policy "visual_works_auth_update"
  on public.visual_works for update to authenticated using (true) with check (true);

drop policy if exists "visual_works_auth_delete" on public.visual_works;
create policy "visual_works_auth_delete"
  on public.visual_works for delete to authenticated using (true);

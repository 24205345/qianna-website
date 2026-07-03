-- =============================================================================
-- 0002_photography.sql
-- Photography 模块：photography_collections + photography_photos
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 表：photography_collections
-- -----------------------------------------------------------------------------
create table if not exists public.photography_collections (
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

create index if not exists photography_collections_status_idx
  on public.photography_collections (status);
create index if not exists photography_collections_sort_order_idx
  on public.photography_collections (sort_order);

-- -----------------------------------------------------------------------------
-- 表：photography_photos
-- -----------------------------------------------------------------------------
create table if not exists public.photography_photos (
  id            uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.photography_collections (id) on delete cascade,
  url           text not null,
  title         text not null,
  date          text,
  location      text,
  description   text,
  sort_order    int not null default 0,
  created_at    timestamptz default now()
);

create index if not exists photography_photos_collection_id_idx
  on public.photography_photos (collection_id);

-- updated_at 触发器（collections）
drop trigger if exists photography_collections_set_updated_at on public.photography_collections;
create trigger photography_collections_set_updated_at
  before update on public.photography_collections
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- GRANT
-- =============================================================================
grant select on public.photography_collections to anon;
grant select on public.photography_photos      to anon;
grant select, insert, update, delete on public.photography_collections to authenticated;
grant select, insert, update, delete on public.photography_photos      to authenticated;
grant all on public.photography_collections to service_role;
grant all on public.photography_photos      to service_role;

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.photography_collections enable row level security;
alter table public.photography_photos      enable row level security;

-- collections：anon 只读 published
drop policy if exists "photography_collections_anon_select_published" on public.photography_collections;
create policy "photography_collections_anon_select_published"
  on public.photography_collections for select to anon
  using (status = 'published');

drop policy if exists "photography_collections_auth_select_all" on public.photography_collections;
create policy "photography_collections_auth_select_all"
  on public.photography_collections for select to authenticated
  using (true);

drop policy if exists "photography_collections_auth_insert" on public.photography_collections;
create policy "photography_collections_auth_insert"
  on public.photography_collections for insert to authenticated
  with check (true);

drop policy if exists "photography_collections_auth_update" on public.photography_collections;
create policy "photography_collections_auth_update"
  on public.photography_collections for update to authenticated
  using (true) with check (true);

drop policy if exists "photography_collections_auth_delete" on public.photography_collections;
create policy "photography_collections_auth_delete"
  on public.photography_collections for delete to authenticated
  using (true);

-- photos：anon 可读属于 published collection 的照片
drop policy if exists "photography_photos_anon_select_published" on public.photography_photos;
create policy "photography_photos_anon_select_published"
  on public.photography_photos for select to anon
  using (
    exists (
      select 1 from public.photography_collections c
      where c.id = collection_id and c.status = 'published'
    )
  );

drop policy if exists "photography_photos_auth_select_all" on public.photography_photos;
create policy "photography_photos_auth_select_all"
  on public.photography_photos for select to authenticated
  using (true);

drop policy if exists "photography_photos_auth_insert" on public.photography_photos;
create policy "photography_photos_auth_insert"
  on public.photography_photos for insert to authenticated
  with check (true);

drop policy if exists "photography_photos_auth_update" on public.photography_photos;
create policy "photography_photos_auth_update"
  on public.photography_photos for update to authenticated
  using (true) with check (true);

drop policy if exists "photography_photos_auth_delete" on public.photography_photos;
create policy "photography_photos_auth_delete"
  on public.photography_photos for delete to authenticated
  using (true);

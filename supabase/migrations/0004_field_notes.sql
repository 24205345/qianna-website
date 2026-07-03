-- =============================================================================
-- 0004_field_notes.sql
-- Field Notes 模块：field_notes + field_note_media
-- =============================================================================

create table if not exists public.field_notes (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  date            text not null,
  location        text not null,
  description     text not null,
  activity        text,
  cover_image_url text not null,
  layout_template text not null default 'gallery'
    check (layout_template in ('gallery', 'narrative')),
  sort_order      int not null default 0,
  status          text not null default 'published'
    check (status in ('draft', 'published')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists field_notes_status_idx on public.field_notes (status);
create index if not exists field_notes_sort_order_idx on public.field_notes (sort_order);

create table if not exists public.field_note_media (
  id            uuid primary key default gen_random_uuid(),
  field_note_id uuid not null references public.field_notes (id) on delete cascade,
  type          text not null check (type in ('image', 'video_external')),
  url           text not null,
  title         text,
  caption       text,
  section_key   text,
  layout        text check (layout in ('gallery', 'full_width', 'text_left', 'text_right')),
  aspect_ratio  text,
  sort_order    int not null default 0,
  created_at    timestamptz default now()
);

create index if not exists field_note_media_field_note_id_idx on public.field_note_media (field_note_id);

drop trigger if exists field_notes_set_updated_at on public.field_notes;
create trigger field_notes_set_updated_at
  before update on public.field_notes
  for each row execute function public.set_updated_at();

grant select on public.field_notes to anon;
grant select on public.field_note_media to anon;
grant select, insert, update, delete on public.field_notes to authenticated;
grant select, insert, update, delete on public.field_note_media to authenticated;
grant all on public.field_notes to service_role;
grant all on public.field_note_media to service_role;

alter table public.field_notes enable row level security;
alter table public.field_note_media enable row level security;

drop policy if exists "field_notes_anon_select_published" on public.field_notes;
create policy "field_notes_anon_select_published"
  on public.field_notes for select to anon using (status = 'published');

drop policy if exists "field_notes_auth_select_all" on public.field_notes;
create policy "field_notes_auth_select_all"
  on public.field_notes for select to authenticated using (true);

drop policy if exists "field_notes_auth_insert" on public.field_notes;
create policy "field_notes_auth_insert"
  on public.field_notes for insert to authenticated with check (true);

drop policy if exists "field_notes_auth_update" on public.field_notes;
create policy "field_notes_auth_update"
  on public.field_notes for update to authenticated using (true) with check (true);

drop policy if exists "field_notes_auth_delete" on public.field_notes;
create policy "field_notes_auth_delete"
  on public.field_notes for delete to authenticated using (true);

drop policy if exists "field_note_media_anon_select_published" on public.field_note_media;
create policy "field_note_media_anon_select_published"
  on public.field_note_media for select to anon
  using (exists (select 1 from public.field_notes n where n.id = field_note_id and n.status = 'published'));

drop policy if exists "field_note_media_auth_select_all" on public.field_note_media;
create policy "field_note_media_auth_select_all"
  on public.field_note_media for select to authenticated using (true);

drop policy if exists "field_note_media_auth_insert" on public.field_note_media;
create policy "field_note_media_auth_insert"
  on public.field_note_media for insert to authenticated with check (true);

drop policy if exists "field_note_media_auth_update" on public.field_note_media;
create policy "field_note_media_auth_update"
  on public.field_note_media for update to authenticated using (true) with check (true);

drop policy if exists "field_note_media_auth_delete" on public.field_note_media;
create policy "field_note_media_auth_delete"
  on public.field_note_media for delete to authenticated using (true);

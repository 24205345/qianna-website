-- =============================================================================
-- 0010_notes.sql
-- Notes 模块：长文 Markdown 笔记 + 首页 notes-preview 导航区块
-- =============================================================================

create table if not exists public.notes (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text unique not null,
  excerpt          text not null default '',
  body_markdown    text not null default '',
  cover_image_url  text,
  tags             text[] not null default '{}',
  status           text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at     timestamptz,
  sort_order       int not null default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists notes_status_idx on public.notes (status);
create index if not exists notes_published_at_idx on public.notes (published_at desc nulls last);
create index if not exists notes_sort_order_idx on public.notes (sort_order);

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

grant select on public.notes to anon;
grant select, insert, update, delete on public.notes to authenticated;
grant all on public.notes to service_role;

alter table public.notes enable row level security;

drop policy if exists "notes_anon_select_published" on public.notes;
create policy "notes_anon_select_published"
  on public.notes for select to anon using (status = 'published');

drop policy if exists "notes_auth_select_all" on public.notes;
create policy "notes_auth_select_all"
  on public.notes for select to authenticated using (true);

drop policy if exists "notes_auth_insert" on public.notes;
create policy "notes_auth_insert"
  on public.notes for insert to authenticated with check (true);

drop policy if exists "notes_auth_update" on public.notes;
create policy "notes_auth_update"
  on public.notes for update to authenticated using (true) with check (true);

drop policy if exists "notes_auth_delete" on public.notes;
create policy "notes_auth_delete"
  on public.notes for delete to authenticated using (true);

-- Homepage Notes section (sibling of Projects Preview, rendered above it)
insert into public.site_navigation_items (
  item_key,
  item_group,
  label,
  title,
  description,
  href,
  sort_order
) values (
  'notes-preview',
  'section',
  'View all notes',
  'Notes',
  'Short notes on learning AI, building tools, and turning ideas into practice.',
  '/notes',
  -10
)
on conflict (item_key) do update set
  item_group = excluded.item_group,
  label = excluded.label,
  title = excluded.title,
  description = excluded.description,
  href = excluded.href,
  sort_order = excluded.sort_order;

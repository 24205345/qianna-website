-- =============================================================================
-- 0013_guestbook.sql
-- Public guestbook under About Me — moderation queue + RLS
-- =============================================================================

create table if not exists public.guestbook_messages (
  id           uuid primary key default gen_random_uuid(),
  author_name  text not null check (char_length(author_name) between 1 and 40),
  message      text not null check (char_length(message) between 1 and 500),
  status       text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  ip_hash      text,
  created_at   timestamptz not null default now()
);

create index if not exists guestbook_messages_status_created_idx
  on public.guestbook_messages (status, created_at desc);

create index if not exists guestbook_messages_ip_hash_created_idx
  on public.guestbook_messages (ip_hash, created_at desc)
  where ip_hash is not null;

grant select on public.guestbook_messages to anon;
grant insert on public.guestbook_messages to anon;
grant select, insert, update, delete on public.guestbook_messages to authenticated;
grant all on public.guestbook_messages to service_role;

alter table public.guestbook_messages enable row level security;

drop policy if exists "guestbook_anon_select_approved" on public.guestbook_messages;
create policy "guestbook_anon_select_approved"
  on public.guestbook_messages for select to anon
  using (status = 'approved');

drop policy if exists "guestbook_anon_insert_pending" on public.guestbook_messages;
create policy "guestbook_anon_insert_pending"
  on public.guestbook_messages for insert to anon
  with check (status = 'pending');

drop policy if exists "guestbook_auth_all" on public.guestbook_messages;
create policy "guestbook_auth_all"
  on public.guestbook_messages for all to authenticated
  using (true)
  with check (true);

create or replace function public.guestbook_force_pending_for_anon()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'anon' then
    new.status := 'pending';
  end if;
  return new;
end;
$$;

drop trigger if exists guestbook_force_pending_for_anon on public.guestbook_messages;
create trigger guestbook_force_pending_for_anon
  before insert on public.guestbook_messages
  for each row execute function public.guestbook_force_pending_for_anon();

create or replace function public.guestbook_is_rate_limited(p_ip_hash text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select count(*) >= 3
  from public.guestbook_messages
  where ip_hash = p_ip_hash
    and created_at >= now() - interval '1 hour';
$$;

grant execute on function public.guestbook_is_rate_limited(text) to anon;
grant execute on function public.guestbook_is_rate_limited(text) to authenticated;

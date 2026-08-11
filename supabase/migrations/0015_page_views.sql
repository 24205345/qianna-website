-- =============================================================================
-- 0015_page_views.sql
-- First-party analytics: PV, UV (visitor_hash), dwell time (duration_seconds)
-- =============================================================================

create table if not exists public.page_views (
  id               uuid primary key default gen_random_uuid(),
  content_type     text not null
    check (content_type in ('note', 'project', 'photography', 'page')),
  content_slug     text not null check (char_length(content_slug) between 1 and 120),
  path             text not null check (char_length(path) between 1 and 500),
  visitor_hash     text not null check (char_length(visitor_hash) = 64),
  viewed_at        timestamptz not null default now(),
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0)
);

create index if not exists page_views_viewed_at_idx
  on public.page_views (viewed_at desc);

create index if not exists page_views_content_idx
  on public.page_views (content_type, content_slug, viewed_at desc);

create index if not exists page_views_visitor_viewed_idx
  on public.page_views (visitor_hash, viewed_at desc);

grant select on public.page_views to authenticated;
grant all on public.page_views to service_role;

alter table public.page_views enable row level security;

drop policy if exists "page_views_auth_select" on public.page_views;
create policy "page_views_auth_select"
  on public.page_views for select to authenticated
  using (true);

create or replace function public.record_page_view_start(
  p_visitor_hash text,
  p_content_type text,
  p_content_slug text,
  p_path text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing uuid;
  v_id uuid;
begin
  if p_visitor_hash is null or char_length(p_visitor_hash) <> 64 then
    raise exception 'invalid visitor hash';
  end if;

  if p_content_type not in ('note', 'project', 'photography', 'page') then
    raise exception 'invalid content type';
  end if;

  select id
  into v_existing
  from public.page_views
  where visitor_hash = p_visitor_hash
    and content_type = p_content_type
    and content_slug = p_content_slug
    and viewed_at >= now() - interval '30 seconds'
  order by viewed_at desc
  limit 1;

  if v_existing is not null then
    return v_existing;
  end if;

  insert into public.page_views (
    content_type,
    content_slug,
    path,
    visitor_hash
  )
  values (
    p_content_type,
    p_content_slug,
    p_path,
    p_visitor_hash
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.record_page_view_end(
  p_view_id uuid,
  p_visitor_hash text,
  p_duration_seconds integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_duration_seconds is null or p_duration_seconds < 0 or p_duration_seconds > 86400 then
    return;
  end if;

  update public.page_views
  set duration_seconds = p_duration_seconds
  where id = p_view_id
    and visitor_hash = p_visitor_hash
    and duration_seconds is null
    and viewed_at >= now() - interval '1 day';
end;
$$;

grant execute on function public.record_page_view_start(text, text, text, text) to anon;
grant execute on function public.record_page_view_start(text, text, text, text) to authenticated;
grant execute on function public.record_page_view_end(uuid, text, integer) to anon;
grant execute on function public.record_page_view_end(uuid, text, integer) to authenticated;

-- Public homepage ranking by all-time note PV, not visitor-level analytics.
-- Only published note metadata is returned; page_views remains private.
create or replace function public.get_most_viewed_notes(p_limit integer default 3)
returns table (
  slug text,
  title text,
  title_en text,
  excerpt text,
  excerpt_en text,
  tags text[],
  published_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    n.slug,
    n.title,
    n.title_en,
    n.excerpt,
    n.excerpt_en,
    n.tags,
    n.published_at
  from public.notes as n
  cross join lateral (
    select count(*) as view_count
    from public.page_views as pv
    where pv.content_type = 'note'
      and pv.content_slug = n.slug
  ) as totals
  where n.status = 'published'
  order by totals.view_count desc, n.published_at desc nulls last, n.slug asc
  limit greatest(0, least(coalesce(p_limit, 3), 12));
$function$;

-- This bounded, read-only result is intentionally public. No visitor hashes,
-- paths, timestamps of visits, draft metadata, or raw view rows are exposed.
-- A fixed empty search_path and fully qualified table names prevent shadowing.
revoke all on function public.get_most_viewed_notes(integer) from public;
grant execute on function public.get_most_viewed_notes(integer) to anon, authenticated;

comment on function public.get_most_viewed_notes(integer) is
  'Published note previews ordered by all-time PV, publication date, then slug; maximum 12 rows. No private analytics fields returned.';

notify pgrst, 'reload schema';

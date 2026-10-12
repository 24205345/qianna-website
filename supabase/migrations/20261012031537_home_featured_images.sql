-- Home-only cover overrides; canonical project/gallery assets remain untouched.
create table if not exists public.home_featured_images (
  item_key text primary key check (length(item_key) <= 256 and item_key ~ '^(project|trace):.+$'),
  image_url text check (image_url is null or image_url ~ '^https://'),
  updated_at timestamptz not null default now()
);
alter table public.home_featured_images enable row level security;
grant select on public.home_featured_images to anon, authenticated;
grant insert, update on public.home_featured_images to authenticated;
grant all on public.home_featured_images to service_role;
create policy home_featured_images_public_read on public.home_featured_images for select to anon, authenticated using (true);
create policy home_featured_images_admin_insert on public.home_featured_images for insert to authenticated with check (
  (select auth.jwt() -> 'app_metadata' ->> 'cms_role') = 'admin'
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);
create policy home_featured_images_admin_update on public.home_featured_images for update to authenticated using (
  (select auth.jwt() -> 'app_metadata' ->> 'cms_role') = 'admin'
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
) with check (
  (select auth.jwt() -> 'app_metadata' ->> 'cms_role') = 'admin'
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);
create trigger home_featured_images_updated_at before update on public.home_featured_images
  for each row execute function public.set_updated_at();

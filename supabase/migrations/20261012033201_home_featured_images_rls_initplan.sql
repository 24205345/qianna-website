-- Keep authorization unchanged while evaluating JWT claims once per statement.
alter policy home_featured_images_admin_insert on public.home_featured_images
with check (
  (select auth.jwt()) -> 'app_metadata' ->> 'cms_role' = 'admin'
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);
alter policy home_featured_images_admin_update on public.home_featured_images
using (
  (select auth.jwt()) -> 'app_metadata' ->> 'cms_role' = 'admin'
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
)
with check (
  (select auth.jwt()) -> 'app_metadata' ->> 'cms_role' = 'admin'
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) = false
);

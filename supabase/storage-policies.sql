-- =============================================================================
-- storage-policies.sql
-- 存储桶 portfolio-media 的访问策略
--
-- 前置步骤（在 Supabase 控制台手动完成）：
--   Storage → New bucket → 名称填 portfolio-media → 勾选 "Public bucket"。
--   建桶后再在 SQL Editor 中执行本文件。
--
-- 说明：
--   * 公开桶本身允许通过公开 URL 读取对象（匿名读）。
--   * 下面再显式声明 storage.objects 的策略，确保：
--       - 任何人可读取 portfolio-media 桶内对象；
--       - 仅登录用户（authenticated）可上传 / 更新 / 删除。
--   * upsert（覆盖上传）在 Storage 中需要 INSERT + SELECT + UPDATE 三者齐全，
--     这里 authenticated 角色已同时具备，故 upsert 可用。
-- =============================================================================

-- 读：所有人（含匿名）可读取 portfolio-media 桶内对象
drop policy if exists "portfolio_media_public_read" on storage.objects;
create policy "portfolio_media_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'portfolio-media');

-- 写（新增）：仅登录用户可上传
drop policy if exists "portfolio_media_auth_insert" on storage.objects;
create policy "portfolio_media_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'portfolio-media');

-- 写（更新 / 覆盖）：仅登录用户
drop policy if exists "portfolio_media_auth_update" on storage.objects;
create policy "portfolio_media_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio-media')
  with check (bucket_id = 'portfolio-media');

-- 删除：仅登录用户
drop policy if exists "portfolio_media_auth_delete" on storage.objects;
create policy "portfolio_media_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio-media');

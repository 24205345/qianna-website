-- =============================================================================
-- 0001_init.sql
-- 初始化作品集 CMS 的数据库结构：projects / project_media 两张表
-- 包含：updated_at 自动更新触发器、行级安全（RLS）及访问策略
--
-- 执行方式：在 Supabase 控制台 → SQL Editor 中粘贴本文件全部内容并运行。
-- （本项目无数据库执行权限，SQL 仅以文件形式交付，请手动执行。）
-- =============================================================================

-- gen_random_uuid() 由 pgcrypto 提供；Supabase 默认已启用，这里确保存在。
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 表：projects
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique not null,
  subtitle        text,
  description     text,
  content         text,
  category        text,
  tags            text[],
  year            text,
  cover_image_url text,
  hero_video_url  text,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  sort_order      int not null default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 常用查询索引
create index if not exists projects_status_idx     on public.projects (status);
create index if not exists projects_sort_order_idx on public.projects (sort_order);

-- -----------------------------------------------------------------------------
-- 表：project_media
-- -----------------------------------------------------------------------------
create table if not exists public.project_media (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references public.projects (id) on delete cascade,
  type        text check (type in ('image', 'video', 'pdf')),
  url         text,
  title       text,
  caption     text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

create index if not exists project_media_project_id_idx on public.project_media (project_id);

-- -----------------------------------------------------------------------------
-- updated_at 自动更新触发器
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- 表级授权（GRANT）
-- 说明：RLS 只是“行级”过滤，前提是角色先拥有“表级”操作权限。
-- 通过 SQL/MCP 迁移建表时，Supabase 自动默认授权不一定生效，需显式 GRANT，
-- 否则 anon/authenticated 访问会报 "permission denied for table ..."。
-- =============================================================================
grant select on public.projects      to anon;
grant select on public.project_media to anon;
grant select, insert, update, delete on public.projects      to authenticated;
grant select, insert, update, delete on public.project_media to authenticated;
grant all on public.projects      to service_role;
grant all on public.project_media to service_role;

-- =============================================================================
-- 行级安全（RLS）
-- =============================================================================
alter table public.projects      enable row level security;
alter table public.project_media enable row level security;

-- -----------------------------------------------------------------------------
-- projects 策略
-- -----------------------------------------------------------------------------
-- 匿名（anon）：仅可读取 status = 'published' 的项目
drop policy if exists "projects_anon_select_published" on public.projects;
create policy "projects_anon_select_published"
  on public.projects
  for select
  to anon
  using (status = 'published');

-- 已登录（authenticated）：可读取全部（含 draft），便于后台管理
drop policy if exists "projects_auth_select_all" on public.projects;
create policy "projects_auth_select_all"
  on public.projects
  for select
  to authenticated
  using (true);

-- 已登录：可写入
drop policy if exists "projects_auth_insert" on public.projects;
create policy "projects_auth_insert"
  on public.projects
  for insert
  to authenticated
  with check (true);

-- 已登录：可更新（注意 RLS 下 update 需要可 select 该行，上面的 select 策略已覆盖）
drop policy if exists "projects_auth_update" on public.projects;
create policy "projects_auth_update"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

-- 已登录：可删除
drop policy if exists "projects_auth_delete" on public.projects;
create policy "projects_auth_delete"
  on public.projects
  for delete
  to authenticated
  using (true);

-- -----------------------------------------------------------------------------
-- project_media 策略
-- -----------------------------------------------------------------------------
-- 匿名：仅可读取“已发布项目”关联的媒体
drop policy if exists "project_media_anon_select_published" on public.project_media;
create policy "project_media_anon_select_published"
  on public.project_media
  for select
  to anon
  using (
    exists (
      select 1
      from public.projects p
      where p.id = project_media.project_id
        and p.status = 'published'
    )
  );

-- 已登录：可读取全部
drop policy if exists "project_media_auth_select_all" on public.project_media;
create policy "project_media_auth_select_all"
  on public.project_media
  for select
  to authenticated
  using (true);

-- 已登录：可写入
drop policy if exists "project_media_auth_insert" on public.project_media;
create policy "project_media_auth_insert"
  on public.project_media
  for insert
  to authenticated
  with check (true);

-- 已登录：可更新
drop policy if exists "project_media_auth_update" on public.project_media;
create policy "project_media_auth_update"
  on public.project_media
  for update
  to authenticated
  using (true)
  with check (true);

-- 已登录：可删除
drop policy if exists "project_media_auth_delete" on public.project_media;
create policy "project_media_auth_delete"
  on public.project_media
  for delete
  to authenticated
  using (true);

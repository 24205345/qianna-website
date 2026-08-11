-- 0016_about_profile_image.sql
-- Profile photo for About Me section (admin upload + public display)

alter table public.about_page_content
  add column if not exists profile_image_url text not null default '',
  add column if not exists profile_image_alt text not null default 'Qianna Wang profile photo';

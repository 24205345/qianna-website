-- =============================================================================
-- 0011_notes_i18n.sql
-- Notes bilingual fields: English for list/home, Chinese optional on detail
-- =============================================================================

alter table public.notes
  add column if not exists title_en text,
  add column if not exists excerpt_en text,
  add column if not exists body_markdown_en text;

comment on column public.notes.title_en is 'English title for list/home and detail EN mode';
comment on column public.notes.excerpt_en is 'English excerpt for list/home and detail EN mode';
comment on column public.notes.body_markdown_en is 'English body markdown for detail EN mode';

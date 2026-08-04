-- =============================================================================
-- 0014_guestbook_email.sql
-- Optional contact email on guestbook submissions (admin-only, not public)
-- =============================================================================

alter table public.guestbook_messages
  add column if not exists author_email text
  check (author_email is null or char_length(author_email) between 3 and 120);

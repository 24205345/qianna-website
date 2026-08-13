-- Hide xicaoshi-red-temple from public site (keep in admin as draft).

update public.projects
set status = 'draft'
where slug = 'xicaoshi-red-temple';

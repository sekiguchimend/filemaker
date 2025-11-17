-- Fix staff.phone_number column type to match notion-table.md definition
begin;

alter table if exists public.staff
  alter column phone_number type varchar(20);

comment on column public.staff.phone_number is '電話番号';

commit;


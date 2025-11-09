-- Add weekly work time columns to staff table
begin;

alter table if exists public.staff
  add column if not exists mon_start time,
  add column if not exists mon_end time,
  add column if not exists tue_start time,
  add column if not exists tue_end time,
  add column if not exists wed_start time,
  add column if not exists wed_end time,
  add column if not exists thu_start time,
  add column if not exists thu_end time,
  add column if not exists fri_start time,
  add column if not exists fri_end time,
  add column if not exists sat_start time,
  add column if not exists sat_end time,
  add column if not exists sun_start time,
  add column if not exists sun_end time;

comment on column public.staff.mon_start is '月曜出勤時間';
comment on column public.staff.mon_end   is '月曜退勤時間';
comment on column public.staff.tue_start is '火曜出勤時間';
comment on column public.staff.tue_end   is '火曜退勤時間';
comment on column public.staff.wed_start is '水曜出勤時間';
comment on column public.staff.wed_end   is '水曜退勤時間';
comment on column public.staff.thu_start is '木曜出勤時間';
comment on column public.staff.thu_end   is '木曜退勤時間';
comment on column public.staff.fri_start is '金曜出勤時間';
comment on column public.staff.fri_end   is '金曜退勤時間';
comment on column public.staff.sat_start is '土曜出勤時間';
comment on column public.staff.sat_end   is '土曜退勤時間';
comment on column public.staff.sun_start is '日曜出勤時間';
comment on column public.staff.sun_end   is '日曜退勤時間';

commit;



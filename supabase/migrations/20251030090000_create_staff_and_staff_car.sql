-- Create required extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Function to auto-update updated_at on row updates
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- staff_car table
create table if not exists public.staff_car (
  id uuid primary key default gen_random_uuid(),
  car_type varchar(100),
  color varchar(255),
  capacity integer,
  area varchar(255),
  "character" varchar(255),
  number integer,
  is_etc boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.staff_car is 'スタッフ車テーブル';
comment on column public.staff_car.id is 'UUID(PK)';
comment on column public.staff_car.car_type is '車種';
comment on column public.staff_car.color is '色';
comment on column public.staff_car.capacity is '定員';
comment on column public.staff_car.area is '車ナンバー地域';
comment on column public.staff_car."character" is '車ナンバーひらがな';
comment on column public.staff_car.number is '車ナンバー';
comment on column public.staff_car.is_etc is 'ETC有無';
comment on column public.staff_car.created_at is '作成日時';
comment on column public.staff_car.updated_at is '更新日時';

create trigger set_timestamp
before update on public.staff_car
for each row
execute function public.set_current_timestamp_updated_at();

-- staff table
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  sfid integer,
  first_name varchar(255),
  last_name varchar(255),
  first_name_furigana varchar(255),
  last_name_furigana varchar(255),
  area_division varchar(255),
  "group" varchar(255),
  status boolean,
  bath_towel integer,
  equipment integer,
  joining_date timestamptz,
  resignation_date timestamptz,
  position varchar(255),
  employment_type varchar(255),
  job_description varchar(255),
  mobile_email_address varchar(255),
  pc_email_address varchar(255),
  phone_number varchar(10),
  vehicle uuid references public.staff_car(id) on update cascade on delete set null,
  remarks varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.staff is 'スタッフテーブル';
comment on column public.staff.id is 'UUID(PK)';
comment on column public.staff.sfid is 'スタッフID（要件定義書より）';
comment on column public.staff.first_name is '名前';
comment on column public.staff.last_name is '苗字';
comment on column public.staff.first_name_furigana is '名前ふりがな';
comment on column public.staff.last_name_furigana is '苗字ふりがな';
comment on column public.staff.area_division is '地域区分';
comment on column public.staff."group" is 'グループ';
comment on column public.staff.status is '在職または退職';
comment on column public.staff.bath_towel is 'バスタオル持ち出し基礎数';
comment on column public.staff.equipment is '備品持ち出し基礎数';
comment on column public.staff.joining_date is '就労日';
comment on column public.staff.resignation_date is '退職日';
comment on column public.staff.position is '役職';
comment on column public.staff.employment_type is '雇用区分';
comment on column public.staff.job_description is '職務';
comment on column public.staff.mobile_email_address is '携帯メールアドレス';
comment on column public.staff.pc_email_address is 'PCメールアドレス';
comment on column public.staff.phone_number is '電話番号';
comment on column public.staff.vehicle is '車情報（staff_car.id）';
comment on column public.staff.remarks is '備考';
comment on column public.staff.created_at is '作成日時';
comment on column public.staff.updated_at is '更新日時';

create trigger set_timestamp
before update on public.staff
for each row
execute function public.set_current_timestamp_updated_at();




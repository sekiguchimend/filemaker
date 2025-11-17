-- Create ENUM types for shop table
create type extension_style_type as enum ('fixed_rate', 'hostess_specific');
create type business_style_type as enum ('delivery_health', 'hotel_health');

-- shop table
create table if not exists public.shop (
  id uuid primary key default gen_random_uuid(),
  spid integer,
  department_no integer,
  accounting_category varchar(10),
  store_name varchar(255),
  store_name_furigana varchar(255),
  store_name_short varchar(255),
  phone_number varchar(20),
  url varchar(255),
  mail varchar(255),
  is_web boolean,
  web_management_id varchar(255),
  web_management_pw varchar(255),
  web_management_url varchar(255),
  hostess_page_url varchar(255),
  hostess_list_url varchar(255),
  hostess_attendance_management_url varchar(255),
  hostess_management_url varchar(255),
  send_hsprofile varchar(255),
  send_hsattend varchar(255),
  send_hsjob varchar(255),
  send_ctpoint varchar(255),
  send_hsstart varchar(255),
  send_hsranking varchar(255),
  course_fee_style boolean,
  nomination_fee_style boolean,
  gm_category boolean,
  nomination_fee integer,
  extension_fee integer,
  extension_per_minutes integer,
  standard_transportation_expenses integer,
  cancel_fee integer,
  is_membership_card boolean,
  customer_point_initial_former integer,
  customer_point_initial_latter integer,
  is_nomination_plusback boolean,
  membership_number_management boolean,
  change_fee integer,
  card_commission integer,
  standard_hostess_recieve_rate numeric(5,2),
  extension_style extension_style_type,
  extension_hostess_recieve_rate numeric(5,2),
  panel_nomination_fee integer,
  star_price integer,
  group_no integer,
  business_style business_style_type,
  former_start varchar(10),
  former_end varchar(10),
  latter_start varchar(10),
  latter_end varchar(10),
  is_hs_send_room_no boolean,
  is_hs_send_end boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.shop is '店舗テーブル';
comment on column public.shop.id is '店舗の一意なID';
comment on column public.shop.spid is '店舗ID(要件定義書より)';
comment on column public.shop.department_no is '部門No';
comment on column public.shop.accounting_category is '会計区分';
comment on column public.shop.store_name is '店舗名';
comment on column public.shop.store_name_furigana is '店舗名ふりがな';
comment on column public.shop.store_name_short is '省略店舗名';
comment on column public.shop.phone_number is '電話番号';
comment on column public.shop.url is 'URL';
comment on column public.shop.mail is 'Mail';
comment on column public.shop.is_web is 'web連携';
comment on column public.shop.web_management_id is 'web管理用ID';
comment on column public.shop.web_management_pw is 'web管理用PW（暗号化必須）';
comment on column public.shop.web_management_url is 'web管理用URL';
comment on column public.shop.hostess_page_url is 'ホステスページURL';
comment on column public.shop.hostess_list_url is 'webホステス一覧URL';
comment on column public.shop.hostess_attendance_management_url is 'ホステス出勤管理ページURL';
comment on column public.shop.hostess_management_url is 'ホステス管理URL';
comment on column public.shop.send_hsprofile is 'Web送信用';
comment on column public.shop.send_hsattend is 'Web送信用';
comment on column public.shop.send_hsjob is 'Web送信用';
comment on column public.shop.send_ctpoint is 'Web送信用';
comment on column public.shop.send_hsstart is 'Web送信用';
comment on column public.shop.send_hsranking is 'Web送信用';
comment on column public.shop.course_fee_style is 'コース料金方式(定額制/割合制)';
comment on column public.shop.nomination_fee_style is '指名料方式(店舗一律/ホステス別)';
comment on column public.shop.gm_category is 'GM区分(有無)';
comment on column public.shop.nomination_fee is '指名料';
comment on column public.shop.extension_fee is '延長料金(円)';
comment on column public.shop.extension_per_minutes is '延長料金(/分)';
comment on column public.shop.standard_transportation_expenses is '基本交通費';
comment on column public.shop.cancel_fee is 'キャンセル料';
comment on column public.shop.is_membership_card is '会員カード発行(有無)';
comment on column public.shop.customer_point_initial_former is '顧客ポイント初期値前半';
comment on column public.shop.customer_point_initial_latter is '顧客ポイント初期値後半';
comment on column public.shop.is_nomination_plusback is '指名プラスバック制(有無)';
comment on column public.shop.membership_number_management is '会員番号発行管理(店舗/グループ)';
comment on column public.shop.change_fee is 'チェンジ料';
comment on column public.shop.card_commission is 'カード手数料';
comment on column public.shop.standard_hostess_recieve_rate is '基本ホステス受取率(%)';
comment on column public.shop.extension_style is '延長方式(固定割合制/ホステス別)';
comment on column public.shop.extension_hostess_recieve_rate is '延長ホステス受取率(%)';
comment on column public.shop.panel_nomination_fee is 'パネル指名料';
comment on column public.shop.star_price is '星単価';
comment on column public.shop.group_no is '所属グループナンバー';
comment on column public.shop.business_style is 'デリヘルまたはホテヘルの列挙型';
comment on column public.shop.former_start is '前半開始時刻(以降)';
comment on column public.shop.former_end is '前半終了時刻(未満)';
comment on column public.shop.latter_start is '後半開始時刻(以降)';
comment on column public.shop.latter_end is '後半終了時刻(未満)';
comment on column public.shop.is_hs_send_room_no is 'hs送信客室番号';
comment on column public.shop.is_hs_send_end is 'hs送信完了';
comment on column public.shop.created_at is '作成日時';
comment on column public.shop.updated_at is '更新日時';

create trigger set_timestamp
before update on public.shop
for each row
execute function public.set_current_timestamp_updated_at();


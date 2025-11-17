// 店舗（shop）テーブル関連の型定義
// APIレスポンスはスネークケースで返されるため、型定義もスネークケースに合わせる

export interface Shop {
  id: string;
  spid: number | null;
  department_no: number | null;
  accounting_category: string | null;
  store_name: string | null;
  store_name_furigana: string | null;
  store_name_short: string | null;
  phone_number: string | null;
  url: string | null;
  mail: string | null;
  is_web: boolean | null;
  web_management_id: string | null;
  web_management_url: string | null;
  hostess_page_url: string | null;
  hostess_list_url: string | null;
  hostess_attendance_management_url: string | null;
  hostess_management_url: string | null;
  send_hsprofile: string | null;
  send_hsattend: string | null;
  send_hsjob: string | null;
  send_ctpoint: string | null;
  send_hsstart: string | null;
  send_hsranking: string | null;
  course_fee_style: boolean | null;
  nomination_fee_style: boolean | null;
  gm_category: boolean | null;
  nomination_fee: number | null;
  extension_fee: number | null;
  extension_per_minutes: number | null;
  standard_transportation_expenses: number | null;
  cancel_fee: number | null;
  is_membership_card: boolean | null;
  customer_point_initial_former: number | null;
  customer_point_initial_latter: number | null;
  is_nomination_plusback: boolean | null;
  membership_number_management: boolean | null;
  change_fee: number | null;
  card_commission: number | null;
  standard_hostess_recieve_rate: number | null;
  extension_style: 'fixed_rate' | 'hostess_specific' | null;
  extension_hostess_recieve_rate: number | null;
  panel_nomination_fee: number | null;
  star_price: number | null;
  group_no: number | null;
  business_style: 'delivery_health' | 'hotel_health' | null;
  former_start: string | null;
  former_end: string | null;
  latter_start: string | null;
  latter_end: string | null;
  is_hs_send_room_no: boolean | null;
  is_hs_send_end: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}


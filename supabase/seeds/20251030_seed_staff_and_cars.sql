begin;

-- Seed staff_car
insert into public.staff_car (id, car_type, color, capacity, area, "character", number, is_etc)
values
  ('11111111-1111-1111-1111-111111111111', 'Prius', 'White', 4, '品川', 'あ', 1234, true),
  ('22222222-2222-2222-2222-222222222222', 'Hiace', 'Black', 9, '足立', 'か', 5678, true),
  ('33333333-3333-3333-3333-333333333333', 'N-BOX', 'Silver', 4, '横浜', 'さ', 9012, false)
on conflict (id) do nothing;

-- Seed staff
insert into public.staff (
  id, sfid, first_name, last_name, first_name_furigana, last_name_furigana,
  area_division, "group", status, bath_towel, equipment, joining_date,
  resignation_date, position, employment_type, job_description, mobile_email_address,
  pc_email_address, phone_number, vehicle, remarks
) values
  ('44444444-4444-4444-4444-444444444444', 1001, '太郎', '山田', 'タロウ', 'ヤマダ', '東京', 'A', true, 2, 1, '2024-01-10T09:00:00+09:00', null, 'ドライバー', '正社員', '送迎', null, null, '0312345678', '11111111-1111-1111-1111-111111111111', 'サンプル'),
  ('55555555-5555-5555-5555-555555555555', 1002, '花子', '佐藤', 'ハナコ', 'サトウ', '神奈川', 'B', true, 1, 0, '2024-02-01T09:00:00+09:00', null, 'ドライバー', 'アルバイト', '送迎', null, null, '0451234567', '22222222-2222-2222-2222-222222222222', 'サンプル'),
  ('66666666-6666-6666-6666-666666666666', 1003, '次郎', '鈴木', 'ジロウ', 'スズキ', '千葉', 'A', false, 0, 0, '2023-11-15T09:00:00+09:00', null, '配車', '契約', '事務', null, null, '0431234567', null, 'サンプル'),
  ('77777777-7777-7777-7777-777777777777', 1004, '三郎', '高橋', 'サブロウ', 'タカハシ', '埼玉', 'C', true, 1, 1, '2024-03-20T09:00:00+09:00', null, 'ドライバー', '正社員', '送迎', null, null, '0481234567', '33333333-3333-3333-3333-333333333333', 'サンプル'),
  ('88888888-8888-8888-8888-888888888888', 1005, '四郎', '伊藤', 'シロウ', 'イトウ', '東京', 'B', true, 1, 1, '2024-05-01T09:00:00+09:00', null, '配車', '正社員', '管理', null, null, '0311223344', null, 'サンプル')
on conflict (id) do nothing;

commit;




begin;

-- Set weekly work times for existing seeded staff
update public.staff
set
  mon_start = '09:00', mon_end = '18:00',
  tue_start = '09:00', tue_end = '18:00',
  wed_start = '09:00', wed_end = '18:00',
  thu_start = '09:00', thu_end = '18:00',
  fri_start = '09:00', fri_end = '18:00',
  sat_start = '10:00', sat_end = '16:00',
  sun_start = null,   sun_end = null
where id in (
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);

commit;



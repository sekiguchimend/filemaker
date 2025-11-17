-- Set timezone to JST (Japan Standard Time)
begin;

-- Set database timezone to Asia/Tokyo
-- Note: Supabase projects use 'postgres' as the database name
alter database postgres set timezone to 'Asia/Tokyo';

commit;


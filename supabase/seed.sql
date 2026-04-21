-- ============================================================
-- GreenField — Demo Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- NOTE: Replace <user_uuid_1>, <user_uuid_2> etc. with real user UUIDs
-- after signing up test accounts, OR use the demo profile IDs below.

-- Demo users (insert into profiles directly for demo)
INSERT INTO public.profiles (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'arjun@demo.com',   'Arjun Sharma',  'user'),
  ('22222222-2222-2222-2222-222222222222', 'priya@demo.com',   'Priya Rajan',   'user'),
  ('33333333-3333-3333-3333-333333333333', 'karthik@demo.com', 'Karthik Suresh', 'user'),
  ('44444444-4444-4444-4444-444444444444', 'meera@demo.com',   'Meera Nair',    'user'),
  ('55555555-5555-5555-5555-555555555555', 'admin@demo.com',   'GF Admin',      'admin')
ON CONFLICT DO NOTHING;

-- Demo bookings (past + today + future)
INSERT INTO public.bookings (user_id, turf_id, sport, date, start_time, end_time, amount, status)
VALUES
  -- Today's bookings
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cricket',  CURRENT_DATE, '07:00', '08:00', 800, 'confirmed'),
  ('22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'football', CURRENT_DATE, '09:00', '10:00', 800, 'confirmed'),
  ('33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cricket',  CURRENT_DATE, '11:00', '12:00', 800, 'confirmed'),
  ('44444444-4444-4444-4444-444444444444', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'football', CURRENT_DATE, '14:00', '15:00', 800, 'confirmed'),
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cricket',  CURRENT_DATE, '18:00', '19:00', 800, 'confirmed'),
  ('22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'football', CURRENT_DATE, '20:00', '21:00', 800, 'confirmed'),

  -- Tomorrow
  ('33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cricket',  CURRENT_DATE + 1, '08:00', '09:00', 800, 'confirmed'),
  ('44444444-4444-4444-4444-444444444444', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'football', CURRENT_DATE + 1, '16:00', '17:00', 800, 'confirmed'),
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cricket',  CURRENT_DATE + 1, '19:00', '20:00', 800, 'confirmed'),

  -- Past bookings (history)
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cricket',  CURRENT_DATE - 1, '08:00', '09:00', 800, 'confirmed'),
  ('22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'football', CURRENT_DATE - 2, '14:00', '15:00', 800, 'confirmed'),
  ('33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cricket',  CURRENT_DATE - 3, '10:00', '11:00', 800, 'confirmed'),
  ('44444444-4444-4444-4444-444444444444', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'football', CURRENT_DATE - 4, '17:00', '18:00', 800, 'cancelled'),
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cricket',  CURRENT_DATE - 5, '07:00', '08:00', 800, 'confirmed'),
  ('22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'football', CURRENT_DATE - 7, '09:00', '10:00', 800, 'confirmed')
ON CONFLICT DO NOTHING;

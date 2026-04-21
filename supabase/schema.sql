-- ============================================================
-- GreenField Sports Arena — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── TURFS ─────────────────────────────────────────────────
CREATE TABLE public.turfs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  sports      TEXT[] NOT NULL DEFAULT ARRAY['cricket', 'football'],
  price_per_hour INTEGER NOT NULL DEFAULT 800,
  images      TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── TURF SETTINGS ─────────────────────────────────────────
CREATE TABLE public.turf_settings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  turf_id               UUID REFERENCES public.turfs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  opening_time          TIME NOT NULL DEFAULT '06:00',
  closing_time          TIME NOT NULL DEFAULT '23:00',
  slot_duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (slot_duration_minutes IN (30, 60, 90, 120)),
  advance_booking_days  INTEGER NOT NULL DEFAULT 14,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── BLOCKED SLOTS ─────────────────────────────────────────
CREATE TABLE public.blocked_slots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  turf_id     UUID REFERENCES public.turfs(id) ON DELETE CASCADE NOT NULL,
  date        DATE NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (turf_id, date, start_time)
);

-- ── BOOKINGS ──────────────────────────────────────────────
CREATE TABLE public.bookings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  turf_id               UUID REFERENCES public.turfs(id) ON DELETE CASCADE NOT NULL,
  sport                 TEXT NOT NULL CHECK (sport IN ('cricket', 'football')),
  date                  DATE NOT NULL,
  start_time            TIME NOT NULL,
  end_time              TIME NOT NULL,
  amount                INTEGER NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'confirmed', 'cancelled', 'failed')),
  stripe_session_id     TEXT,
  stripe_payment_intent TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent double booking at DB level
  UNIQUE (turf_id, date, start_time, status)
    DEFERRABLE INITIALLY DEFERRED
);

-- Partial unique index: only one confirmed/pending booking per slot
CREATE UNIQUE INDEX bookings_no_double_booking
  ON public.bookings (turf_id, date, start_time)
  WHERE status IN ('pending', 'confirmed');

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turfs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turf_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings    ENABLE ROW LEVEL SECURITY;

-- Helper: is current user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT USING (public.is_admin());

-- TURFS (public read, admin write)
CREATE POLICY "Anyone can view active turfs"
  ON public.turfs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage turfs"
  ON public.turfs FOR ALL USING (public.is_admin());

-- TURF SETTINGS (public read, admin write)
CREATE POLICY "Anyone can view turf settings"
  ON public.turf_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage turf settings"
  ON public.turf_settings FOR ALL USING (public.is_admin());

-- BLOCKED SLOTS (public read, admin write)
CREATE POLICY "Anyone can view blocked slots"
  ON public.blocked_slots FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocked slots"
  ON public.blocked_slots FOR ALL USING (public.is_admin());

-- BOOKINGS
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own bookings"
  ON public.bookings FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (status = 'cancelled');
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL USING (public.is_admin());
-- Allow slot availability check (public can see booked slots for date)
CREATE POLICY "Anyone can check booked slots"
  ON public.bookings FOR SELECT USING (
    status IN ('pending', 'confirmed')
  );

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert demo turf
INSERT INTO public.turfs (id, name, description, location, sports, price_per_hour, images, is_active)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'GreenField Sports Arena',
  'Premium artificial turf facility with floodlights, changing rooms, and a café. The finest sports experience in the city.',
  'Anna Nagar, Chennai, Tamil Nadu',
  ARRAY['cricket', 'football'],
  800,
  ARRAY[
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200',
    'https://images.unsplash.com/photo-1431324155629-1a6dae1434a6?w=1200'
  ],
  true
);

-- Insert turf settings
INSERT INTO public.turf_settings (turf_id, opening_time, closing_time, slot_duration_minutes, advance_booking_days)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '06:00',
  '23:00',
  60,
  14
);

-- Block early morning and late night slots
INSERT INTO public.blocked_slots (turf_id, date, start_time, end_time, reason)
SELECT
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  CURRENT_DATE,
  '06:00', '07:00',
  'Maintenance'
UNION ALL SELECT
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  CURRENT_DATE,
  '22:00', '23:00',
  'Closing maintenance';

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Admin revenue summary view
CREATE VIEW public.revenue_summary AS
SELECT
  DATE_TRUNC('month', date) AS month,
  COUNT(*) AS total_bookings,
  SUM(amount) AS total_revenue,
  COUNT(*) FILTER (WHERE sport = 'cricket') AS cricket_bookings,
  COUNT(*) FILTER (WHERE sport = 'football') AS football_bookings
FROM public.bookings
WHERE status = 'confirmed'
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;

-- Today's schedule view
CREATE VIEW public.todays_bookings AS
SELECT
  b.*,
  p.full_name,
  p.email,
  t.name AS turf_name
FROM public.bookings b
JOIN public.profiles p ON p.id = b.user_id
JOIN public.turfs t ON t.id = b.turf_id
WHERE b.date = CURRENT_DATE
  AND b.status = 'confirmed'
ORDER BY b.start_time;

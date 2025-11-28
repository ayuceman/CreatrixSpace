-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTIONS (must be created before policies)
-- ============================================

-- Function to check if current user is admin (bypasses RLS to prevent recursion)
-- This must be created before any policies that use it
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- ============================================
-- LOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  full_address TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  images TEXT[],
  amenities TEXT[],
  features TEXT[],
  opening_hours JSONB,
  capacity JSONB,
  rating DECIMAL(3, 2),
  available BOOLEAN DEFAULT true,
  status TEXT,
  popular BOOLEAN DEFAULT false,
  contact_phone TEXT,
  contact_email TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locations (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view locations" ON public.locations;
CREATE POLICY "Anyone can view locations"
  ON public.locations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can insert locations" ON public.locations;
CREATE POLICY "Only admins can insert locations"
  ON public.locations FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update locations" ON public.locations;
CREATE POLICY "Only admins can update locations"
  ON public.locations FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete locations" ON public.locations;
CREATE POLICY "Only admins can delete locations"
  ON public.locations FOR DELETE
  USING (public.is_admin());

-- ============================================
-- LOCATION ROOMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.location_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  capacity INTEGER,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'maintenance')),
  tags TEXT[],
  amenities TEXT[],
  size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(location_id, slug)
);

-- Enable RLS on location_rooms
ALTER TABLE public.location_rooms ENABLE ROW LEVEL SECURITY;

-- Allow public read access, admin manage
DROP POLICY IF EXISTS "Anyone can view rooms" ON public.location_rooms;
CREATE POLICY "Anyone can view rooms"
  ON public.location_rooms FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can manage rooms" ON public.location_rooms;
DROP POLICY IF EXISTS "Anyone can manage rooms" ON public.location_rooms;
CREATE POLICY "Anyone can manage rooms"
  ON public.location_rooms FOR ALL
  USING (true);

-- ============================================
-- PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('day_pass', 'hot_desk', 'dedicated_desk', 'private_office', 'meeting_room')),
  description TEXT,
  features TEXT[],
  pricing JSONB NOT NULL, -- { monthly: number, annual: number, hourly?: number, daily?: number }
  stripe_product_id TEXT,
  stripe_price_ids JSONB, -- { monthly?: string, annual?: string, hourly?: string, daily?: string }
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plans (public read, admin write)
-- Allow public to view all plans (service layer will filter by active)
DROP POLICY IF EXISTS "Anyone can view plans" ON public.plans;
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.plans;
CREATE POLICY "Anyone can view plans"
  ON public.plans FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Only admins can manage plans" ON public.plans;
CREATE POLICY "Only admins can manage plans"
  ON public.plans FOR ALL
  USING (public.is_admin());

-- ============================================
-- LOCATION PLAN PRICING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.location_plan_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  pricing JSONB NOT NULL, -- { daily?: number, weekly?: number, monthly?: number, annual?: number }
  currency TEXT DEFAULT 'NPR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (location_id, plan_id)
);

-- Enable RLS on location_plan_pricing
ALTER TABLE public.location_plan_pricing ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read pricing (marketing/booking pages are public)
DROP POLICY IF EXISTS "Anyone can view location pricing" ON public.location_plan_pricing;
CREATE POLICY "Anyone can view location pricing"
  ON public.location_plan_pricing FOR SELECT
  USING (true);

-- Allow public updates (admin panel has separate auth layer)
DROP POLICY IF EXISTS "Only admins can manage location pricing" ON public.location_plan_pricing;
DROP POLICY IF EXISTS "Anyone can manage location pricing" ON public.location_plan_pricing;
CREATE POLICY "Anyone can manage location pricing"
  ON public.location_plan_pricing FOR ALL
  USING (true);

-- ============================================
-- ROOM PLAN PRICING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.room_plan_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.location_rooms(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  pricing JSONB NOT NULL,
  currency TEXT DEFAULT 'NPR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (room_id, plan_id)
);

ALTER TABLE public.room_plan_pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view room pricing" ON public.room_plan_pricing;
CREATE POLICY "Anyone can view room pricing"
  ON public.room_plan_pricing FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can manage room pricing" ON public.room_plan_pricing;
DROP POLICY IF EXISTS "Anyone can manage room pricing" ON public.room_plan_pricing;
CREATE POLICY "Anyone can manage room pricing"
  ON public.room_plan_pricing FOR ALL
  USING (true);

-- ============================================
-- MANUAL ADMIN ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.manual_admin_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('booking', 'membership')),
  data JSONB NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.manual_admin_entries
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.manual_admin_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view manual entries" ON public.manual_admin_entries;
CREATE POLICY "Anyone can view manual entries"
  ON public.manual_admin_entries FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can manage manual entries" ON public.manual_admin_entries;
CREATE POLICY "Anyone can manage manual entries"
  ON public.manual_admin_entries FOR ALL
  USING (true);

-- ============================================
-- ADD-ONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.add_ons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NPR',
  type TEXT, -- 'meeting_room_hours', 'guest_passes', 'virtual_office', 'mail_handling', etc.
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on add_ons
ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for add_ons (public read, admin write)
-- Allow public to view all add-ons (service layer will filter by active)
DROP POLICY IF EXISTS "Anyone can view add-ons" ON public.add_ons;
DROP POLICY IF EXISTS "Anyone can view active add-ons" ON public.add_ons;
CREATE POLICY "Anyone can view add-ons"
  ON public.add_ons FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Only admins can manage add-ons" ON public.add_ons;
CREATE POLICY "Only admins can manage add-ons"
  ON public.add_ons FOR ALL
  USING (public.is_admin());

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL for guest bookings
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE RESTRICT,
  room_id UUID REFERENCES public.location_rooms(id) ON DELETE SET NULL,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NPR',
  payment_method TEXT, -- 'stripe', 'esewa', 'khalti', 'qr'
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  esewa_transaction_id TEXT,
  khalti_transaction_id TEXT,
  notes TEXT,
  contact_info JSONB, -- Store contact information at time of booking
  add_ons JSONB, -- Store selected add-ons: { addOnIds: string[], meetingRoomHours: number, guestPasses: number }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Ensure new columns exist when upgrading an existing database
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES public.location_rooms(id) ON DELETE SET NULL;

-- Ensure user_id is nullable for guest bookings (in case table was created with NOT NULL)
ALTER TABLE public.bookings ALTER COLUMN user_id DROP NOT NULL;

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
CREATE POLICY "Users can create own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
CREATE POLICY "Admins can update all bookings"
  ON public.bookings FOR UPDATE
  USING (public.is_admin());

- Allow public updates & deletes (admin panel has its own login security)
DROP POLICY IF EXISTS "Public can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can delete bookings" ON public.bookings;
CREATE POLICY "Public can update bookings"
  ON public.bookings FOR UPDATE
  USING (true);

CREATE POLICY "Public can delete bookings"
  ON public.bookings FOR DELETE
  USING (true);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NPR',
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  gateway_response JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (public.is_admin());

-- ============================================
-- INDEXES for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_location_id ON public.bookings(location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_plan_id ON public.bookings(plan_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================
-- FUNCTIONS and TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_locations_updated_at ON public.locations;
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_location_rooms_updated_at ON public.location_rooms;
CREATE TRIGGER update_location_rooms_updated_at BEFORE UPDATE ON public.location_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_plans_updated_at ON public.plans;
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_add_ons_updated_at ON public.add_ons;
CREATE TRIGGER update_add_ons_updated_at BEFORE UPDATE ON public.add_ons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_manual_entries_updated_at ON public.manual_admin_entries;
CREATE TRIGGER update_manual_entries_updated_at BEFORE UPDATE ON public.manual_admin_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_location_plan_pricing_updated_at ON public.location_plan_pricing;
CREATE TRIGGER update_location_plan_pricing_updated_at BEFORE UPDATE ON public.location_plan_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_room_plan_pricing_updated_at ON public.room_plan_pricing;
CREATE TRIGGER update_room_plan_pricing_updated_at BEFORE UPDATE ON public.room_plan_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


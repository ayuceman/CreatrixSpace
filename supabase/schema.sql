-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- ============================================
-- USERS
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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());

-- ============================================
-- LOCATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_address TEXT,
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

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Only admins can insert locations" ON public.locations FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update locations" ON public.locations FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete locations" ON public.locations FOR DELETE USING (public.is_admin());

-- ============================================
-- LOCATION ROOMS
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

ALTER TABLE public.location_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rooms" ON public.location_rooms FOR SELECT USING (true);
CREATE POLICY "Only admins can manage rooms" ON public.location_rooms FOR ALL USING (public.is_admin());

-- ============================================
-- PLANS
-- ============================================
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('day_pass', 'hot_desk', 'dedicated_desk', 'private_office', 'meeting_room')),
  description TEXT,
  features TEXT[],
  pricing JSONB NOT NULL,
  stripe_product_id TEXT,
  stripe_price_ids JSONB,
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view plans" ON public.plans FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can manage plans" ON public.plans FOR ALL USING (public.is_admin());

-- ============================================
-- LOCATION PLAN PRICING
-- ============================================
CREATE TABLE IF NOT EXISTS public.location_plan_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  pricing JSONB NOT NULL,
  currency TEXT DEFAULT 'NPR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (location_id, plan_id)
);

ALTER TABLE public.location_plan_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view location pricing" ON public.location_plan_pricing FOR SELECT USING (true);
CREATE POLICY "Only admins can manage location pricing" ON public.location_plan_pricing FOR ALL USING (public.is_admin());

-- ============================================
-- ROOM PLAN PRICING
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
CREATE POLICY "Anyone can view room pricing" ON public.room_plan_pricing FOR SELECT USING (true);
CREATE POLICY "Only admins can manage room pricing" ON public.room_plan_pricing FOR ALL USING (public.is_admin());

-- ============================================
-- MANUAL ADMIN ENTRIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.manual_admin_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('booking', 'membership')),
  data JSONB NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.manual_admin_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view manual entries" ON public.manual_admin_entries FOR SELECT USING (public.is_admin());
CREATE POLICY "Only admins can manage manual entries" ON public.manual_admin_entries FOR ALL USING (public.is_admin());

-- ============================================
-- ADD-ONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.add_ons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'NPR',
  type TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view add-ons" ON public.add_ons FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can manage add-ons" ON public.add_ons FOR ALL USING (public.is_admin());

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  esewa_transaction_id TEXT,
  khalti_transaction_id TEXT,
  notes TEXT,
  contact_info JSONB,
  add_ons JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all bookings" ON public.bookings FOR UPDATE USING (public.is_admin());

-- ============================================
-- PAYMENTS
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

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (public.is_admin());

-- ============================================
-- INDEXES
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
-- TRIGGERS
-- ============================================
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- HOMEPAGE CONTENT TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  meta TEXT,
  sort_order INT DEFAULT 0,
  section TEXT DEFAULT 'about',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site stats" ON public.site_stats FOR SELECT USING (true);
CREATE POLICY "Only admins can insert site stats" ON public.site_stats FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update site stats" ON public.site_stats FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete site stats" ON public.site_stats FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_site_stats_updated_at ON public.site_stats;
CREATE TRIGGER update_site_stats_updated_at BEFORE UPDATE ON public.site_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view amenities" ON public.amenities FOR SELECT USING (true);
CREATE POLICY "Only admins can insert amenities" ON public.amenities FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update amenities" ON public.amenities FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete amenities" ON public.amenities FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_amenities_updated_at ON public.amenities;
CREATE TRIGGER update_amenities_updated_at BEFORE UPDATE ON public.amenities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_initials TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Only admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update testimonials" ON public.testimonials FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete testimonials" ON public.testimonials FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Only admins can insert faqs" ON public.faqs FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update faqs" ON public.faqs FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete faqs" ON public.faqs FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.member_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  italic BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.member_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view member companies" ON public.member_companies FOR SELECT USING (true);
CREATE POLICY "Only admins can insert member companies" ON public.member_companies FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update member companies" ON public.member_companies FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete member companies" ON public.member_companies FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_member_companies_updated_at ON public.member_companies;
CREATE TRIGGER update_member_companies_updated_at BEFORE UPDATE ON public.member_companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  pricing JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view hero content" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Only admins can insert hero content" ON public.hero_content FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update hero content" ON public.hero_content FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete hero content" ON public.hero_content FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_hero_content_updated_at ON public.hero_content;
CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON public.hero_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.membership_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tabs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.membership_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view membership content" ON public.membership_content FOR SELECT USING (true);
CREATE POLICY "Only admins can insert membership content" ON public.membership_content FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update membership content" ON public.membership_content FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete membership content" ON public.membership_content FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_membership_content_updated_at ON public.membership_content;
CREATE TRIGGER update_membership_content_updated_at BEFORE UPDATE ON public.membership_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.spaces_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.spaces_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view spaces content" ON public.spaces_content FOR SELECT USING (true);
CREATE POLICY "Only admins can insert spaces content" ON public.spaces_content FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update spaces content" ON public.spaces_content FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete spaces content" ON public.spaces_content FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_spaces_content_updated_at ON public.spaces_content;
CREATE TRIGGER update_spaces_content_updated_at BEFORE UPDATE ON public.spaces_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.book_tour_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step1_headline TEXT NOT NULL DEFAULT 'Come by, have a coffee, <em class="text-clay">look around</em>.',
  step1_description TEXT NOT NULL DEFAULT 'A tour takes about twenty minutes. You''ll meet whoever''s running the floor that day; the coffee is on us.',
  step2_headline TEXT NOT NULL DEFAULT 'A couple of <em class="text-clay">details</em>.',
  confirmation_eyebrow TEXT NOT NULL DEFAULT 'Confirmed',
  confirmation_tour_details TEXT NOT NULL DEFAULT 'The full floor, the meeting rooms, the phone booths, the terrace. We''ll show you the desk we''d put you at, what the wifi feels like, and where the coffee comes from.',
  time_slots JSONB NOT NULL DEFAULT '["11:00", "12:00", "14:00", "15:00", "16:00"]'::jsonb,
  interest_options JSONB NOT NULL DEFAULT '[{"value":"day","label":"Day Pass — NPR 800 / day"},{"value":"week","label":"Week Pass — NPR 3,000 / week"},{"value":"resident","label":"Dedicated Desk — NPR 8,000 / month"},{"value":"studio-2","label":"Studio for two — NPR 24,000 / month"},{"value":"studio-4","label":"Studio for four — NPR 46,000 / month"},{"value":"studio-8","label":"Studio for six to eight — NPR From 78,000 / month"},{"value":"virtual","label":"Virtual Office — NPR 6,000 / month"},{"value":"just-looking","label":"Just looking, thanks"}]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.book_tour_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view book tour content" ON public.book_tour_content FOR SELECT USING (true);
CREATE POLICY "Only admins can insert book tour content" ON public.book_tour_content FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update book tour content" ON public.book_tour_content FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete book tour content" ON public.book_tour_content FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_book_tour_content_updated_at ON public.book_tour_content;
CREATE TRIGGER update_book_tour_content_updated_at BEFORE UPDATE ON public.book_tour_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CTA CONTENT
-- ============================================
CREATE TABLE IF NOT EXISTS public.cta_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eyebrow TEXT NOT NULL DEFAULT 'Your desk is waiting',
  headline_1 TEXT NOT NULL DEFAULT 'Come by ',
  headline_em TEXT NOT NULL DEFAULT 'tomorrow',
  headline_2 TEXT NOT NULL DEFAULT '. Stay  as long  as you like.',
  description TEXT NOT NULL DEFAULT 'Leave a name and an email. We''ll hold a desk at the room of your choice and follow up with directions.',
  rooms JSONB NOT NULL DEFAULT '[{"name":"Dhobighat","location":"Kathmandu"},{"name":"Kausimaa","location":"Kupondole"},{"name":"Jhamsikhel","location":"Lalitpur"}]'::jsonb,
  features JSONB NOT NULL DEFAULT '["No deposit","No joining fee","Cancel any time"]'::jsonb,
  form_name_label TEXT NOT NULL DEFAULT 'Your name',
  form_email_label TEXT NOT NULL DEFAULT 'Email',
  form_room_label TEXT NOT NULL DEFAULT 'Which room',
  form_button_text TEXT NOT NULL DEFAULT 'Hold my desk',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cta_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view cta content" ON public.cta_content FOR SELECT USING (true);
CREATE POLICY "Only admins can insert cta content" ON public.cta_content FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update cta content" ON public.cta_content FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete cta content" ON public.cta_content FOR DELETE USING (public.is_admin());
DROP TRIGGER IF EXISTS update_cta_content_updated_at ON public.cta_content;
CREATE TRIGGER update_cta_content_updated_at BEFORE UPDATE ON public.cta_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FORM SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  room TEXT,
  selected_date TEXT,
  time_slot TEXT,
  interest TEXT,
  notes TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert form submissions" ON public.form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view form submissions" ON public.form_submissions FOR SELECT USING (public.is_admin());
CREATE POLICY "Only admins can delete form submissions" ON public.form_submissions FOR DELETE USING (public.is_admin());

-- ============================================
-- STORAGE
-- ============================================
INSERT INTO storage.buckets (id, name, public)
  VALUES ('images', 'images', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND (auth.role() = 'service_role' OR public.is_admin()));
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
CREATE POLICY "Admins can update images" ON storage.objects FOR UPDATE
  USING (bucket_id = 'images' AND public.is_admin());
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE
  USING (bucket_id = 'images' AND public.is_admin());

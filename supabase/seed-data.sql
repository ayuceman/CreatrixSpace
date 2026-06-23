-- ============================================
-- SEED DATA FOR CREATRIXSPACE BOOKING SYSTEM
-- ============================================
-- This file contains initial data for locations, plans, and add-ons
-- Run this after running schema.sql to populate your database
--
-- IMPORTANT: This script requires admin privileges or service role access
-- If you get permission errors, you can either:
-- 1. Run this in Supabase SQL Editor (which has elevated privileges)
-- 2. Temporarily disable RLS: ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;
--    (then re-enable after: ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;)
-- 3. Ensure your user is marked as admin in the profiles table

-- ============================================
-- LOCATIONS
-- ============================================
-- Using deterministic UUIDs based on slugs for consistency
-- You can change these UUIDs if needed

INSERT INTO public.locations (id, name, slug, description, full_address, available, popular, amenities, features, capacity, rating) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Dhobighat (WashingTown) Hub',
  'dhobighat-hub',
  'A modern coworking space in the heart of Lalitpur, perfect for professionals and entrepreneurs.',
  'Dhobighat, Jhamsikhel, Lalitpur, Nepal (Near Thado Dhunga)',
  true,
  true,
  ARRAY['Fast Wi-Fi', '24/7 Access', 'Coffee & Tea', 'Meeting Rooms', 'Parking', 'Kitchen', 'Cleaning Service', 'Reception', 'Lockers', 'Phone Booths'],
  ARRAY['High-speed internet', 'Air conditioning', 'Natural lighting', 'Ergonomic furniture'],
  '{"hotDesks": 20, "dedicatedDesks": 10, "privateOffices": 5, "meetingRooms": 3}'::jsonb,
  4.8
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'Kausimaa Co-working',
  'kausimaa-coworking',
  'A vibrant coworking space in Jwagal/Kupondole, designed for creative professionals and startups.',
  'Jwagal/Kupondole, Lalitpur, Nepal',
  true,
  false,
  ARRAY['Fast Wi-Fi', '24/7 Access', 'Coffee & Tea', 'Meeting Rooms', 'Event Space', 'Parking', 'Kitchen', 'Cleaning Service'],
  ARRAY['High-speed internet', 'Air conditioning', 'Natural lighting', 'Creative spaces'],
  '{"hotDesks": 15, "dedicatedDesks": 8, "privateOffices": 3, "meetingRooms": 2}'::jsonb,
  4.6
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'Jhamsikhel Loft',
  'jhamsikhel-loft',
  'A premium coworking space in Jhamsikhel, currently reserved for long-term members.',
  'Jhamsikhel, Lalitpur, Nepal',
  false,
  false,
  ARRAY['Fast Wi-Fi', '24/7 Access', 'Coffee & Tea', 'Meeting Rooms', 'Parking', 'Kitchen'],
  ARRAY['High-speed internet', 'Air conditioning', 'Premium amenities'],
  '{"hotDesks": 12, "dedicatedDesks": 6, "privateOffices": 4, "meetingRooms": 2}'::jsonb,
  4.9
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  available = EXCLUDED.available,
  popular = EXCLUDED.popular;

-- ============================================
-- LOCATION ROOMS
-- ============================================
INSERT INTO public.location_rooms (id, location_id, name, slug, description, image_url, capacity, status, tags, amenities, size) VALUES
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Sun',
  'sun-room',
  'Corner suite drenched in natural light, ideal for creative sprints or executive calls.',
  '/images/hero-slider/dhobighat-workspace-view-1.jpg',
  6,
  'booked',
  ARRAY['Full-height windows', 'Acoustic treatment', 'Smart lighting'],
  ARRAY['Dual 4K displays', 'Standing desk option', 'Wall-mounted whiteboard'],
  '320 sq.ft'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Saturn',
  'saturn-suite',
  'Boardroom-style space tailored for hybrid teams and investor updates.',
  '/images/hero-slider/dhobighat-office-back.png',
  10,
  'available',
  ARRAY['Integrated conferencing', 'Acoustic ceiling', 'Ambient LED'],
  ARRAY['Glass board', 'Dedicated concierge line', 'Private pantry access'],
  '410 sq.ft'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Earth',
  'earth-lab',
  'Biophilic pod with adaptable seating for teams that ideate fast.',
  '/images/hero-slider/dhobighat-coworking-space.png',
  8,
  'available',
  ARRAY['Modular seating', 'Living wall', 'Skylight'],
  ARRAY['Focus pods', 'Team huddle system', 'Dedicated storage wall'],
  '360 sq.ft'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Jupiter',
  'jupiter-hall',
  'Spacious collaborative space designed for large teams and dynamic workshops.',
  '/images/hero-slider/dhobighat-workspace-view-1.jpg',
  12,
  'available',
  ARRAY['High ceilings', 'Flexible layout', 'Premium acoustics'],
  ARRAY['Large projection screen', 'Movable furniture', 'Breakout areas'],
  '500 sq.ft'
)
ON CONFLICT (location_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  capacity = EXCLUDED.capacity,
  status = EXCLUDED.status,
  tags = EXCLUDED.tags,
  amenities = EXCLUDED.amenities,
  size = EXCLUDED.size,
  updated_at = NOW();

-- ============================================
-- PLANS
-- ============================================
-- Using deterministic UUIDs for consistency

INSERT INTO public.plans (id, name, type, description, features, pricing, popular, active) VALUES
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Explorer',
  'day_pass',
  'Perfect for trying out our space. Ideal for freelancers and remote workers who need occasional workspace access.',
  ARRAY['Access to hot desks', 'Wi-Fi included', 'Coffee & Tea', 'Common areas', 'Business hours access (6 AM - 10 PM)'],
  '{"daily": 50000}'::jsonb,
  true,
  true
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'Professional',
  'hot_desk',
  'Flexible workspace solution for professionals who value flexibility and community.',
  ARRAY['Access to hot desks', '24/7 access', 'Wi-Fi included', 'Coffee & Tea', 'Common areas', 'Meeting room access (limited)', 'Printing & Scanning', 'Lockers'],
  '{"weekly": 199900, "monthly": 899900, "annual": 6000000}'::jsonb,
  true,
  true
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'Enterprise',
  'dedicated_desk',
  'Your personal workspace with all the amenities you need for focused productivity.',
  ARRAY['Dedicated desk', '24/7 access', 'Wi-Fi included', 'Coffee & Tea', 'Common areas', 'Meeting room access (10 hours/month)', 'Printing & Scanning', 'Lockers', 'Phone booths', 'Mail handling'],
  '{"weekly": 299900, "monthly": 1099900, "annual": 10800000}'::jsonb,
  false,
  true
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'Private Office',
  'private_office',
  'Ultimate privacy and productivity in your own private office space.',
  ARRAY['Private office', '24/7 access', 'Wi-Fi included', 'Coffee & Tea', 'Common areas', 'Unlimited meeting room access', 'Printing & Scanning', 'Lockers', 'Phone booths', 'Mail handling', 'Reception services', 'Customizable space'],
  '{"monthly": 3500000, "annual": 37800000}'::jsonb,
  false,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pricing = EXCLUDED.pricing,
  popular = EXCLUDED.popular,
  active = EXCLUDED.active;

-- ============================================
-- LOCATION PLAN PRICING
-- ============================================
INSERT INTO public.location_plan_pricing (location_id, plan_id, pricing, currency) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '{"daily": 50000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  '{"weekly": 199900, "monthly": 899900, "annual": 6000000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  '{"weekly": 299900, "monthly": 1099900, "annual": 10800000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '{"weekly": 680000, "monthly": 2500000, "annual": 30000000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '{"daily": 40000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  '{"weekly": 200000, "monthly": 800000, "annual": 5000000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  '{"weekly": 260000, "monthly": 950000, "annual": 9000000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '{"weekly": 500000, "monthly": 1800000, "annual": 17500000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '{"daily": 50000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  '{"weekly": 220000, "monthly": 950000, "annual": 6000000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  '{"weekly": 320000, "monthly": 1150000, "annual": 10800000}'::jsonb,
  'NPR'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '{"weekly": 680000, "monthly": 2500000, "annual": 30000000}'::jsonb,
  'NPR'
)
ON CONFLICT (location_id, plan_id) DO UPDATE SET
  pricing = EXCLUDED.pricing,
  currency = EXCLUDED.currency,
  updated_at = NOW();

-- ============================================
-- ROOM PLAN PRICING
-- ============================================
INSERT INTO public.room_plan_pricing (room_id, plan_id, pricing, currency) VALUES
-- Sun Room
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '{"daily": 65000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  '{"weekly": 250000, "monthly": 1050000, "annual": 6800000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  '{"weekly": 360000, "monthly": 1220000, "annual": 11200000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '{"weekly": 720000, "monthly": 2700000, "annual": 32500000}'::jsonb,
  'NPR'
),
-- Saturn Suite
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '{"daily": 55000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  '{"weekly": 230000, "monthly": 980000, "annual": 6400000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  '{"weekly": 340000, "monthly": 1180000, "annual": 11000000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '{"weekly": 700000, "monthly": 2550000, "annual": 31000000}'::jsonb,
  'NPR'
),
-- Earth Lab
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '{"daily": 52000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  '{"weekly": 210000, "monthly": 920000, "annual": 6100000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  '{"weekly": 300000, "monthly": 1100000, "annual": 10500000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '{"weekly": 650000, "monthly": 2400000, "annual": 29500000}'::jsonb,
  'NPR'
),
-- Jupiter Hall
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '{"daily": 75000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  '{"weekly": 280000, "monthly": 1200000, "annual": 7500000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  '{"weekly": 400000, "monthly": 1350000, "annual": 12500000}'::jsonb,
  'NPR'
),
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '{"weekly": 800000, "monthly": 3000000, "annual": 35000000}'::jsonb,
  'NPR'
)
ON CONFLICT (room_id, plan_id) DO UPDATE SET
  pricing = EXCLUDED.pricing,
  currency = EXCLUDED.currency,
  updated_at = NOW();

-- ============================================
-- ADD-ONS
-- ============================================
-- Using deterministic UUIDs for consistency

INSERT INTO public.add_ons (id, name, description, price, currency, type, active) VALUES
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Extra Meeting Room Hours',
  'Additional meeting room access beyond your plan allocation. Perfect for client meetings, team collaborations, and presentations.',
  50000,
  'NPR',
  'meeting_room_hours',
  true
),
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'Guest Day Passes',
  'Bring colleagues, clients, or partners for a day. Includes full access to workspace amenities.',
  50000,
  'NPR',
  'guest_passes',
  true
),
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'Virtual Office Address',
  'Use our professional address for your business registration and correspondence. Includes mail receiving service.',
  600000,
  'NPR',
  'virtual_office',
  true
),
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'Mail Handling Service',
  'Professional mail receiving and forwarding service. We''ll receive your mail and notify you when packages arrive.',
  200000,
  'NPR',
  'mail_handling',
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  active = EXCLUDED.active;

-- ============================================
-- AMENITIES
-- ============================================
INSERT INTO public.amenities (title, description, icon, sort_order) VALUES
('24/7 access', 'Key fob for residents and private-office members. The building never sleeps.', 'clock', 1),
('1G symmetric fibre', 'Backed up by a second line and a UPS that keeps the network alive through dinner.', 'wifi', 2),
('Meeting rooms', '7 rooms across 3 buildings — bookable by the hour, with displays, whiteboards, and good chairs.', 'presentation', 3),
('Event spaces', '6 to 60 seats — set-up, tear-down, and a host included. Saturdays and Sundays.', 'calendar', 4),
('Rooftop & terrace', '2 of 3 buildings have one. A place to take calls, eat lunch, or watch the rain.', 'sun', 5),
('Cafes on site', 'Both buildings have a café on the ground floor. Members get a discount at both.', 'coffee', 6),
('Phone booths', 'Quiet, well-lit, and always available. Take that call without the echo.', 'phone', 7),
('Mail & registered address', 'Use any of our buildings as your registered business address. Mail scanned and forwarded.', 'mail', 8)
ON CONFLICT DO NOTHING;

INSERT INTO public.amenities_content (eyebrow, headline_1, headline_em, headline_2, description)
VALUES (
  'What''s in the room',
  'The things you''d',
  'expect',
  ', kept well.',
  'We don''t have a foosball table. We do have a phone booth where you can hear the other person, a kettle that has been on every weekday since 2022, and an electrician on speed-dial. The list below is what every room shares — the locations page has the rest.'
) ON CONFLICT DO NOTHING;

-- ============================================
-- TESTIMONIALS
-- ============================================
INSERT INTO public.testimonials (quote, author_name, author_role, author_initials, sort_order) VALUES
('I''ve been at Jhamsikhel for a year and a half. It''s quiet enough to translate, and there''s always someone to have lunch with.', 'Sunaina Pradhan', 'Translator · Jhamsikhel resident', 'SP', 1),
('We moved into a private office when we were three people. We''re nine now and we still fit — barely.', 'Anjan Karki', 'Founder, Loomstack', 'AK', 2),
('I come for a week every three months. Same desk, same coffee, no paperwork. It just works.', 'Mira Joshi', 'Visiting fellow · Dhobighat', 'MJ', 3),
('The Kausimaa terrace is where I take all my client calls. The wifi reaches, the plants are real, and the coffee is good.', 'Aakriti Sharma', 'Designer · Kausimaa', 'AS', 4),
('A registered address at Dhobighat costs less than a virtual office anywhere else. Mail arrives same-day within the valley.', 'Robin Maharjan', 'Virtual office · 2 yrs', 'RM', 5),
('I buy day passes when I need to edit without distractions. No small talk, just good light and strong wifi.', 'Priya Tamang', 'Filmmaker · Day pass regular', 'PT', 6)
ON CONFLICT DO NOTHING;

-- ============================================
-- FAQS
-- ============================================
INSERT INTO public.faqs (question, answer, sort_order) VALUES
('Can I walk in tomorrow and start working?', 'Yes. Day passes are first-come, first-served — no booking needed. Just show up, pick a desk, and connect to the wifi. If you want a dedicated desk or a private office, get in touch and we''ll have you set up within 48 hours.', 1),
('What''s the difference between a hot desk and a dedicated desk?', 'A hot desk is first-come, first-served — you sit where there''s space. A dedicated desk is yours: same spot every day, lockable storage, mail handled. Dedicated desks also include 8 hours of meeting-room time per month and priority event access.', 2),
('Can I bring a guest?', 'Yes. Day-pass holders can bring one guest free on their first visit. Members can bring guests for NPR 500/day. Guest passes are available at the front desk.', 3),
('Is there parking?', 'Parking is available on a first-come, first-served basis at all three buildings. Jhamsikhel has dedicated member parking at the back. Two-wheelers and bicycles can be parked inside the premises.', 4),
('What''s the cancellation policy?', 'No deposit, no joining fee, cancel any time. Dedicated desks and private offices require a 30-day notice. Day passes and week passes are pay-as-you-go, no strings attached.', 5),
('Do you offer virtual offices?', 'Yes. A Kathmandu business address at Dhobighat Hub with mail handling for NPR 6,000/month. Includes 4 hours of meeting room time and 2 day-passes per month. Used by founders who need a registered address without a physical desk.', 6)
ON CONFLICT DO NOTHING;

-- ============================================
-- MEMBER COMPANIES
-- ============================================
INSERT INTO public.member_companies (name, sort_order) VALUES
('Loomstack', 1),
('Brut', 2),
('Echo', 3),
('Koji', 4),
('Tangle', 5),
('Fleet', 6),
('Holloway', 7),
('Brace', 8)
ON CONFLICT DO NOTHING;

-- ============================================
-- SITE STATS
-- ============================================
INSERT INTO public.site_stats (label, value, suffix, sort_order, meta) VALUES
('Private offices', '6', '+', 1, '{"description": "Across three buildings"}'),
('Hot desks', '25', '', 2, '{"description": "Open-plan seating across locations"}'),
('Members', '150', '+', 3, '{"description": "Active members across all plans"}'),
('Years running', '4', '+', 4, '{"description": "Since we opened in 2022"}')
ON CONFLICT DO NOTHING;

-- ============================================
-- MEMBERSHIP CONTENT
-- ============================================
INSERT INTO public.membership_content (headline, description, tabs, footer_tags)
VALUES (
  'Pick a room. <em class="text-clay">Show up tomorrow.</em>',
  'Four ways to work with us — day passes, dedicated desks, lockable private offices, and a virtual office for founders who want a Kathmandu address. No deposit, no joining fee, cancel any time.',
  '[
    {
      "id": "open-desks",
      "label": "Open desks",
      "subtitle": "DAY PASS · NPR 800 / DAY",
      "mode": "grid",
      "cards": [
        {
          "id": "day-pass",
          "eyebrow": "Hot desk",
          "name": "Day Pass",
          "price": "800",
          "period": "/ day",
          "description": "One open-room desk for the day. Show up between 8 and 8. Bring a friend the first time at no charge.",
          "features": ["Any open desk · any room", "Coffee, tea, fast wifi", "No commitment, no deposit"],
          "cta": "Start day pass"
        },
        {
          "id": "week-pass",
          "eyebrow": "Hot desk",
          "name": "Week Pass",
          "price": "3,000",
          "period": "/ week",
          "description": "Seven consecutive days in the open room. Useful for visiting consultants and short residencies.",
          "features": ["Any open desk · any room", "Two hours of meeting room", "Guest access × 1"],
          "cta": "Start week pass"
        },
        {
          "id": "dedicated-desk",
          "eyebrow": "Reserved desk",
          "name": "Dedicated Desk",
          "price": "8,000",
          "period": "/ month",
          "description": "Your own reserved desk in the open room of your choice. 24/7 access, mail handling, a key fob.",
          "features": ["Reserved desk · 24/7 access", "Mail at your business address", "Eight hours of meeting room", "Two event passes per month"],
          "badge": "Most picked",
          "cta": "Start dedicated desk"
        }
      ]
    },
    {
      "id": "private-offices",
      "label": "Private offices",
      "subtitle": "STUDIO FOR TWO · NPR 24,000 / MO",
      "mode": "grid",
      "cards": [
        {
          "id": "studio-2",
          "eyebrow": "Lockable room",
          "name": "Studio for two",
          "price": "24,000",
          "period": "/ month",
          "description": "A lockable room for a pair. A door that closes, a window that opens, two reserved desks.",
          "features": ["Two desks · lockable door", "24/7 access · key card", "16 hrs meeting room / mo", "Mail at your address"],
          "availability": true,
          "cta": "Book a viewing"
        },
        {
          "id": "studio-4",
          "eyebrow": "Lockable room",
          "name": "Studio for four",
          "price": "46,000",
          "period": "/ month",
          "description": "For a small team that has outgrown a corner. Four desks, a whiteboard, and the same coffee.",
          "features": ["Four desks · lockable door", "24/7 access · key cards", "24 hrs meeting room / mo", "Phone-booth credits"],
          "badge": "Most picked",
          "availability": true,
          "cta": "Book a viewing"
        },
        {
          "id": "studio-68",
          "eyebrow": "Lockable room",
          "name": "Studio for six to eight",
          "price": "78,000",
          "prefix": "From",
          "period": "/ month",
          "description": "A larger room with its own meeting corner. Suits a team of six to eight that needs door, branding, and privacy.",
          "features": ["Six to eight desks", "In-room meeting corner", "Custom signage on the door", "Dedicated host on the floor"],
          "availability": true,
          "cta": "Book a viewing"
        }
      ]
    },
    {
      "id": "virtual-office",
      "label": "Virtual office",
      "subtitle": "ADDRESS & MAIL · NPR 6,000 / MO",
      "mode": "single",
      "single": {
        "eyebrow": "Address & mail",
        "name": "Virtual Office",
        "price": "6,000",
        "period": "/ month",
        "description": "A real Kathmandu business address at Dhobighat Hub. We sign for your mail, scan it, and forward what matters. Use it for company registration, banking, courier, and Google Business.",
        "badge": "MOST-REQUESTED SETUP FOR REMOTE FOUNDERS AND VISITING TEAMS.",
        "subtitle": "ADDRESS & MAIL · NPR 6,000 / MO",
        "features": [
          "Registered business address",
          "Mail received, sorted, and scanned",
          "Forwarding on request",
          "Four hours of meeting room / month",
          "Two day-passes / month to visit"
        ]
      }
    }
  ]'::jsonb,
  ARRAY['NO DEPOSIT', 'CANCEL ANY TIME', 'PRICES INCLUDE 13% VAT', 'FIRST DAY ON US FOR DAY PASSES']
) ON CONFLICT DO NOTHING;

-- ============================================
-- SPACES CONTENT
-- ============================================
INSERT INTO public.spaces_content (eyebrow, headline_1, headline_em, headline_2, description, cards, cta_bar_eyebrow, cta_bar_text, cta_bar_whatsapp)
VALUES (
  'Also at CreatrixSpace',
  'Rooms for ',
  'weekends',
  ' and cohorts.',
  'On Saturdays and Sundays the event rooms open up for launches, readings, and workshops. On weekday afternoons and evenings, a dedicated training room runs cohorts — robotics for kids, coding bootcamps, design schools.',
  '[
    {
      "id": "event-space",
      "badge": "Weekends",
      "imageSrc": "/images/hero-slider/creatrixspace-coworking-area-1.webp",
      "imageAlt": "Event space at CreatrixSpace",
      "title": "Event space",
      "description": "Sixty-seat event room at Dhobighat, a forty-seat rooftop at Jhamsikhel, and a twenty-four-seat terrace at Kausimaa. Hire by the half-day or full day on weekends — we handle setup, teardown, and AV.",
      "stats": [
        { "value": "6 → 60", "label": "Seats per room" },
        { "value": "4 / 8 hr", "label": "Half or full day" },
        { "value": "Sat–Sun", "label": "Weekend hire" }
      ],
      "tags": [
        "Product launches",
        "Photo shoots",
        "Book readings",
        "Workshops",
        "Investor demo days",
        "Member dinners"
      ],
      "waMsg": "Hello CreatrixSpace — I''d like to enquire about hiring the event space for a weekend. Date: __ . Seats: __ .",
      "cta": "Enquire for an event"
    },
    {
      "id": "training-classes",
      "badge": "Weekdays · evenings",
      "imageSrc": "/images/hero-slider/creatrixspace-modern-workspace-1.webp",
      "imageAlt": "Training & classes at CreatrixSpace",
      "title": "Training & classes",
      "description": "A dedicated room for cohort programmes — robotics for kids, STEM labs, design bootcamps, language schools. Whiteboards, projector, fast wifi, and a setup that can be reconfigured between sessions.",
      "stats": [
        { "value": "20 → 28", "label": "Learners per room" },
        { "value": "2 / 3 / 6 mo", "label": "Programme blocks" },
        { "value": "Mon–Fri", "label": "After-school & evening" }
      ],
      "tags": [
        "Robotics & STEM (kids)",
        "Coding bootcamps",
        "Design & UX classes",
        "Language schools",
        "Music & arts cohorts",
        "Corporate training"
      ],
      "waMsg": "Hello CreatrixSpace — I''m interested in running a training programme. Type: __ . Cohort size: __ . Start date: __ .",
      "cta": "Talk to us about a cohort"
    }
  ]'::jsonb,
  'For trainers, institutes, and event organisers',
  'We work on flexible blocks — single weekends, three-month robotics terms, six-month cohorts. Equipment, AV, and a host on the floor are included. Pricing depends on room and length.',
  'WhatsApp the spaces team'
) ON CONFLICT DO NOTHING;

-- ============================================
-- BOOK TOUR CONTENT
-- ============================================
INSERT INTO public.book_tour_content (id, step1_headline, step1_description, step2_headline, confirmation_eyebrow, confirmation_tour_details, time_slots, interest_options) VALUES
(
  'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Come by, have a coffee, <em class="text-clay">look around</em>.',
  'A tour takes about twenty minutes. You''ll meet whoever''s running the floor that day; the coffee is on us.',
  'A couple of <em class="text-clay">details</em>.',
  'Confirmed',
  'The full floor, the meeting rooms, the phone booths, the terrace. We''ll show you the desk we''d put you at, what the wifi feels like, and where the coffee comes from.',
  '["11:00", "12:00", "14:00", "15:00", "16:00"]'::jsonb,
  '[{"value":"day","label":"Day Pass — NPR 800 / day"},{"value":"week","label":"Week Pass — NPR 3,000 / week"},{"value":"resident","label":"Dedicated Desk — NPR 8,000 / month"},{"value":"studio-2","label":"Studio for two — NPR 24,000 / month"},{"value":"studio-4","label":"Studio for four — NPR 46,000 / month"},{"value":"studio-8","label":"Studio for six to eight — NPR From 78,000 / month"},{"value":"virtual","label":"Virtual Office — NPR 6,000 / month"},{"value":"just-looking","label":"Just looking, thanks"}]'::jsonb
) ON CONFLICT DO NOTHING;

-- ============================================
-- CTA CONTENT
-- ============================================
INSERT INTO public.cta_content (id, eyebrow, headline_1, headline_em, headline_2, description, rooms, features, form_name_label, form_email_label, form_room_label, form_button_text) VALUES
(
  'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Your desk is waiting',
  'Come by ',
  'tomorrow',
  '. Stay  as long  as you like.',
  'Leave a name and an email. We''ll hold a desk at the room of your choice and follow up with directions. Nothing else gets sent to your inbox.',
  '[{"name":"Dhobighat","location":"Kathmandu"},{"name":"Kausimaa","location":"Kupondole"},{"name":"Jhamsikhel","location":"Lalitpur"}]'::jsonb,
  '["No deposit","No joining fee","Cancel any time"]'::jsonb,
  'Your name',
  'Email',
  'Which room',
  'Hold my desk'
) ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES
-- ============================================
-- After running this seed file:
-- 1. Check that all locations, plans, and add-ons were inserted
-- 2. Verify the data in Supabase Table Editor
-- 3. The IDs will be auto-generated UUIDs
-- 4. You can update the data through Supabase dashboard or SQL


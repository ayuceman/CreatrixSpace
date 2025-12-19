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

INSERT INTO public.locations (id, name, slug, description, address, full_address, city, available, popular, amenities, features, capacity, rating) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Dhobighat (WashingTown) Hub',
  'dhobighat-hub',
  'A modern coworking space in the heart of Kathmandu, perfect for professionals and entrepreneurs.',
  'Dhobighat, Kathmandu',
  'Dhobighat, Kathmandu, Nepal',
  'Kathmandu',
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
  'Jwagal/Kupondole, Lalitpur',
  'Jwagal/Kupondole, Lalitpur, Nepal',
  'Lalitpur',
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
  'Jhamsikhel, Lalitpur',
  'Jhamsikhel, Lalitpur, Nepal',
  'Lalitpur',
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
  address = EXCLUDED.address,
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
  300000,
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
-- NOTES
-- ============================================
-- After running this seed file:
-- 1. Check that all locations, plans, and add-ons were inserted
-- 2. Verify the data in Supabase Table Editor
-- 3. The IDs will be auto-generated UUIDs
-- 4. You can update the data through Supabase dashboard or SQL


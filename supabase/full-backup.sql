-- ============================================
-- FULL DATABASE BACKUP — CREATRIXSPACE
-- Generated: 2026-06-24
-- All inserts use ON CONFLICT for idempotency
-- ============================================

-- ============================================
-- LOCATIONS (2 records)
-- ============================================
INSERT INTO public.locations (id, name, slug, description, full_address, image_url, amenities, features, opening_hours, capacity, rating, available, status, popular, contact_phone, contact_email, google_maps_url, created_at, updated_at) VALUES
(
  '2a3f5247-559b-47c7-90b8-b35c8d25ec6e'::uuid,
  'Dhobighat Hub',
  'dhobighat-hub',
  'South-facing windows over Dhobighat. Coffee from the café downstairs. Quiet by ten, full by eleven.',
  'Dhobighat, Jhamsikhel, Lalitpur',
  'https://pcnwkdspkpqqchhsmdgq.supabase.co/storage/v1/object/public/images/locations/2a3f5247-559b-47c7-90b8-b35c8d25ec6e/1782188813653-yq45l2krnxh.jpeg',
  ARRAY['Coffee Bar','Printing Services','Phone Booths','Lounge Areas']::text[],
  ARRAY['24/7 Access','Meeting Rooms','Event Space','High-Speed WiFi','Parking']::text[],
  '{"monday":{"open":"10:05","close":"22:06"}}'::jsonb,
  '{"hotDesks":42,"eventSeats":60,"meetingRooms":3,"dedicatedDesks":0,"privateOffices":2}'::jsonb,
  4.00,
  true,
  'Flagship — Open today',
  false,
  '9700045256',
  NULL,
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3533.3293127259203!2d85.30731!3d27.676215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDQwJzM0LjQiTiA4NcKwMTgnMjYuMyJF!5e0!3m2!1sen!2snp!4v1782129522398!5m2!1sen!2snp',
  '2026-06-22T10:55:33.495061+00:00'::timestamptz,
  '2026-06-23T04:26:53.68842+00:00'::timestamptz
),
(
  'bec3518c-dd00-48a7-9e99-355fab3608ac'::uuid,
  'Jhamsikhel Loft',
  'jhamsikhel-loft',
  'Brick walls and a rooftop with a view of Patan. The café downstairs opens at seven and shuts at eleven.',
  'Jhamsikhel',
  'https://pcnwkdspkpqqchhsmdgq.supabase.co/storage/v1/object/public/images/locations/bec3518c-dd00-48a7-9e99-355fab3608ac/1782188836812-7uj305n7v2h.jpg',
  ARRAY[]::text[],
  ARRAY[]::text[],
  '{}'::jsonb,
  '{"hotDesks":40,"eventSeats":40,"meetingRooms":2,"dedicatedDesks":0,"privateOffices":1}'::jsonb,
  0.00,
  true,
  'Open today — 1 private office left',
  false,
  '',
  NULL,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7066.085503853871!2d85.29797354150729!3d27.68507350535466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb184628029137%3A0x1dae687495f17539!2sJhamsikhel%2C%20Lalitpur%2044600!5e0!3m2!1sen!2snp!4v1782129547261!5m2!1sen!2snp',
  '2026-06-22T11:58:16.673845+00:00'::timestamptz,
  '2026-06-23T04:27:17.066362+00:00'::timestamptz
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  full_address = EXCLUDED.full_address,
  image_url = EXCLUDED.image_url,
  amenities = EXCLUDED.amenities,
  features = EXCLUDED.features,
  opening_hours = EXCLUDED.opening_hours,
  capacity = EXCLUDED.capacity,
  rating = EXCLUDED.rating,
  available = EXCLUDED.available,
  status = EXCLUDED.status,
  popular = EXCLUDED.popular,
  contact_phone = EXCLUDED.contact_phone,
  contact_email = EXCLUDED.contact_email,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

-- ============================================
-- PLANS (4 records)
-- ============================================
INSERT INTO public.plans (id, name, type, description, features, pricing, popular, active) VALUES
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Explorer',
  'day_pass',
  'Perfect for trying out our space. Ideal for freelancers and remote workers who need occasional workspace access.',
  ARRAY['Access to hot desks', 'Wi-Fi included', 'Coffee & Tea', 'Common areas', 'Business hours access (6 AM - 10 PM)']::text[],
  '{"daily": 50000}'::jsonb,
  true,
  true
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'Professional',
  'hot_desk',
  'Flexible workspace solution for professionals who value flexibility and community.',
  ARRAY['Access to hot desks', '24/7 access', 'Wi-Fi included', 'Coffee & Tea', 'Common areas', 'Meeting room access (limited)', 'Printing & Scanning', 'Lockers']::text[],
  '{"weekly": 199900, "monthly": 899900, "annual": 6000000}'::jsonb,
  true,
  true
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'Enterprise',
  'dedicated_desk',
  'Your personal workspace with all the amenities you need for focused productivity.',
  ARRAY['Dedicated desk', '24/7 access', 'Wi-Fi included', 'Coffee & Tea', 'Common areas', 'Meeting room access (10 hours/month)', 'Printing & Scanning', 'Lockers', 'Phone booths', 'Mail handling']::text[],
  '{"weekly": 299900, "monthly": 1099900, "annual": 10800000}'::jsonb,
  false,
  true
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'Private Office',
  'private_office',
  'Ultimate privacy and productivity in your own private office space.',
  ARRAY['Private office', '24/7 access', 'Wi-Fi included', 'Coffee & Tea', 'Common areas', 'Unlimited meeting room access', 'Printing & Scanning', 'Lockers', 'Phone booths', 'Mail handling', 'Reception services', 'Customizable space']::text[],
  '{"monthly": 3500000, "annual": 37800000}'::jsonb,
  false,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  pricing = EXCLUDED.pricing,
  popular = EXCLUDED.popular,
  active = EXCLUDED.active,
  updated_at = NOW();

-- ============================================
-- ADD-ONS (4 records)
-- ============================================
INSERT INTO public.add_ons (id, name, description, price, currency, type, active, created_at, updated_at) VALUES
(
  '1e98d572-cb5a-4267-8711-ddd7ee5dc12b'::uuid,
  'Extra Meeting Room Hours',
  'Additional meeting room access beyond your plan allocation.',
  50000.00,
  'NPR',
  'meeting_room_hours',
  true,
  '2026-06-23T11:44:59.483517+00:00'::timestamptz,
  '2026-06-23T11:44:59.483517+00:00'::timestamptz
),
(
  'd21226f7-afe0-405a-b517-0b6e823b01b7'::uuid,
  'Guest Day Passes',
  'Bring colleagues or clients for a day. Includes full workspace access.',
  50000.00,
  'NPR',
  'guest_passes',
  true,
  '2026-06-23T11:44:59.483517+00:00'::timestamptz,
  '2026-06-23T11:44:59.483517+00:00'::timestamptz
),
(
  '1760ec8d-176f-415b-a9b6-e6b13961af1e'::uuid,
  'Virtual Office Address',
  'Professional address for business registration and mail.',
  600000.00,
  'NPR',
  'virtual_office',
  true,
  '2026-06-23T11:44:59.483517+00:00'::timestamptz,
  '2026-06-23T11:44:59.483517+00:00'::timestamptz
),
(
  'fe2c261d-7abc-45ae-b14e-68de0cb259dd'::uuid,
  'Mail Handling Service',
  'Mail receiving and forwarding with notification.',
  200000.00,
  'NPR',
  'mail_handling',
  true,
  '2026-06-23T11:44:59.483517+00:00'::timestamptz,
  '2026-06-23T11:44:59.483517+00:00'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  type = EXCLUDED.type,
  active = EXCLUDED.active,
  updated_at = NOW();

-- ============================================
-- LOCATION PLAN PRICING (1 record)
-- ============================================
INSERT INTO public.location_plan_pricing (id, location_id, plan_id, pricing, currency) VALUES
(
  '7aecc287-9b79-43c2-bc35-e52e91ea79c1'::uuid,
  '2a3f5247-559b-47c7-90b8-b35c8d25ec6e'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '{"annual":33000000,"monthly":3000000}'::jsonb,
  'NPR'
)
ON CONFLICT (location_id, plan_id) DO UPDATE SET
  pricing = EXCLUDED.pricing,
  currency = EXCLUDED.currency,
  updated_at = NOW();

-- ============================================
-- BOOKINGS (4 records)
-- ============================================
INSERT INTO public.bookings (id, location_id, plan_id, start_date, end_date, status, total_amount, payment_status, contact_info, add_ons, created_at, updated_at) VALUES
(
  'd4130011-41ec-4719-924f-bdadcb5413f6'::uuid,
  '2a3f5247-559b-47c7-90b8-b35c8d25ec6e'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '2026-02-01',
  '2026-02-28',
  'confirmed',
  3000000.00,
  'completed',
  '{"phone":"9843491663","customerName":"Saurav Dhungana"}'::jsonb,
  '{"guestPasses":0,"selectedAddOns":[],"meetingRoomHours":0}'::jsonb,
  '2026-02-06T11:43:08.371+00:00'::timestamptz,
  '2026-06-17T07:42:59.616+00:00'::timestamptz
),
(
  '7ba0b105-06c9-4966-a09d-6535dc3ffd71'::uuid,
  '2a3f5247-559b-47c7-90b8-b35c8d25ec6e'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '2025-12-01',
  '2026-05-31',
  'confirmed',
  2200000.00,
  'completed',
  '{"customerName":"Nepali Awaaj"}'::jsonb,
  '{"guestPasses":0,"selectedAddOns":[],"meetingRoomHours":0}'::jsonb,
  '2026-02-05T16:01:10.684+00:00'::timestamptz,
  '2026-02-05T16:01:10.684+00:00'::timestamptz
),
(
  'acf3ccfe-622a-4ac4-b4ec-0069377419e7'::uuid,
  '2a3f5247-559b-47c7-90b8-b35c8d25ec6e'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '2025-12-09',
  '2026-06-09',
  'confirmed',
  2200000.00,
  'completed',
  '{"customerName":"Sambridhi Niwas- Subarna"}'::jsonb,
  '{"guestPasses":0,"selectedAddOns":[],"meetingRoomHours":0}'::jsonb,
  '2026-02-05T16:02:19.961+00:00'::timestamptz,
  '2026-02-05T16:02:19.961+00:00'::timestamptz
),
(
  '1bbe0a04-900f-49c0-84a2-38ccc1f4794c'::uuid,
  '2a3f5247-559b-47c7-90b8-b35c8d25ec6e'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  '2026-01-15',
  '2026-03-15',
  'cancelled',
  1200000.00,
  'refunded',
  '{"customerName":"Alina karmacharya"}'::jsonb,
  '{"guestPasses":0,"selectedAddOns":[],"meetingRoomHours":0}'::jsonb,
  '2026-02-05T16:03:34.452+00:00'::timestamptz,
  '2026-04-21T01:30:23.574+00:00'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  location_id = EXCLUDED.location_id,
  plan_id = EXCLUDED.plan_id,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  status = EXCLUDED.status,
  total_amount = EXCLUDED.total_amount,
  payment_status = EXCLUDED.payment_status,
  contact_info = EXCLUDED.contact_info,
  add_ons = EXCLUDED.add_ons,
  updated_at = NOW();

-- ============================================
-- MANUAL ADMIN ENTRIES (1 record)
-- ============================================
INSERT INTO public.manual_admin_entries (id, entry_type, data, created_at) VALUES
(
  'aeff9838-2e35-4868-b58d-c28ec772caa2'::uuid,
  'membership',
  '{"id":"","notes":"Renewed from d4130011-41ec-4719-924f-bdadcb5413f6","phone":"9843491663","addOns":{"guestPasses":0,"selectedAddOns":[],"meetingRoomHours":0},"amount":3000000,"status":"active","endDate":"2026-03-27T00:00:00.000Z","planName":"Private Office","roomName":"The Earth","autoRenew":false,"createdAt":"2026-04-21T01:30:32.618Z","startDate":"2026-02-28T00:00:00.000Z","billingCycle":"monthly","customerName":"Saurav Dhungana","locationName":"Dhobighat","membershipType":"Private Office"}'::jsonb,
  '2026-04-21T01:30:32.409+00:00'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  entry_type = EXCLUDED.entry_type,
  data = EXCLUDED.data,
  updated_at = NOW();

-- ============================================
-- AMENITIES (8 records)
-- ============================================
INSERT INTO public.amenities (id, title, description, icon, sort_order) VALUES
(
  'b0000001-0001-4000-8000-000000000001'::uuid,
  '24/7 access',
  'Residents and private-office members get a key fob. Come in at six, leave at four - no one is keeping score.',
  'clock',
  1
),
(
  'b0000002-0001-4000-8000-000000000002'::uuid,
  '1G symmetric fibre',
  'Backed up by a second line and a UPS that has actually been tested. Latency posted to a public dashboard each month.',
  'wifi',
  2
),
(
  'b0000003-0001-4000-8000-000000000003'::uuid,
  'Meeting rooms',
  'Seven meeting rooms across the three buildings. Bookable by the hour. Projector, speakerphone, and coffee that work.',
  'presentation',
  3
),
(
  'b0000004-0001-4000-8000-000000000004'::uuid,
  'Event spaces',
  'Six to sixty seats. Setup, teardown, and a host on the floor - included in the weekend hire.',
  'calendar',
  4
),
(
  'b0000005-0001-4000-8000-000000000005'::uuid,
  'Rooftop & terrace',
  'Two of the three buildings have one. Best around four in the afternoon.',
  'sun',
  5
),
(
  'b0000006-0001-4000-8000-000000000006'::uuid,
  'Cafés on site',
  'A café below Dhobighat and another below Jhamsikhel. Members get the resident discount.',
  'coffee',
  6
),
(
  'b0000007-0001-4000-8000-000000000007'::uuid,
  'Phone booths',
  'Quiet, well-lit, with a hook for your coat. No one will hear you breathe.',
  'phone',
  7
),
(
  'b0000008-0001-4000-8000-000000000008'::uuid,
  'Mail & registered address',
  'Use any of the three buildings as your business address. We sign for things and let you know.',
  'mail',
  8
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ============================================
-- TESTIMONIALS (6 records)
-- ============================================
INSERT INTO public.testimonials (id, quote, author_name, author_role, author_initials, sort_order) VALUES
(
  'd0000001-0001-4000-8000-000000000001'::uuid,
  'I''ve been at Jhamsikhel for a year and a half. It''s quiet enough to translate, and there''s always someone to have lunch with.',
  'Sunaina Pradhan',
  'Translator · Jhamsikhel resident',
  'SP',
  1
),
(
  'd0000002-0001-4000-8000-000000000002'::uuid,
  'We moved into a private office when we were three people. We''re nine now and we still fit — barely.',
  'Anjan Karki',
  'Founder, Loomstack',
  'AK',
  2
),
(
  'd0000003-0001-4000-8000-000000000003'::uuid,
  'I come for a week every three months. Same desk, same coffee, no paperwork. It just works.',
  'Mira Joshi',
  'Visiting fellow · Dhobighat',
  'MJ',
  3
),
(
  'd0000004-0001-4000-8000-000000000004'::uuid,
  'The Kausimaa terrace is where I take all my client calls. The wifi reaches, the plants are real, and the coffee is good.',
  'Aakriti Sharma',
  'Designer · Kausimaa',
  'AS',
  4
),
(
  'd0000005-0001-4000-8000-000000000005'::uuid,
  'A registered address at Dhobighat costs less than a virtual office anywhere else. Mail arrives same-day within the valley.',
  'Robin Maharjan',
  'Virtual office · 2 yrs',
  'RM',
  5
),
(
  'd0000006-0001-4000-8000-000000000006'::uuid,
  'I buy day passes when I need to edit without distractions. No small talk, just good light and strong wifi.',
  'Priya Tamang',
  'Filmmaker · Day pass regular',
  'PT',
  6
)
ON CONFLICT (id) DO UPDATE SET
  quote = EXCLUDED.quote,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_initials = EXCLUDED.author_initials,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ============================================
-- FAQS (8 records)
-- ============================================
INSERT INTO public.faqs (id, question, answer, sort_order) VALUES
(
  'e0000001-0001-4000-8000-000000000001'::uuid,
  'Can I walk in tomorrow and start working?',
  'Yes. Day passes are first-come, first-served — no booking needed. Just show up, pick a desk, and connect to the wifi. If you want a dedicated desk or a private office, get in touch and we''ll have you set up within 48 hours.',
  1
),
(
  'e0000002-0001-4000-8000-000000000002'::uuid,
  'What''s the difference between a hot desk and a dedicated desk?',
  'A hot desk is first-come, first-served — you sit where there''s space. A dedicated desk is yours: same spot every day, lockable storage, mail handled. Dedicated desks also include 8 hours of meeting-room time per month and priority event access.',
  2
),
(
  'e0000003-0001-4000-8000-000000000003'::uuid,
  'Can I bring a guest?',
  'Yes. Day-pass holders can bring one guest free on their first visit. Members can bring guests for NPR 500/day. Guest passes are available at the front desk.',
  3
),
(
  'e0000004-0001-4000-8000-000000000004'::uuid,
  'Is there parking?',
  'Parking is available on a first-come, first-served basis at all three buildings. Jhamsikhel has dedicated member parking at the back. Two-wheelers and bicycles can be parked inside the premises.',
  4
),
(
  'e0000005-0001-4000-8000-000000000005'::uuid,
  'What''s the cancellation policy?',
  'No deposit, no joining fee, cancel any time. Dedicated desks and private offices require a 30-day notice. Day passes and week passes are pay-as-you-go, no strings attached.',
  5
),
(
  'e0000006-0001-4000-8000-000000000006'::uuid,
  'Do you offer virtual offices?',
  'Yes. A Kathmandu business address at Dhobighat Hub with mail handling for NPR 6,000/month. Includes 4 hours of meeting room time and 2 day-passes per month. Used by founders who need a registered address without a physical desk.',
  6
),
(
  'e0000007-0001-4000-8000-000000000007'::uuid,
  'Can I host events at CreatrixSpace?',
  'Yes. Both Dhobighat Hub and Jhamsikhel Loft offer event spaces. Dhobighat can seat up to 60, Jhamsikhel up to 40. Setup and teardown are included in the weekend hire. Get in touch to check availability.',
  7
),
(
  'e0000008-0001-4000-8000-000000000008'::uuid,
  'Is there a cafeteria or restaurant on site?',
  'There is a café on the ground floor of both buildings. Members get a discount on drinks and food. The cafés are open from early morning until late evening.',
  8
)
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  answer = EXCLUDED.answer,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ============================================
-- MEMBER COMPANIES (6 records)
-- ============================================
INSERT INTO public.member_companies (id, name, italic, sort_order, logo_url) VALUES
(
  '7875ab56-ed75-4479-afc7-1b21a35da6b1'::uuid,
  'creatrix',
  false,
  0,
  'https://pcnwkdspkpqqchhsmdgq.supabase.co/storage/v1/object/public/images/member-companies/1782208585488-l2pylmbku7.png'
),
(
  'fd64a805-3cd4-4426-8e27-dc7a9317c59f'::uuid,
  'Mountain Guru',
  false,
  0,
  'https://pcnwkdspkpqqchhsmdgq.supabase.co/storage/v1/object/public/images/member-companies/1782208596712-8866qeg5dqi.png'
),
(
  '9ad4d5b2-6d08-46cb-8e27-3f5d64bd7934'::uuid,
  'Breadcrumb Technology',
  false,
  0,
  'https://pcnwkdspkpqqchhsmdgq.supabase.co/storage/v1/object/public/images/member-companies/1782208613210-p6fpcnkt6f.png'
),
(
  'a959648a-fce7-4f3a-af8b-fdba69dc4262'::uuid,
  'inductiv.',
  false,
  0,
  'https://pcnwkdspkpqqchhsmdgq.supabase.co/storage/v1/object/public/images/member-companies/1782208637663-hsll03nzxmh.png'
),
(
  'ec2d179b-e871-4932-8ae2-124ef853cab5'::uuid,
  'Nepali Aawaj',
  true,
  0,
  ''
),
(
  '7f73f7ab-05bb-4040-83a0-dd888dde7244'::uuid,
  'Purple Bytes',
  false,
  0,
  ''
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  italic = EXCLUDED.italic,
  sort_order = EXCLUDED.sort_order,
  logo_url = EXCLUDED.logo_url,
  updated_at = NOW();

-- ============================================
-- SITE STATS (4 records)
-- ============================================
INSERT INTO public.site_stats (id, label, value, suffix, meta, sort_order) VALUES
(
  'g0000001-0001-4000-8000-000000000001'::uuid,
  'Private offices',
  '6',
  '+',
  '{"description": "Across three buildings"}',
  1
),
(
  'g0000002-0001-4000-8000-000000000002'::uuid,
  'Hot desks',
  '25',
  '',
  '{"description": "Open-plan seating across locations"}',
  2
),
(
  'g0000003-0001-4000-8000-000000000003'::uuid,
  'Members',
  '150',
  '+',
  '{"description": "Active members across all plans"}',
  3
),
(
  'g0000004-0001-4000-8000-000000000004'::uuid,
  'Years running',
  '4',
  '+',
  '{"description": "Since we opened in 2022"}',
  4
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  value = EXCLUDED.value,
  suffix = EXCLUDED.suffix,
  meta = EXCLUDED.meta,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ============================================
-- HERO CONTENT (1 record)
-- ============================================
INSERT INTO public.hero_content (id, images, pricing) VALUES
(
  '2088a3b2-323f-463a-a7d1-0609086af9bf'::uuid,
  '[
    {"src":"/images/hero-slider/office-meeting-room.webp","alt":"Modern meeting room with conference table","label":"Jhamsikhel Loft","location":"Jhamsikhel, Lalitpur"},
    {"src":"/images/hero-slider/dhobighat-coworking-space.webp","alt":"Dhobighat coworking space","label":"Dhobighat Hub","location":"Dhobighat, Kathmandu"},
    {"src":"/images/hero-slider/creatrixspace-workspace-interior-1.webp","alt":"CreatrixSpace workspace interior","label":"Kausimaa Co-working","location":"Kupondole, Lalitpur"}
  ]'::jsonb,
  '[
    {"label":"NPR 800","sublabel":"A day · no deposit"},
    {"label":"NPR 8,000","sublabel":"A month · dedicated desk"},
    {"label":"5 rooms","sublabel":"Private offices — available now"},
    {"label":"NPR 6,000","sublabel":"Virtual office · per month"}
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  images = EXCLUDED.images,
  pricing = EXCLUDED.pricing,
  updated_at = NOW();

-- ============================================
-- MEMBERSHIP CONTENT (1 record)
-- ============================================
INSERT INTO public.membership_content (id, tabs) VALUES
(
  'c0eebc99-0c0b-4ef8-bb6d-6bb9bd380a99'::uuid,
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
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  tabs = EXCLUDED.tabs,
  updated_at = NOW();

-- ============================================
-- SPACES CONTENT (1 record)
-- ============================================
INSERT INTO public.spaces_content (id, cards) VALUES
(
  'a1b2c3d4-0001-4000-8000-000000000001'::uuid,
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
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  cards = EXCLUDED.cards,
  updated_at = NOW();

-- ============================================
-- BOOK TOUR CONTENT (1 record)
-- ============================================
INSERT INTO public.book_tour_content (id, step1_headline, step1_description, step2_headline, confirmation_eyebrow, confirmation_tour_details, time_slots, interest_options) VALUES
(
  '5bac5eb0-408c-4272-9d5a-99823deaf246'::uuid,
  'Come by, have a coffee, <em class="text-clay">look around</em>.',
  'A tour takes about twenty minutes. You''ll meet whoever''s running the floor that day; the coffee is on us.',
  'A couple of <em class="text-clay">details</em>.',
  'Confirmed',
  'The full floor, the meeting rooms, the phone booths, the terrace. We''ll show you the desk we''d put you at, what the wifi feels like, and where the coffee comes from.',
  '["11:00", "12:00", "14:00", "15:00", "16:00"]'::jsonb,
  '[{"value":"day","label":"Day Pass — NPR 800 / day"},{"value":"week","label":"Week Pass — NPR 3,000 / week"},{"value":"resident","label":"Dedicated Desk — NPR 8,000 / month"},{"value":"studio-2","label":"Studio for two — NPR 24,000 / month"},{"value":"studio-4","label":"Studio for four — NPR 46,000 / month"},{"value":"studio-8","label":"Studio for six to eight — NPR From 78,000 / month"},{"value":"virtual","label":"Virtual Office — NPR 6,000 / month"},{"value":"just-looking","label":"Just looking, thanks"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  step1_headline = EXCLUDED.step1_headline,
  step1_description = EXCLUDED.step1_description,
  step2_headline = EXCLUDED.step2_headline,
  confirmation_eyebrow = EXCLUDED.confirmation_eyebrow,
  confirmation_tour_details = EXCLUDED.confirmation_tour_details,
  time_slots = EXCLUDED.time_slots,
  interest_options = EXCLUDED.interest_options,
  updated_at = NOW();

-- ============================================
-- END OF BACKUP
-- ============================================

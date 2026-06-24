-- ============================================
-- BACKUP: ADD-ONS DATA FROM SUPABASE
-- Generated: 2026-06-24
-- ============================================

TRUNCATE TABLE public.add_ons CASCADE;

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

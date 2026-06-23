export const APP_NAME = 'CreatrixSpace'
export const APP_DESCRIPTION =
  'Premium coworking spaces for modern professionals'

export const ROUTES = {
  HOME: '/',
  LOCATIONS: '/locations',
  LOCATION_DETAIL: '/locations/:id',
  PRICING: '/pricing',
  BOOKING: '/booking',
  MEMBERSHIP: '/membership',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  ABOUT: '/about',
  CAREERS: '/careers',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_BILLING: '/dashboard/billing',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_MEMBERSHIPS: '/admin/memberships',
  ADMIN_PRICING: '/admin/pricing',
  ADMIN_LOCATIONS: '/admin/locations',
  ADMIN_SITE_STATS: '/admin/site-stats',
  ADMIN_HERO: '/admin/hero',
  ADMIN_MEMBERSHIP: '/admin/membership',
  ADMIN_SPACES: '/admin/spaces',
  ADMIN_AMENITIES: '/admin/amenities',
  ADMIN_BOOK_TOUR: '/admin/book-tour',
  ADMIN_TESTIMONIALS: '/admin/testimonials',
  ADMIN_FAQ: '/admin/faq',
  ADMIN_MEMBER_COMPANIES: '/admin/member-companies',
  ADMIN_CTA: '/admin/cta',
  ADMIN_FORM_SUBMISSIONS: '/admin/form-submissions',
  ADMIN_PLANS: '/admin/plans',
} as const

export const AMENITIES = [
  'Fast Wi-Fi',
  '24/7 Access',
  'Coffee & Tea',
  'Lockers',
  'Phone Booths',
  'Printing & Scanning',
  'Meeting Rooms',
  'Event Space',
  'Parking',
  'Kitchen',
  'Cleaning Service',
  'Reception',
] as const

export const PLAN_TYPES = {
  DAY_PASS: 'day_pass',
  HOT_DESK: 'hot_desk',
  DEDICATED_DESK: 'dedicated_desk',
  PRIVATE_OFFICE: 'private_office',
  MEETING_ROOM: 'meeting_room',
} as const

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const

export const MEMBERSHIP_TYPES = {
  EXPLORER: 'explorer',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
  PRIVATE_OFFICE: 'private-office',
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

export const WHATSAPP = {
  NUMBER: '9779803171819',
  DISPLAY: '+977 9803171819',
  DEFAULT_MESSAGE: "Hello CreatrixSpace — I'd like to know more.",
  get url() {
    return `https://wa.me/${this.NUMBER}?text=${encodeURIComponent(this.DEFAULT_MESSAGE)}`
  },
} as const

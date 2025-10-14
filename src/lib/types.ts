export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  id: string
  name: string
  slug?: string
  description: string
  address: string
  fullAddress?: string
  city?: string
  coordinates?: {
    lat: number
    lng: number
  }
  image?: string
  images?: string[]
  amenities: string[]
  features?: string[]
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed?: boolean
    }
  }
  capacity: number | {
    hotDesks: number
    dedicatedDesks: number
    privateOffices: number
    meetingRooms: number
  }
  rating?: number
  available?: boolean
  status?: string
  popular?: boolean
  contact?: {
    phone: string
    email: string
  }
  googleMapsUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Plan {
  id: string
  name: string
  type: 'day_pass' | 'hot_desk' | 'dedicated_desk' | 'private_office' | 'meeting_room'
  description: string
  features: string[]
  pricing: {
    monthly: number
    annual: number
    hourly?: number
    daily?: number
  }
  stripeProductId?: string
  stripePriceIds?: {
    monthly?: string
    annual?: string
    hourly?: string
    daily?: string
  }
  popular?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  userId: string
  locationId: string
  planId: string
  startDate: Date
  endDate: Date
  startTime?: string
  endTime?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalAmount: number
  currency: string
  stripeSessionId?: string
  stripePaymentIntentId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  image?: string
  tags: string[]
  published: boolean
  publishedAt?: Date
  readingTime: number
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
  featured?: boolean
  createdAt: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  locationId?: string
}

export interface BookingFormData {
  locationId: string
  planId: string
  startDate: Date
  endDate: Date
  startTime?: string
  endTime?: string
  addOns: string[]
  notes?: string
}

export interface PaymentData {
  amount: number
  currency: string
  planId: string
  locationId: string
  userId: string
  bookingData: BookingFormData
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchFilters {
  query?: string
  location?: string
  amenities?: string[]
  priceRange?: {
    min: number
    max: number
  }
  dateRange?: {
    start: Date
    end: Date
  }
}

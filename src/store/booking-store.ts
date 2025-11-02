import { create } from 'zustand'
import { getLocationPricing } from '@/lib/location-pricing'
import { devtools } from 'zustand/middleware'

export interface BookingData {
  // Step 1: Location & Plan
  locationId: string
  planId: string
  
  // Step 2: Date & Time  
  startDate: Date | null
  endDate: Date | null
  startTime: string
  endTime: string
  
  // Step 3: Add-ons & Extras
  addOns: string[]
  meetingRoomHours: number
  guestPasses: number
  notes: string
  
  // Step 4: Contact Info
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
  }
  
  // Pricing
  totalAmount: number
  currency: string
}

interface BookingStore {
  // Current step
  currentStep: number
  
  // Booking data
  bookingData: BookingData
  
  // Available options
  locations: Array<{
    id: string
    name: string
    address: string
    available: boolean
  }>
  
  plans: Array<{
    id: string
    name: string
    type: string
    pricing: {
      daily?: number
      monthly?: number
      annual?: number
    }
    available?: boolean
    status?: string
  }>
  
  addOns: Array<{
    id: string
    name: string
    price: number
    description: string
  }>
  
  // Actions
  setCurrentStep: (step: number) => void
  updateBookingData: (data: Partial<BookingData>) => void
  resetBooking: () => void
  calculateTotal: () => void
  
  // Navigation
  nextStep: () => void
  prevStep: () => void
  canProceed: () => boolean
}

const initialBookingData: BookingData = {
  locationId: '',
  planId: '',
  startDate: null,
  endDate: null,
  startTime: '09:00',
  endTime: '17:00',
  addOns: [],
  meetingRoomHours: 0,
  guestPasses: 0,
  notes: '',
  contactInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  },
  totalAmount: 0,
  currency: 'NPR',
}

// Mock data - in real app this would come from API
const mockLocations = [
  {
    id: 'dhobighat-hub',
    name: 'Dhobighat (WashingTown) Hub',
    address: 'Dhobighat, Kathmandu',
    available: true,
  },
  {
    id: 'kausimaa-coworking',
    name: 'Kausimaa Co-working',
    address: 'Jwagal/Kupondole, Lalitpur',
    available: true,
  },
  {
    id: 'jhamsikhel-loft',
    name: 'Jhamsikhel Loft', 
    address: 'Jhamsikhel, Lalitpur',
    available: false,
    status: 'Reserved for 6 months',
  },
]

function getPlansForLocation(locationId: string) {
  const locationPricing = getLocationPricing(locationId)
  
  return [
    {
      id: 'explorer',
      name: 'Explorer',
      type: 'day_pass' as const,
      pricing: { daily: locationPricing.explorer.daily },
    },
    {
      id: 'professional',
      name: 'Professional',
      type: 'hot_desk' as const,
      pricing: { 
        weekly: locationPricing.professional.weekly,
        monthly: locationPricing.professional.monthly, 
        annual: locationPricing.professional.annual 
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      type: 'dedicated_desk' as const,
      pricing: { 
        weekly: locationPricing.enterprise.weekly,
        monthly: locationPricing.enterprise.monthly, 
        annual: locationPricing.enterprise.annual 
      },
    },
    {
      id: 'private-office',
      name: 'Private Office',
      type: 'private_office' as const,
      pricing: { 
        weekly: locationPricing['private-office'].weekly,
        monthly: locationPricing['private-office'].monthly, 
        annual: locationPricing['private-office'].annual 
      },
      available: false,
      status: 'Reserved',
    },
  ]
}

const mockAddOns = [
  {
    id: 'meeting-room-hours',
    name: 'Extra Meeting Room Hours',
    price: 80000, // NPR 800/hour
    description: 'Additional meeting room access beyond your plan',
  },
  {
    id: 'guest-passes',
    name: 'Guest Day Passes',
    price: 30000, // NPR 300/day (promotional price)
    description: 'Bring colleagues for a day',
  },
  {
    id: 'virtual-office',
    name: 'Virtual Office Address',
    price: 300000, // NPR 3,000/month
    description: 'Use our address for your business registration',
  },
  {
    id: 'mail-handling',
    name: 'Mail Handling Service',
    price: 200000, // NPR 2,000/month
    description: 'Mail receiving and forwarding service',
  },
]

export const useBookingStore = create<BookingStore>()(
  devtools(
    (set, get) => ({
      currentStep: 1,
      bookingData: initialBookingData,
      locations: mockLocations,
      plans: getPlansForLocation('dhobighat-hub'), // Initialize with default location
      addOns: mockAddOns,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateBookingData: (data) => {
        const currentLocationId = get().bookingData.locationId
        set((state) => ({
          bookingData: { ...state.bookingData, ...data }
        }))
        // If location changed, update plans with location-specific pricing
        if (data.locationId && data.locationId !== currentLocationId) {
          set({ plans: getPlansForLocation(data.locationId) })
        }
        get().calculateTotal()
      },
      
      resetBooking: () => set({
        currentStep: 1,
        bookingData: initialBookingData,
      }),
      
      calculateTotal: () => {
        const { bookingData, plans, addOns } = get()
        const selectedPlan = plans.find(p => p.id === bookingData.planId)
        
        if (!selectedPlan) return
        
        let total = 0
        
        // Base plan cost
        if (selectedPlan.type === 'day_pass') {
          total += selectedPlan.pricing.daily || 0
        } else {
          total += selectedPlan.pricing.monthly || 0
        }
        
        // Add-ons cost
        bookingData.addOns.forEach(addonId => {
          const addon = addOns.find(a => a.id === addonId)
          if (addon) total += addon.price
        })
        
        // Meeting room hours
        if (bookingData.meetingRoomHours > 0) {
          const meetingRoomAddon = addOns.find(a => a.id === 'meeting-room-hours')
          if (meetingRoomAddon) {
            total += meetingRoomAddon.price * bookingData.meetingRoomHours
          }
        }
        
        // Guest passes
        if (bookingData.guestPasses > 0) {
          const guestPassAddon = addOns.find(a => a.id === 'guest-passes')
          if (guestPassAddon) {
            total += guestPassAddon.price * bookingData.guestPasses
          }
        }
        
        set((state) => ({
          bookingData: { ...state.bookingData, totalAmount: total }
        }))
      },
      
      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 4) {
          set({ currentStep: currentStep + 1 })
        }
      },
      
      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },
      
      canProceed: () => {
        const { currentStep, bookingData } = get()
        
        switch (currentStep) {
          case 1:
            return bookingData.locationId && bookingData.planId
          case 2:
            return bookingData.startDate && bookingData.startTime && bookingData.endTime
          case 3:
            return true // Optional step
          case 4:
            return (
              bookingData.contactInfo.firstName &&
              bookingData.contactInfo.lastName &&
              bookingData.contactInfo.email &&
              bookingData.contactInfo.phone
            )
          default:
            return false
        }
      },
    }),
    { name: 'booking-store' }
  )
)

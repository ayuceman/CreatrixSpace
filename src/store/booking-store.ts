import { create } from 'zustand'
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
    id: 'jhamsikhel-loft',
    name: 'Jhamsikhel Loft', 
    address: 'Jhamsikhel, Lalitpur',
    available: false,
    status: 'Reserved for 6 months',
  },
  {
    id: 'baluwatar-studios',
    name: 'Baluwatar Studios',
    address: 'Baluwatar, Kathmandu',
    available: false,
    status: 'Coming Soon',
  },
]

const mockPlans = [
  {
    id: 'explorer',
    name: 'Explorer',
    type: 'day_pass',
    pricing: { daily: 70000 }, // NPR 700
  },
  {
    id: 'professional',
    name: 'Professional',
    type: 'hot_desk', 
    pricing: { monthly: 899900, annual: 9719000 }, // NPR 8,999/month
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    type: 'dedicated_desk',
    pricing: { monthly: 1899900, annual: 20519000 }, // NPR 18,999/month
  },
  {
    id: 'private-office',
    name: 'Private Office',
    type: 'private_office',
    pricing: { monthly: 3200000, annual: 34560000 }, // NPR 32,000/month
  },
]

const mockAddOns = [
  {
    id: 'meeting-room-hours',
    name: 'Extra Meeting Room Hours',
    price: 50000, // NPR 500/hour
    description: 'Additional meeting room access beyond your plan',
  },
  {
    id: 'guest-passes',
    name: 'Guest Day Passes',
    price: 50000, // NPR 500/day
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
      plans: mockPlans,
      addOns: mockAddOns,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateBookingData: (data) => {
        set((state) => ({
          bookingData: { ...state.bookingData, ...data }
        }))
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

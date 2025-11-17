import { create } from 'zustand'
import { getLocationPricing } from '@/lib/location-pricing'
import { devtools } from 'zustand/middleware'
import { locationService, planService, addOnService, bookingService, authService } from '@/services/supabase-service'
import { calculatePricing, PRICING_CONSTANTS } from '@/lib/pricing-calculator'
import type { Location, Plan, AddOn } from '@/lib/database.types'

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
  
  // Booking ID (set after creation)
  bookingId?: string
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
  
  // Loading states
  loading: boolean
  error: string | null
  
  // Actions
  setCurrentStep: (step: number) => void
  updateBookingData: (data: Partial<BookingData>) => void
  resetBooking: () => void
  calculateTotal: () => void
  
  // Data loading
  loadLocations: () => Promise<void>
  loadPlans: () => Promise<void>
  loadAddOns: () => Promise<void>
  loadAllData: () => Promise<void>
  
  // Booking operations
  createBooking: () => Promise<string | null> // Returns booking ID or null
  
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

// Helper function to convert Supabase Location to store format
const convertLocation = (loc: Location) => ({
  id: loc.id,
  name: loc.name,
  address: loc.address,
  available: loc.available,
})

// Helper function to convert Supabase Plan to store format
const convertPlan = (plan: Plan) => {
  const pricing = plan.pricing as any
  return {
    id: plan.id,
    name: plan.name,
    type: plan.type,
    pricing: {
      daily: pricing.daily,
      monthly: pricing.monthly,
      annual: pricing.annual,
      hourly: pricing.hourly,
    },
  }
}

// Helper function to convert Supabase AddOn to store format
const convertAddOn = (addon: AddOn) => ({
  id: addon.id,
  name: addon.name,
  price: Number(addon.price),
  description: addon.description || '',
})

export const useBookingStore = create<BookingStore>()(
  devtools(
    (set, get) => ({
      currentStep: 1,
      bookingData: initialBookingData,
      locations: [],
      plans: [],
      addOns: [],
      loading: false,
      error: null,
      
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
        
        if (!selectedPlan) {
          console.warn('Cannot calculate total: No plan selected')
          return
        }
        
        // Get selected add-ons with their prices
        const selectedAddOnsWithPrices = bookingData.addOns
          .map(addonId => {
            const addon = addOns.find(a => a.id === addonId)
            return addon ? { id: addon.id, price: addon.price } : null
          })
          .filter((addon): addon is { id: string; price: number } => addon !== null)
        
        // Use centralized pricing calculator
        const pricing = calculatePricing({
          planPricing: selectedPlan.pricing,
          planType: selectedPlan.type,
          selectedAddOns: selectedAddOnsWithPrices,
          meetingRoomHours: bookingData.meetingRoomHours,
          guestPasses: bookingData.guestPasses,
        })
        
        console.log('Pricing calculation:', {
          basePrice: pricing.basePrice,
          addOnsPrice: pricing.addOnsPrice,
          meetingRoomHoursPrice: pricing.meetingRoomHoursPrice,
          guestPassesPrice: pricing.guestPassesPrice,
          total: pricing.total,
        })
        
        set((state) => ({
          bookingData: { ...state.bookingData, totalAmount: pricing.total }
        }))
      },
      
      loadLocations: async () => {
        set({ loading: true, error: null })
        try {
          const locations = await locationService.getAllLocations()
          // Always use data from Supabase (even if empty)
          // Don't use fallback mock data - user should add real data to Supabase
          set({ 
            locations: locations.map(convertLocation),
            loading: false 
          })
        } catch (error) {
          // On error, show error but don't use mock data
          set({ 
            locations: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load locations from Supabase. Please check your connection and ensure locations are added to the database.'
          })
        }
      },
      
      loadPlans: async () => {
        set({ loading: true, error: null })
        try {
          const plans = await planService.getAllPlans()
          // Always use data from Supabase (even if empty)
          // Don't use fallback mock data - user should add real data to Supabase
          set({ 
            plans: plans.map(convertPlan),
            loading: false 
          })
        } catch (error) {
          // On error, show error but don't use mock data
          set({ 
            plans: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load plans from Supabase. Please check your connection and ensure plans are added to the database.'
          })
        }
      },
      
      loadAddOns: async () => {
        set({ loading: true, error: null })
        try {
          const addOns = await addOnService.getAllAddOns()
          // Always use data from Supabase (even if empty)
          // Don't use fallback mock data - user should add real data to Supabase
          set({ 
            addOns: addOns.map(convertAddOn),
            loading: false 
          })
        } catch (error) {
          // On error, show error but don't use mock data
          set({ 
            addOns: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load add-ons from Supabase. Please check your connection and ensure add-ons are added to the database.'
          })
        }
      },
      
      loadAllData: async () => {
        set({ loading: true, error: null })
        try {
          await Promise.all([
            get().loadLocations(),
            get().loadPlans(),
            get().loadAddOns(),
          ])
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load data',
            loading: false 
          })
        }
      },
      
      createBooking: async () => {
        const { bookingData, locations, plans, addOns } = get()
        set({ loading: true, error: null })
        
        try {
          // Recalculate total before creating booking to ensure it's accurate
          get().calculateTotal()
          
          // Get the updated booking data with recalculated total
          const updatedBookingData = get().bookingData
          
          // Try to get current user, but allow guest bookings (null user_id)
          let userId: string | null = null
          try {
            const user = await authService.getCurrentUser()
            userId = user?.id || null
          } catch {
            // Not authenticated - allow guest booking
            userId = null
          }
          
          // Create booking in Supabase (with or without user_id)
          const booking = await bookingService.createBooking(updatedBookingData, userId)
          
          // Update booking data with the created booking ID
          set((state) => ({
            bookingData: { ...state.bookingData, bookingId: booking.id },
            loading: false
          }))
          
          // Email will be sent when user verifies payment on QR payment page
          
          return booking.id
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create booking'
          set({ 
            error: errorMessage,
            loading: false 
          })
          return null
        }
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
        const { currentStep, bookingData, plans } = get()
        const selectedPlan = plans.find(p => p.id === bookingData.planId)
        const isDayPass = selectedPlan?.type === 'day_pass'
        
        switch (currentStep) {
          case 1:
            return bookingData.locationId && bookingData.planId
          case 2:
            // For day passes, only startDate is required
            // For other plans, startDate, startTime, and endTime are required
            if (isDayPass) {
              return !!bookingData.startDate
            }
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

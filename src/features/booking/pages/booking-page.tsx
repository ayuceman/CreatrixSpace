import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/store/booking-store'
import { BookingProgress } from '../components/booking-progress'
import { LocationPlanStep } from '../components/location-plan-step'
import { DateTimeStep } from '../components/date-time-step'
import { AddOnsStep } from '../components/add-ons-step'
import { ContactStep } from '../components/contact-step'
import { BookingSummary } from '../components/booking-summary'

export function BookingPage() {
  const [searchParams] = useSearchParams()
  const { currentStep, updateBookingData, loadAllData, loading } = useBookingStore()
  const stepContentRef = useRef<HTMLDivElement>(null)
  
  const stepTitles = [
    'Location & Plan Selection',
    'Date & Time Selection', 
    'Add-ons & Services',
    'Contact Information'
  ]
  
  // Load data from Supabase on mount
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // Pre-select plan from URL params (from pricing page links)
  // Note: Only works if planId is a valid UUID from Supabase
  useEffect(() => {
    const planId = searchParams.get('plan')
    if (planId) {
      // Validate it's a UUID before setting (to avoid using string IDs)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (uuidRegex.test(planId)) {
        updateBookingData({ planId })
      } else {
        console.warn('Plan ID from URL is not a valid UUID, ignoring:', planId)
      }
    }
  }, [searchParams, updateBookingData])

  // Pre-select location from URL params
  useEffect(() => {
    const locationId = searchParams.get('location')
    if (locationId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (uuidRegex.test(locationId)) {
        updateBookingData({ locationId })
      } else {
        console.warn('Location ID from URL is not a valid UUID, ignoring:', locationId)
      }
    }
  }, [searchParams, updateBookingData])

  // Initial scroll to content when page loads
  useEffect(() => {
    // Delay to ensure DOM is fully rendered
    setTimeout(() => {
      const bookingContent = document.getElementById('booking-content')
      if (bookingContent) {
        // Get the element's position and scroll with offset for header
        const elementRect = bookingContent.getBoundingClientRect()
        const absoluteElementTop = elementRect.top + window.pageYOffset
        const offset = 100 // Account for fixed header
        window.scrollTo({
          top: absoluteElementTop - offset,
          behavior: 'smooth'
        })
      }
    }, 200)
  }, []) // Run only on initial mount

  // Auto-focus on step content when step changes
  useEffect(() => {
    if (stepContentRef.current) {
      // Small delay to ensure DOM is updated after step transition
      setTimeout(() => {
        if (stepContentRef.current) {
          stepContentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
          
          // Focus on the container for keyboard navigation
          stepContentRef.current.focus()
        }
      }, 100)
    }
  }, [currentStep])

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LocationPlanStep />
      case 2:
        return <DateTimeStep />
      case 3:
        return <AddOnsStep />
      case 4:
        return <ContactStep />
      default:
        return <LocationPlanStep />
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8" id="booking-header">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Book Your Workspace
          </h1>
          <p className="text-muted-foreground">
            Complete your booking in just a few simple steps
          </p>
        </div>

        {/* Progress Indicator */}
        <BookingProgress />

        <div className="mt-8 grid lg:grid-cols-3 gap-8" id="booking-content">
          {/* Main Content */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading booking options...</span>
                </div>
              ) : (
                <motion.div
                  ref={stepContentRef}
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  tabIndex={-1}
                  className="focus:outline-none scroll-mt-8"
                  aria-live="polite"
                  aria-label={`Step ${currentStep} of 4: ${stepTitles[currentStep - 1]}`}
                >
                  {renderStep()}
                </motion.div>
              )}
            </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

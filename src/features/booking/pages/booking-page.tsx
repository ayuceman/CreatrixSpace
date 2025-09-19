import { useEffect } from 'react'
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
  const { currentStep, updateBookingData } = useBookingStore()
  
  // Pre-select plan from URL params (from pricing page links)
  useEffect(() => {
    const planId = searchParams.get('plan')
    if (planId) {
      updateBookingData({ planId })
    }
  }, [searchParams, updateBookingData])

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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Book Your Workspace
          </h1>
          <p className="text-muted-foreground">
            Complete your booking in just a few simple steps
          </p>
        </div>

        {/* Progress Indicator */}
        <BookingProgress />

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
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

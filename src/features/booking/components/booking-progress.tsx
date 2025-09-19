import { Check } from 'lucide-react'
import { useBookingStore } from '@/store/booking-store'
import { cn } from '@/lib/utils'

const steps = [
  { number: 1, title: 'Location & Plan', description: 'Choose your workspace' },
  { number: 2, title: 'Date & Time', description: 'Select your schedule' },
  { number: 3, title: 'Add-ons', description: 'Extra services (optional)' },
  { number: 4, title: 'Contact Info', description: 'Complete your booking' },
]

export function BookingProgress() {
  const { currentStep } = useBookingStore()

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number
          const isUpcoming = currentStep < step.number

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    {
                      "bg-primary border-primary text-primary-foreground": isCompleted || isCurrent,
                      "border-muted-foreground text-muted-foreground": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                
                {/* Step Info */}
                <div className="mt-2 text-center hidden sm:block">
                  <p className={cn(
                    "text-sm font-medium",
                    {
                      "text-primary": isCurrent,
                      "text-foreground": isCompleted,
                      "text-muted-foreground": isUpcoming,
                    }
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-4 transition-all duration-300",
                    {
                      "bg-primary": isCompleted,
                      "bg-muted": isUpcoming || isCurrent,
                    }
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Step Info */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-sm font-medium text-primary">
          Step {currentStep}: {steps[currentStep - 1]?.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {steps[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  )
}

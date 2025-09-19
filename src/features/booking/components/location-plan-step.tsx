import { MapPin, Star, Clock, Users } from 'lucide-react'
import { useBookingStore } from '@/store/booking-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'

export function LocationPlanStep() {
  const {
    bookingData,
    locations,
    plans,
    updateBookingData,
    nextStep,
    canProceed,
  } = useBookingStore()

  const handleLocationChange = (locationId: string) => {
    updateBookingData({ locationId })
  }

  const handlePlanChange = (planId: string) => {
    updateBookingData({ planId })
  }

  const selectedLocation = locations.find(l => l.id === bookingData.locationId)
  const selectedPlan = plans.find(p => p.id === bookingData.planId)

  return (
    <div className="space-y-8">
      {/* Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Choose Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={bookingData.locationId} 
            onValueChange={handleLocationChange}
            className="space-y-4"
          >
            {locations.map((location) => (
              <div 
                key={location.id}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem 
                  value={location.id} 
                  id={location.id}
                  disabled={!location.available}
                />
                <Label 
                  htmlFor={location.id} 
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {location.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!location.available && (
                        <Badge variant="secondary">Coming Soon</Badge>
                      )}
                      {location.id === 'thamel-hub' && (
                        <Badge>
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Choose Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={bookingData.planId} 
            onValueChange={handlePlanChange}
            className="space-y-4"
          >
            {plans.map((plan) => {
              const isMonthly = plan.pricing.monthly
              const price = isMonthly ? plan.pricing.monthly : plan.pricing.daily
              const period = isMonthly ? 'month' : 'day'
              
              return (
                <div 
                  key={plan.id}
                  className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={plan.id} id={plan.id} />
                  <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plan.type === 'day_pass' && 'Perfect for trying us out'}
                          {plan.type === 'hot_desk' && 'Flexible workspace solution'}
                          {plan.type === 'dedicated_desk' && 'Your personal workspace'}
                          {plan.type === 'private_office' && 'Ultimate privacy and productivity'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {formatCurrency(price || 0, 'NPR')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          per {period}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedLocation && selectedPlan && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Your Selection</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{selectedLocation.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">
                  {formatCurrency(
                    selectedPlan.pricing.monthly || selectedPlan.pricing.daily || 0,
                    'NPR'
                  )}
                  /{selectedPlan.pricing.monthly ? 'month' : 'day'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Button 
          onClick={nextStep}
          disabled={!canProceed()}
          size="lg"
        >
          Continue to Date & Time
        </Button>
      </div>
    </div>
  )
}

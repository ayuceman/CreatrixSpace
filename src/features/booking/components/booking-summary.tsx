import { MapPin, Calendar, Clock, Plus } from 'lucide-react'
import { useBookingStore } from '@/store/booking-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

export function BookingSummary() {
  const { bookingData, locations, plans, addOns } = useBookingStore()

  const selectedLocation = locations.find(l => l.id === bookingData.locationId)
  const selectedPlan = plans.find(p => p.id === bookingData.planId)

  // Calculate base price
  const basePrice = selectedPlan?.pricing.monthly || selectedPlan?.pricing.daily || 0

  // Calculate add-ons cost
  let addOnsTotal = 0
  
  // Regular add-ons
  bookingData.addOns.forEach(addonId => {
    const addon = addOns.find(a => a.id === addonId)
    if (addon) addOnsTotal += addon.price
  })

  // Meeting room hours
  if (bookingData.meetingRoomHours > 0) {
    addOnsTotal += 150000 * bookingData.meetingRoomHours
  }

  // Guest passes
  if (bookingData.guestPasses > 0) {
    addOnsTotal += 60000 * bookingData.guestPasses
  }

  const totalAmount = basePrice + addOnsTotal

  if (!selectedLocation || !selectedPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select location and plan to see summary
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location & Plan */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              Location
            </div>
            <p className="font-medium">{selectedLocation.name}</p>
            <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Plan</div>
            <div className="flex items-center justify-between">
              <p className="font-medium">{selectedPlan.name}</p>
              {selectedPlan.id === 'hot-desk' && <Badge>Popular</Badge>}
            </div>
          </div>
        </div>

        {/* Date & Time */}
        {bookingData.startDate && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {selectedPlan.type === 'day_pass' ? 'Date:' : 'Start:'}
                  </span>
                  <span className="font-medium">
                    {bookingData.startDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {selectedPlan.type !== 'day_pass' && bookingData.endDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium">
                      {bookingData.endDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {selectedPlan.type !== 'day_pass' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {bookingData.startTime} - {bookingData.endTime}
                    </span>
                  </div>
                )}

                {selectedPlan.type === 'day_pass' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Access:</span>
                    <span className="font-medium">6:00 AM - 10:00 PM</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Add-ons */}
        {(bookingData.addOns.length > 0 || 
          bookingData.meetingRoomHours > 0 || 
          bookingData.guestPasses > 0) && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Plus className="h-4 w-4 mr-1" />
                Add-ons
              </div>
              
              <div className="space-y-1 text-sm">
                {bookingData.addOns.map(addonId => {
                  const addon = addOns.find(a => a.id === addonId)
                  if (!addon) return null
                  
                  return (
                    <div key={addonId} className="flex justify-between">
                      <span className="text-muted-foreground">{addon.name}</span>
                      <span className="font-medium">
                        {formatCurrency(addon.price, 'NPR')}
                      </span>
                    </div>
                  )
                })}

                {bookingData.meetingRoomHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Meeting Room ({bookingData.meetingRoomHours}h)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(150000 * bookingData.meetingRoomHours, 'NPR')}
                    </span>
                  </div>
                )}

                {bookingData.guestPasses > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Guest Passes ({bookingData.guestPasses})
                    </span>
                    <span className="font-medium">
                      {formatCurrency(60000 * bookingData.guestPasses, 'NPR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Pricing */}
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedPlan.name} ({selectedPlan.pricing.monthly ? 'Monthly' : 'Daily'})
            </span>
            <span className="font-medium">
              {formatCurrency(basePrice, 'NPR')}
            </span>
          </div>

          {addOnsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Add-ons</span>
              <span className="font-medium">
                {formatCurrency(addOnsTotal, 'NPR')}
              </span>
            </div>
          )}

          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(totalAmount, 'NPR')}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Includes all taxes and fees
          </p>
        </div>

        {/* Payment Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Next:</strong> Complete your contact information to proceed to secure payment.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

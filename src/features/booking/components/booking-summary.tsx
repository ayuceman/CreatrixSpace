import { MapPin, Calendar, Plus, DoorOpen, Shield, Lock } from 'lucide-react'
import { useBookingStore } from '@/store/booking-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { calculatePricing } from '@/lib/pricing-calculator'

export function BookingSummary() {
  const {
    bookingData,
    locations,
    plans,
    addOns,
    getPlanPricingForLocation,
    getRoomsForLocation,
  } = useBookingStore()

  const selectedLocation = locations.find(l => l.id === bookingData.locationId)
  const selectedPlan = plans.find(p => p.id === bookingData.planId)
  const locationRooms = getRoomsForLocation(bookingData.locationId)
  const selectedRoom = locationRooms.find((room) => room.id === bookingData.roomId)

  // Use centralized pricing calculator for consistency
  const selectedAddOnsWithPrices = bookingData.addOns
    .map(addonId => {
      const addon = addOns.find(a => a.id === addonId)
      return addon ? { id: addon.id, price: addon.price } : null
    })
    .filter((addon): addon is { id: string; price: number } => addon !== null)

  const locationPlanPricing = selectedPlan
    ? getPlanPricingForLocation(selectedPlan.id, bookingData.locationId, bookingData.roomId)
    : undefined
  const planPricingData = selectedPlan ? (locationPlanPricing || selectedPlan.pricing) : undefined

  const billingLabel = planPricingData?.monthly
    ? 'Monthly'
    : planPricingData?.weekly
      ? 'Weekly'
      : planPricingData?.annual
        ? 'Annual'
        : 'Daily'

  const pricing = selectedPlan ? calculatePricing({
    planPricing: planPricingData || selectedPlan.pricing,
    planType: selectedPlan.type,
    selectedAddOns: selectedAddOnsWithPrices,
    meetingRoomHours: bookingData.meetingRoomHours,
    guestPasses: bookingData.guestPasses,
  }) : {
    basePrice: 0,
    addOnsPrice: 0,
    meetingRoomHoursPrice: 0,
    guestPassesPrice: 0,
    total: 0,
  }

  const basePrice = pricing.basePrice
  const addOnsTotal = pricing.addOnsPrice + pricing.meetingRoomHoursPrice + pricing.guestPassesPrice
  const totalAmount = pricing.total

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

          {selectedRoom && (
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <DoorOpen className="h-4 w-4 mr-1" />
                Room
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">{selectedRoom.name}</p>
                <Badge variant={selectedRoom.status === 'available' ? 'secondary' : 'destructive'}>
                  {selectedRoom.status === 'available' ? 'Reserved' : selectedRoom.status}
                </Badge>
              </div>
              {selectedRoom.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {selectedRoom.description}
                </p>
              )}
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-1">Plan</div>
            <div className="flex items-center justify-between">
              <p className="font-medium">{selectedPlan.name}</p>
              {selectedPlan.popular && <Badge>Popular</Badge>}
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
                        {formatCurrency(pricing.meetingRoomHoursPrice, 'NPR')}
                      </span>
                    </div>
                  )}

                  {bookingData.guestPasses > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Guest Passes ({bookingData.guestPasses})
                      </span>
                      <span className="font-medium">
                        {formatCurrency(pricing.guestPassesPrice, 'NPR')}
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
              {selectedPlan.name} ({billingLabel})
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

          {pricing.discountAmount && pricing.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Online Discount (5%)</span>
              <span>
                - {formatCurrency(pricing.discountAmount, 'NPR')}
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

        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pb-2">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-green-600" />
            <span>Instant Confirmation</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-primary" />
            <span>Secure Payment</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Great choice!</strong> You're saving {formatCurrency(pricing.discountAmount || 0, 'NPR')} by booking online today.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

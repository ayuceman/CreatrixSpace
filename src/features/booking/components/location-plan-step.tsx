import { MapPin, Star, Users, Loader2, AlertCircle, DoorOpen } from 'lucide-react'
import { useBookingStore } from '@/store/booking-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { formatCurrency, cn } from '@/lib/utils'

const ROOM_IMAGE_FALLBACKS: Record<string, string> = {
  sun: '',
}

export function LocationPlanStep() {
  const {
    bookingData,
    locations,
    getRoomsForLocation,
    plans,
    updateBookingData,
    nextStep,
    canProceed,
    loading,
    error,
    loadAllData,
    getPlanPricingForLocation,
  } = useBookingStore()

  const handleLocationChange = (locationId: string) => {
    updateBookingData({ locationId })
  }

  const handleRoomChange = (roomId: string) => {
    updateBookingData({ roomId })
  }

  const handlePlanChange = (planId: string) => {
    updateBookingData({ planId })
  }

  const selectedLocation = locations.find(l => l.id === bookingData.locationId)
  const selectedPlan = plans.find(p => p.id === bookingData.planId)
  const selectedPlanPricing = selectedPlan
    ? getPlanPricingForLocation(selectedPlan.id, bookingData.locationId, bookingData.roomId)
    : undefined
  const locationRooms = getRoomsForLocation(bookingData.locationId)
  const requiresRoomSelection = locationRooms.length > 0
  const selectedRoom = locationRooms.find((room) => room.id === bookingData.roomId)

  // Compute room status message from database
  const bookedRooms = locationRooms.filter((r) => r.status === 'booked')
  const availableRooms = locationRooms.filter((r) => r.status === 'available')
  const roomStatusMessage = (() => {
    if (bookedRooms.length === 0 && availableRooms.length > 0) {
      return 'All rooms are available for booking.'
    }
    if (bookedRooms.length > 0 && availableRooms.length > 0) {
      const bookedNames = bookedRooms.map((r) => r.name).join(', ')
      const availableNames = availableRooms.map((r) => r.name).join(', ')
      return `${bookedNames} ${bookedRooms.length === 1 ? 'is' : 'are'} currently booked. ${availableNames} ${availableRooms.length === 1 ? 'is' : 'are'} open.`
    }
    if (bookedRooms.length > 0) {
      const bookedNames = bookedRooms.map((r) => r.name).join(', ')
      return `${bookedNames} ${bookedRooms.length === 1 ? 'is' : 'are'} currently booked.`
    }
    return ''
  })()

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading locations and plans...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div className="text-center">
                <h3 className="font-medium mb-2">Failed to load data</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={loadAllData} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
          {locations.length === 0 ? (
            <div className="p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-2">No locations available</p>
              <p className="text-sm text-muted-foreground">
                Please add locations in your Supabase database or check your connection.
              </p>
            </div>
          ) : (
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
                        {location.popular && (
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
          )}
        </CardContent>
      </Card>

      {/* Room Selection */}
      {requiresRoomSelection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DoorOpen className="h-5 w-5 mr-2" />
              Choose Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {locationRooms.map((room) => {
                const isSelected = bookingData.roomId === room.id
                const isUnavailable = room.status !== 'available'
                // Prioritize database imageUrl - use it if it exists and is not empty
                // Only use fallback if database doesn't have an image URL
                const roomImage = (room.imageUrl && room.imageUrl.trim() !== '')
                  ? room.imageUrl
                  : ROOM_IMAGE_FALLBACKS[room.slug?.toLowerCase() || room.name.toLowerCase()]
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => !isUnavailable && handleRoomChange(room.id)}
                    disabled={isUnavailable}
                    className={cn(
                      'text-left rounded-xl border transition-all p-4 flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                      isSelected ? 'border-primary shadow-lg ring-1 ring-primary/30' : 'hover:border-primary/40',
                      isUnavailable ? 'opacity-60 cursor-not-allowed bg-muted/40' : ''
                    )}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      {roomImage ? (
                        <img
                          src={roomImage}
                          alt={room.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                          Image coming soon
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{room.name}</h3>
                        {room.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {room.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          room.status === 'available'
                            ? isSelected
                              ? 'default'
                              : 'secondary'
                            : 'destructive'
                        }
                      >
                        {room.status === 'available'
                          ? isSelected
                            ? 'Selected'
                            : 'Available'
                          : room.status === 'booked'
                            ? 'Booked'
                            : 'Maintenance'}
                      </Badge>
                    </div>

                    {(room.tags || room.amenities)?.length ? (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(room.tags || room.amenities || []).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {room.size && (
                      <p className="text-xs text-muted-foreground mt-3">Approx. {room.size}</p>
                    )}
                  </button>
                )
              })}
            </div>

            {locationRooms.length > 0 && roomStatusMessage && (
              <p className="text-xs text-muted-foreground mt-4">
                Room pricing automatically adjusts plan totals. {roomStatusMessage}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Choose Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requiresRoomSelection && !bookingData.roomId && (
            <p className="mb-4 text-sm text-amber-600">
              Choose an available room above to unlock plan-specific pricing for this location.
            </p>
          )}
          {plans.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-2">No plans available</p>
              <p className="text-sm text-muted-foreground">
                Please add plans in your Supabase database or check your connection.
              </p>
            </div>
          ) : (
            <RadioGroup
              value={bookingData.planId}
              onValueChange={handlePlanChange}
              className="space-y-4"
            >
              {plans.map((plan) => {
                const locationPricing = getPlanPricingForLocation(
                  plan.id,
                  bookingData.locationId,
                  bookingData.roomId
                )
                const isDayPass = plan.type === 'day_pass'
                const primaryPrice = isDayPass
                  ? locationPricing.daily || plan.pricing.daily
                  : locationPricing.monthly || plan.pricing.monthly || locationPricing.weekly || plan.pricing.weekly || locationPricing.annual || plan.pricing.annual
                const period = isDayPass
                  ? 'day'
                  : locationPricing.monthly
                    ? 'month'
                    : locationPricing.weekly
                      ? 'week'
                      : locationPricing.annual
                        ? 'year'
                        : 'month'
                const isAvailable = plan.available !== false
                const planDisabled = !isAvailable || (requiresRoomSelection && !bookingData.roomId)

                return (
                  <div
                    key={plan.id}
                    className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${planDisabled ? 'opacity-60 bg-muted/30 cursor-not-allowed' : 'hover:bg-muted/50'
                      }`}
                  >
                    <RadioGroupItem
                      value={plan.id}
                      id={plan.id}
                      disabled={planDisabled}
                    />
                    <Label
                      htmlFor={plan.id}
                      className={`flex-1 ${planDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
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
                          {!isAvailable && plan.status && (
                            <Badge className="mb-2 bg-orange-500 hover:bg-orange-600 text-white">
                              {plan.status}
                            </Badge>
                          )}
                          {plan.type === 'day_pass' && plan.pricing.daily && (
                            <div className="mb-1 flex items-center justify-end gap-2">
                              <Badge className="bg-green-500 hover:bg-green-600 text-white">Promo</Badge>
                              <span className="text-xs text-muted-foreground line-through">
                                {formatCurrency(100000, 'NPR')}
                              </span>
                            </div>
                          )}
                          <div className="font-bold text-lg">
                            {primaryPrice ? formatCurrency(primaryPrice, 'NPR') : 'Contact sales'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per {period}
                          </div>
                          {!isDayPass && locationPricing.weekly && locationPricing.monthly && (
                            <div className="text-xs text-muted-foreground">
                              Weekly: {formatCurrency(locationPricing.weekly, 'NPR')}
                            </div>
                          )}
                          {!isDayPass && locationPricing.annual && (
                            <div className="text-xs text-green-600">
                              Annual: {formatCurrency(locationPricing.annual, 'NPR')}
                            </div>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          )}
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
              {selectedRoom && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room:</span>
                  <span className="font-medium">{selectedRoom.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">
                  {formatCurrency(
                    (selectedPlan?.type === 'day_pass'
                      ? selectedPlanPricing?.daily || selectedPlan?.pricing.daily || 0
                      : selectedPlanPricing?.monthly ||
                      selectedPlan?.pricing.monthly ||
                      selectedPlanPricing?.weekly ||
                      selectedPlan?.pricing.weekly ||
                      0),
                    'NPR'
                  )}
                  /{selectedPlan?.type === 'day_pass'
                    ? 'day'
                    : selectedPlanPricing?.monthly || selectedPlan?.pricing.monthly
                      ? 'month'
                      : selectedPlanPricing?.weekly || selectedPlan?.pricing.weekly
                        ? 'week'
                        : 'day'}
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

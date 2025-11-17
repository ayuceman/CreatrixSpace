import { Plus, Minus, Gift, Clock, Home, Phone } from 'lucide-react'
import { useBookingStore } from '@/store/booking-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils'
import { getMeetingRoomHourPrice, getGuestPassPrice } from '@/lib/pricing-calculator'

const addonIcons = {
  'meeting-room-hours': Clock,
  'guest-passes': Gift,
  'virtual-office': Home,
  'phone-line': Phone,
}

export function AddOnsStep() {
  const {
    bookingData,
    addOns,
    updateBookingData,
    nextStep,
    prevStep,
  } = useBookingStore()

  const handleAddonToggle = (addonId: string, checked: boolean) => {
    const currentAddOns = bookingData.addOns
    const newAddOns = checked
      ? [...currentAddOns, addonId]
      : currentAddOns.filter(id => id !== addonId)
    
    updateBookingData({ addOns: newAddOns })
  }

  const handleMeetingRoomHoursChange = (increment: boolean) => {
    const current = bookingData.meetingRoomHours
    const newValue = increment ? current + 1 : Math.max(0, current - 1)
    updateBookingData({ meetingRoomHours: newValue })
  }

  const handleGuestPassesChange = (increment: boolean) => {
    const current = bookingData.guestPasses
    const newValue = increment ? current + 1 : Math.max(0, current - 1)
    updateBookingData({ guestPasses: newValue })
  }

  const handleNotesChange = (notes: string) => {
    updateBookingData({ notes })
  }

  return (
    <div className="space-y-8">
      {/* Add-ons Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Add-on Services</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enhance your workspace experience with our additional services
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Regular Add-ons */}
          <div className="space-y-4">
            {addOns.filter(addon => 
              !['meeting-room-hours', 'guest-passes'].includes(addon.id)
            ).map((addon) => {
              const Icon = addonIcons[addon.id as keyof typeof addonIcons]
              const isSelected = bookingData.addOns.includes(addon.id)

              return (
                <div 
                  key={addon.id}
                  className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={addon.id}
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handleAddonToggle(addon.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={addon.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {Icon && <Icon className="h-5 w-5 text-primary" />}
                        <div>
                          <h3 className="font-medium">{addon.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {addon.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {formatCurrency(addon.price, 'NPR')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          /month
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              )
            })}
          </div>

          {/* Meeting Room Hours */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Extra Meeting Room Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Additional meeting room access beyond your plan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {formatCurrency(getMeetingRoomHourPrice(), 'NPR')}
                </div>
                <div className="text-sm text-muted-foreground">
                  /hour
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMeetingRoomHoursChange(false)}
                disabled={bookingData.meetingRoomHours === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">
                {bookingData.meetingRoomHours}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMeetingRoomHoursChange(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
          </div>

          {/* Guest Passes */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Gift className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Guest Day Passes</h3>
                  <p className="text-sm text-muted-foreground">
                    Bring colleagues and clients to work with you
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {formatCurrency(getGuestPassPrice(), 'NPR')}
                </div>
                <div className="text-sm text-muted-foreground">
                  /day per guest
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGuestPassesChange(false)}
                disabled={bookingData.guestPasses === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">
                {bookingData.guestPasses}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGuestPassesChange(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">passes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Special Requirements</CardTitle>
          <p className="text-sm text-muted-foreground">
            Any specific needs or requests? (Optional)
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Tell us about any special requirements, accessibility needs, or preferences..."
            value={bookingData.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Add-ons Summary */}
      {(bookingData.addOns.length > 0 || 
        bookingData.meetingRoomHours > 0 || 
        bookingData.guestPasses > 0) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Selected Add-ons</h3>
            <div className="space-y-2 text-sm">
              {bookingData.addOns.map(addonId => {
                const addon = addOns.find(a => a.id === addonId)
                if (!addon) return null
                
                return (
                  <div key={addonId} className="flex justify-between">
                    <span className="text-muted-foreground">{addon.name}:</span>
                    <span className="font-medium">
                      {formatCurrency(addon.price, 'NPR')}/month
                    </span>
                  </div>
                )
              })}

              {bookingData.meetingRoomHours > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Meeting Room Hours ({bookingData.meetingRoomHours}):
                  </span>
                  <span className="font-medium">
                    {formatCurrency(getMeetingRoomHourPrice() * bookingData.meetingRoomHours, 'NPR')}
                  </span>
                </div>
              )}

              {bookingData.guestPasses > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Guest Passes ({bookingData.guestPasses}):
                  </span>
                  <span className="font-medium">
                    {formatCurrency(getGuestPassPrice() * bookingData.guestPasses, 'NPR')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>
          Continue to Contact Info
        </Button>
      </div>
    </div>
  )
}

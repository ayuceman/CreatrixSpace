import { Calendar, Clock } from 'lucide-react'
import { useBookingStore } from '@/store/booking-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function DateTimeStep() {
  const {
    bookingData,
    plans,
    updateBookingData,
    nextStep,
    prevStep,
    canProceed,
  } = useBookingStore()

  const selectedPlan = plans.find(p => p.id === bookingData.planId)
  const isDayPass = selectedPlan?.type === 'day_pass'

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const date = value ? new Date(value) : null
    const updates: Partial<typeof bookingData> = { [field]: date }
    
    // For day passes, automatically set endDate to the same as startDate
    if (field === 'startDate' && isDayPass && date) {
      updates.endDate = date
    }
    
    updateBookingData(updates)
  }

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    updateBookingData({ [field]: value })
  }

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  // Get minimum date (today)
  const today = new Date()
  const minDate = today.toISOString().split('T')[0]

  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Select Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">
                {isDayPass ? 'Date' : 'Start Date'}
              </Label>
              <Input
                id="start-date"
                type="date"
                min={minDate}
                value={formatDateForInput(bookingData.startDate)}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
              />
            </div>

            {!isDayPass && (
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  min={formatDateForInput(bookingData.startDate) || minDate}
                  value={formatDateForInput(bookingData.endDate)}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                />
              </div>
            )}
          </div>

          {isDayPass && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Day Pass:</strong> Your access will be valid for the selected date from 6:00 AM to 10:00 PM.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Selection - Only for non-day passes */}
      {!isDayPass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> Our spaces are available 24/7 for dedicated desk and private office members. 
                Hot desk access is available during business hours (6:00 AM - 10:00 PM).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Summary */}
      {bookingData.startDate && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Schedule Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {isDayPass ? 'Date:' : 'Start Date:'}
                </span>
                <span className="font-medium">
                  {bookingData.startDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {!isDayPass && bookingData.endDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span className="font-medium">
                    {bookingData.endDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {!isDayPass && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours:</span>
                  <span className="font-medium">
                    {bookingData.startTime} - {bookingData.endTime}
                  </span>
                </div>
              )}

              {isDayPass && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Access Hours:</span>
                  <span className="font-medium">6:00 AM - 10:00 PM</span>
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
        <Button 
          onClick={nextStep}
          disabled={!canProceed()}
        >
          Continue to Add-ons
        </Button>
      </div>
    </div>
  )
}

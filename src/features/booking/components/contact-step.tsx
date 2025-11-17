import { User, Mail, Phone, Building } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useBookingStore } from '@/store/booking-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService, profileService } from '@/services/supabase-service'

export function ContactStep() {
  const navigate = useNavigate()
  const {
    bookingData,
    updateBookingData,
    prevStep,
    canProceed,
  } = useBookingStore()

  // Pre-fill contact info from profile if user is authenticated (optional)
  useEffect(() => {
    const prefillContactInfo = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          const profile = await profileService.getCurrentProfile()
          if (profile && !bookingData.contactInfo.email) {
            updateBookingData({
              contactInfo: {
                firstName: profile.first_name || bookingData.contactInfo.firstName,
                lastName: profile.last_name || bookingData.contactInfo.lastName,
                email: profile.email || bookingData.contactInfo.email,
                phone: profile.phone || bookingData.contactInfo.phone,
                company: profile.company || bookingData.contactInfo.company,
              }
            })
          }
        }
      } catch {
        // Not authenticated - that's fine, user can fill manually
      }
    }
    prefillContactInfo()
  }, [])

  // Recalculate total when component mounts (ensures add-ons are included)
  useEffect(() => {
    useBookingStore.getState().calculateTotal()
  }, [])

  const handleContactInfoChange = (field: string, value: string) => {
    updateBookingData({
      contactInfo: {
        ...bookingData.contactInfo,
        [field]: value,
      }
    })
  }

  const handleSubmit = () => {
    if (!canProceed()) return

    // Just navigate to the payment page.
    // Booking will be created only after QR payment is verified.
    useBookingStore.getState().calculateTotal()
    navigate('/payment')
  }

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Contact Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Please provide your contact details to complete the booking
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={bookingData.contactInfo.firstName}
                onChange={(e) => handleContactInfoChange('firstName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={bookingData.contactInfo.lastName}
                onChange={(e) => handleContactInfoChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={bookingData.contactInfo.email}
              onChange={(e) => handleContactInfoChange('email', e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              We'll send your booking confirmation to this email
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+977 9851357889"
              value={bookingData.contactInfo.phone}
              onChange={(e) => handleContactInfoChange('phone', e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              For booking confirmations and important updates
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Company/Organization (Optional)
            </Label>
            <Input
              id="company"
              placeholder="Your Company Name"
              value={bookingData.contactInfo.company}
              onChange={(e) => handleContactInfoChange('company', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-medium">Terms and Conditions</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                By proceeding with this booking, you agree to our{' '}
                <a href="/terms" className="text-primary hover:underline" target="_blank">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:underline" target="_blank">
                  Privacy Policy
                </a>.
              </p>
              
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Cancellation Policy:</strong> Cancel up to 24 hours before your booking for a full refund.
                </li>
                <li>
                  <strong>Access:</strong> You'll receive access instructions via email after payment confirmation.
                </li>
                <li>
                  <strong>Amenities:</strong> All listed amenities are included in your booking.
                </li>
                <li>
                  <strong>Guest Policy:</strong> Guests must be registered and accompanied by members.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Summary */}
      {bookingData.contactInfo.firstName && bookingData.contactInfo.email && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Contact Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">
                  {bookingData.contactInfo.firstName} {bookingData.contactInfo.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{bookingData.contactInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{bookingData.contactInfo.phone}</span>
              </div>
              {bookingData.contactInfo.company && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium">{bookingData.contactInfo.company}</span>
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
          onClick={handleSubmit}
          disabled={!canProceed()}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}

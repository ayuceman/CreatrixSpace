import { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Calendar, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PaymentMethod } from '@/lib/payment-config'
import { formatCurrency } from '@/lib/utils'
import { useBookingStore } from '@/store/booking-store'

interface PaymentBookingSummaryProps {
  bookingData: any
  onPaymentMethodSelect: (method: PaymentMethod) => void
  isProcessing?: boolean
}

const paymentMethods = [
  {
    id: 'esewa' as PaymentMethod,
    name: 'eSewa',
    logo: '🟢',
    fees: 'No additional fees',
  },
  {
    id: 'khalti' as PaymentMethod,
    name: 'Khalti',
    logo: '🟣',
    fees: 'No additional fees',
  },
  {
    id: 'stripe' as PaymentMethod,
    name: 'Credit/Debit Card',
    logo: '💳',
    fees: '3.5% + NPR 10',
  },
  {
    id: 'qr_payment' as PaymentMethod,
    name: 'QR Payment',
    logo: '📱',
    fees: 'No additional fees',
  },
  {
    id: 'bank_transfer' as PaymentMethod,
    name: 'Bank Transfer',
    logo: '🏦',
    fees: 'Bank charges may apply',
  },
]

export function PaymentBookingSummary({
  bookingData,
  onPaymentMethodSelect,
  isProcessing = false,
}: PaymentBookingSummaryProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qr_payment')
  const { locations, plans, addOns } = useBookingStore()

  // Listen to parent payment method selection
  useEffect(() => {
    const handlePaymentMethodChange = (event: CustomEvent) => {
      setSelectedMethod(event.detail.method)
    }

    window.addEventListener('paymentMethodChanged', handlePaymentMethodChange as EventListener)
    
    return () => {
      window.removeEventListener('paymentMethodChanged', handlePaymentMethodChange as EventListener)
    }
  }, [])

  const calculateFees = (method: PaymentMethod, amount: number) => {
    switch (method) {
      case 'stripe':
        return Math.round(amount * 0.035) + 1000 // 3.5% + NPR 10
      case 'esewa':
      case 'khalti':
      case 'qr_payment':
        return 0
      case 'bank_transfer':
        return 0
      default:
        return 0
    }
  }

  const baseAmount = bookingData.totalAmount || 0
  const fees = calculateFees(selectedMethod, baseAmount)
  const totalAmount = baseAmount + fees
  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod)

  const handleProceedToPayment = () => {
    onPaymentMethodSelect(selectedMethod)
  }

  // Get actual booking data from store
  const selectedLocation = locations.find(l => l.id === bookingData.locationId)
  const selectedPlan = plans.find(p => p.id === bookingData.planId)
  
  // Format dates
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  // Calculate duration
  const getDuration = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 'Not set'
    const diffTime = Math.abs(bookingData.endDate.getTime() - bookingData.startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 7) return `${diffDays} Day${diffDays > 1 ? 's' : ''}`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} Week${Math.floor(diffDays / 7) > 1 ? 's' : ''}`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} Month${Math.floor(diffDays / 30) > 1 ? 's' : ''}`
    return `${Math.floor(diffDays / 365)} Year${Math.floor(diffDays / 365) > 1 ? 's' : ''}`
  }

  // Get add-ons names
  const getAddOnsList = () => {
    const addOnsList: string[] = []
    
    // Regular add-ons
    bookingData.addOns.forEach(addonId => {
      const addon = addOns.find(a => a.id === addonId)
      if (addon) addOnsList.push(addon.name)
    })
    
    // Meeting room hours
    if (bookingData.meetingRoomHours > 0) {
      addOnsList.push(`Extra Meeting Room (${bookingData.meetingRoomHours} hour${bookingData.meetingRoomHours > 1 ? 's' : ''})`)
    }
    
    // Guest passes
    if (bookingData.guestPasses > 0) {
      addOnsList.push(`Guest Day Pass (${bookingData.guestPasses} day${bookingData.guestPasses > 1 ? 's' : ''})`)
    }
    
    return addOnsList
  }

  // Plan features (based on plan type)
  const getPlanFeatures = () => {
    const features: string[] = ['High-speed internet', 'Coffee & tea']
    
    if (selectedPlan?.type === 'hot_desk' || selectedPlan?.type === 'dedicated_desk') {
      features.push('Meeting room credits', 'Locker access')
    }
    
    return features
  }

  return (
    <div className="space-y-4">
      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Location & Plan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{selectedLocation?.name || 'Location not selected'}</span>
              </div>
              <Badge variant="outline">{selectedPlan?.name || 'Plan not selected'}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Duration</span>
              </div>
              <span className="text-sm font-medium">{getDuration()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Period</span>
              </div>
              <span className="text-sm font-medium">
                {formatDate(bookingData.startDate)} - {formatDate(bookingData.endDate)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Features Included */}
          <div>
            <h4 className="font-medium mb-1 text-sm">Included Features</h4>
            <div className="grid grid-cols-2 gap-1">
              {getPlanFeatures().map((feature, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          {getAddOnsList().length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-1 text-sm">Add-ons</h4>
                <div className="space-y-0.5">
                  {getAddOnsList().map((addOn, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      <span className="text-xs text-muted-foreground">{addOn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Selected Payment Method */}
          {selectedPaymentMethod && (
            <div className="p-3 bg-white border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-lg">{selectedPaymentMethod.logo}</div>
                <span className="font-medium text-sm">
                  {selectedPaymentMethod.name}
                </span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  Selected
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedPaymentMethod.fees}
              </p>
              {selectedPaymentMethod.id === 'bank_transfer' && (
                <p className="text-xs text-orange-700 mt-1">
                  ⚠️ Manual verification required
                </p>
              )}
              {selectedPaymentMethod.id === 'qr_payment' && (
                <p className="text-xs text-blue-700 mt-1">
                  📱 QR scan + receipt upload required
                </p>
              )}
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking Amount:</span>
              <span className="font-medium">
                {formatCurrency(baseAmount, 'NPR')}
              </span>
            </div>

            {fees > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Payment Gateway Fees:
                </span>
                <span className="font-medium">
                  {formatCurrency(fees, 'NPR')}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span className="text-primary text-lg">
                {formatCurrency(totalAmount, 'NPR')}
              </span>
            </div>
          </div>

          {/* Proceed Button */}
          <Button
            onClick={handleProceedToPayment}
            disabled={isProcessing}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                Complete Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Secured with 256-bit SSL encryption
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Refund Policy */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <div className="text-blue-600">💡</div>
            <div>
              <h4 className="font-medium text-blue-800 text-xs">
                Flexible Cancellation
              </h4>
              <p className="text-xs text-blue-700">
                24h cancellation. Full refund guaranteed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

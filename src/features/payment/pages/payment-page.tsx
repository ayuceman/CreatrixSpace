import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentGatewaySelector } from '../components/payment-gateway-selector'
import { PaymentBookingSummary } from '../components/payment-booking-summary'
import { QRPayment } from '../components/qr-payment'
import { paymentService } from '@/services/payment-service'
import { PaymentMethod, PaymentData } from '@/lib/payment-config'
import { formatCurrency } from '@/lib/utils'
import { useBookingStore } from '@/store/booking-store'
import {
  authService,
  bookingService,
  manualEntryService,
} from '@/services/supabase-service'

type PaymentStatus =
  | 'selecting'
  | 'processing'
  | 'success'
  | 'error'
  | 'pending'
  | 'qr_payment'

async function persistBooking(data: Record<string, any>) {
  try {
    await manualEntryService.addEntry({ entryType: 'booking', data })
  } catch {
    /* localStorage still works as fallback */
  }
}

async function persistMembership(data: Record<string, any>) {
  try {
    await manualEntryService.addEntry({ entryType: 'membership', data })
  } catch {
    /* localStorage still works as fallback */
  }
}

export function PaymentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const store = useBookingStore()
  const bookingData = store.bookingData

  const createBookingDirect = async (paymentMethod?: string) => {
    try {
      store.calculateTotal()
      const data = store.bookingData
      if (!data.locationId || !data.planId || !data.startDate) {
        console.error('Booking missing required fields:', {
          locationId: data.locationId,
          planId: data.planId,
          startDate: data.startDate,
        })
        return null
      }
      let userId: string | null = null
      try {
        const user = await authService.getCurrentUser()
        userId = user?.id || null
      } catch {
        // guest
      }
      const booking = await bookingService.createBooking(
        { ...data, paymentMethod },
        userId
      )
      console.log('Booking created:', booking.id)
      return booking.id
    } catch (e) {
      console.error('createBookingDirect failed:', e)
      return null
    }
  }

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('selecting')
  const [paymentResult, setPaymentResult] = useState<{
    success?: boolean
    transactionId?: string
    amount?: number
    paymentId?: string
    error?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fallbackId] = useState(() => `BK-${Date.now()}`)

  // Calculate the actual total amount (same logic as payment summary)
  const calculateTotalAmount = (method: PaymentMethod) => {
    const baseAmount = bookingData.totalAmount || 0
    let fees = 0

    // Calculate fees based on payment method
    switch (method) {
      case 'stripe':
        fees = Math.round(baseAmount * 0.035) + 1000 // 3.5% + NPR 10
        break
      case 'esewa':
      case 'khalti':
      case 'qr_payment':
      case 'bank_transfer':
        fees = 0
        break
    }

    return baseAmount + fees
  }

  const handlePaymentCallback = useCallback(async () => {
    setPaymentStatus('processing')

    try {
      const oid = searchParams.get('oid')
      const amt = searchParams.get('amt')
      const refId = searchParams.get('refId')
      const token = searchParams.get('token')
      const amount = searchParams.get('amount')

      let result
      let callbackMethod: string | undefined
      if (oid && amt && refId) {
        // eSewa callback
        callbackMethod = 'esewa'
        result = await paymentService.verifyPayment('esewa', {
          oid,
          amt,
          refId,
        })
      } else if (token && amount) {
        // Khalti callback
        callbackMethod = 'khalti'
        result = await paymentService.verifyPayment('khalti', { token, amount })
      }

      if (result?.success) {
        setPaymentStatus('success')
        setPaymentResult(result)

        try {
          const bookingId = await createBookingDirect(callbackMethod)
          if (bookingId) {
            localStorage.setItem('lastBookingId', bookingId)
          }
        } catch (e) {
          console.error('createBooking failed:', e)
        }

        const bookingEntry = {
          id: result.paymentId || `BK-${Date.now()}`,
          customerName:
            bookingData.contactInfo?.firstName &&
            bookingData.contactInfo?.lastName
              ? `${bookingData.contactInfo.firstName} ${bookingData.contactInfo.lastName}`
              : 'Customer',
          email: bookingData.contactInfo?.email,
          phone: bookingData.contactInfo?.phone,
          locationName: bookingData.locationId || 'Location',
          planName: bookingData.planId || 'Plan',
          amount: result.amount,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        }
        persistBooking(bookingEntry)

        if (bookingData.planId && bookingData.planId !== 'explorer') {
          const startDate = bookingData.startDate || new Date()
          const billingCycle =
            bookingData.planId === 'explorer' ? 'daily' : 'monthly'
          const endDate = new Date(startDate)
          if (billingCycle === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1)
          } else {
            endDate.setDate(endDate.getDate() + 1)
          }
          persistMembership({
            id: `MEM-${Date.now()}`,
            customerName:
              bookingData.contactInfo?.firstName &&
              bookingData.contactInfo?.lastName
                ? `${bookingData.contactInfo.firstName} ${bookingData.contactInfo.lastName}`
                : 'Customer',
            email: bookingData.contactInfo?.email,
            phone: bookingData.contactInfo?.phone,
            membershipType: bookingData.planId,
            status: 'active',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            amount: result.amount,
            billingCycle,
            locationId: bookingData.locationId,
            autoRenew: false,
            createdAt: new Date().toISOString(),
          })
        }
      } else {
        setPaymentStatus('error')
        setError(result?.error || 'Payment verification failed')
      }
    } catch {
      setPaymentStatus('error')
      setError('Payment verification failed')
    }
  }, [bookingData, searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Check if coming from a payment callback
  useEffect(() => {
    const oid = searchParams.get('oid')
    const token = searchParams.get('token')

    if (oid || token) {
      handlePaymentCallback()
    }
  }, [handlePaymentCallback, searchParams])

  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    setPaymentStatus('processing')
    setError(null)

    try {
      // Calculate total amount including fees for this payment method
      const totalAmount = calculateTotalAmount(method)

      // Prepare payment data
      const paymentData: PaymentData = {
        amount: totalAmount,
        currency: 'NPR',
        bookingId: `BK-${Date.now()}`,
        customerInfo: {
          name:
            bookingData.contactInfo?.firstName &&
            bookingData.contactInfo?.lastName
              ? `${bookingData.contactInfo.firstName} ${bookingData.contactInfo.lastName}`
              : 'Test User',
          email: bookingData.contactInfo?.email || 'test@example.com',
          phone: bookingData.contactInfo?.phone || '+977 9700045256',
        },
        metadata: {
          locationId: bookingData.locationId || 'thamel-hub',
          planId: bookingData.planId || 'hot-desk',
          startDate: bookingData.startDate || new Date().toISOString(),
          endDate:
            bookingData.endDate ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      }

      const result = await paymentService.processPayment(method, paymentData)

      if (method === 'esewa' || method === 'khalti') {
        // These methods redirect, so we set pending status
        setPaymentStatus('pending')
      } else if (method === 'bank_transfer') {
        const bankResult = {
          ...result,
          transactionId: result.transactionId || `BANK-${Date.now()}`,
        }
        setPaymentStatus('success')
        setPaymentResult(bankResult)

        try {
          const bookingId = await createBookingDirect('bank_transfer')
          if (bookingId) localStorage.setItem('lastBookingId', bookingId)
        } catch (e) {
          console.error('createBooking failed:', e)
        }

        const bankEntry = {
          id: result.paymentId || `BK-${Date.now()}`,
          customerName: paymentData.customerInfo.name,
          email: paymentData.customerInfo.email,
          phone: paymentData.customerInfo.phone,
          locationName: paymentData.metadata?.locationId,
          planName: paymentData.metadata?.planId,
          amount: result.amount,
          status: 'pending_verification',
          createdAt: new Date().toISOString(),
        }
        persistBooking(bankEntry)
      } else if (method === 'qr_payment') {
        setPaymentStatus('qr_payment')
        setPaymentResult(result)
      } else if (result.success) {
        setPaymentStatus('success')
        setPaymentResult(result)

        try {
          const bookingId = await createBookingDirect(method)
          if (bookingId) localStorage.setItem('lastBookingId', bookingId)
        } catch (e) {
          console.error('createBooking failed:', e)
        }

        const stripeEntry = {
          id: result.paymentId || `BK-${Date.now()}`,
          customerName: paymentData.customerInfo.name,
          email: paymentData.customerInfo.email,
          phone: paymentData.customerInfo.phone,
          locationName: paymentData.metadata?.locationId,
          planName: paymentData.metadata?.planId,
          amount: result.amount,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        }
        persistBooking(stripeEntry)
      } else {
        setPaymentStatus('error')
        setError(result.error || 'Payment failed')
      }
    } catch (e) {
      setPaymentStatus('error')
      setError(e instanceof Error ? e.message : 'Payment failed')
    }
  }

  const handleBackToBooking = () => {
    navigate('/booking')
  }

  const handleQRPaymentComplete = async (result: any) => {
    if (result.success) {
      try {
        // Create booking in database only after QR payment verification
        const bookingId = await createBookingDirect('qr_payment')

        if (bookingId) {
          localStorage.setItem('lastBookingId', bookingId)
        }

        setPaymentStatus('success')
        setPaymentResult({ ...result, bookingId })
      } catch (e) {
        console.error('Failed to create booking after QR verification:', e)
        setPaymentStatus('error')
        setError(
          'Booking could not be created after payment verification. Please try again.'
        )
      }
    } else {
      setPaymentStatus('error')
      setError(result.error || 'QR payment verification failed')
    }
  }

  const handleQRPaymentCancel = () => {
    setPaymentStatus('selecting')
    setPaymentResult(null)
  }

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'qr_payment':
        return (
          <div className="min-h-screen bg-bg-band/30">
            <div className="container py-8">
              <div className="max-w-2xl mx-auto">
                <QRPayment
                  amount={calculateTotalAmount('qr_payment')}
                  bookingId={
                    bookingData.bookingId ||
                    paymentResult?.paymentId ||
                    fallbackId
                  }
                  onPaymentComplete={handleQRPaymentComplete}
                  onCancel={handleQRPaymentCancel}
                />
              </div>
            </div>
          </div>
        )

      case 'processing':
        return (
          <Card className="text-center">
            <CardContent className="py-12">
              <Clock className="h-16 w-16 mx-auto text-blue-500 mb-4 animate-spin" />
              <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
              <p className="text-fg-2">
                Please wait while we process your payment...
              </p>
            </CardContent>
          </Card>
        )

      case 'pending':
        return (
          <Card className="text-center">
            <CardContent className="py-12">
              <Clock className="h-16 w-16 mx-auto text-orange-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Redirected</h2>
              <p className="text-fg-2 mb-4">
                You have been redirected to the payment gateway. Complete your
                payment to confirm your booking.
              </p>
              <Button variant="outline" onClick={handleBackToBooking}>
                Return to Booking
              </Button>
            </CardContent>
          </Card>
        )

      case 'success':
        return (
          <Card className="text-center border-green-200">
            <CardContent className="py-12">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Payment Successful!
              </h2>
              <p className="text-fg-2 mb-6">
                Your booking has been confirmed. You'll receive a confirmation
                email shortly.
              </p>

              {paymentResult && (
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-center space-x-8">
                    <div>
                      <span className="text-fg-2">Transaction ID:</span>
                      <span className="font-mono ml-2">
                        {paymentResult.transactionId}
                      </span>
                    </div>
                    <div>
                      <span className="text-fg-2">Amount:</span>
                      <span className="font-medium ml-2">
                        {formatCurrency(paymentResult.amount ?? 0, 'NPR')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/dashboard')}>
                  View Booking
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'error':
        return (
          <Card className="text-center border-red-200">
            <CardContent className="py-12">
              <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                Payment Failed
              </h2>
              <p className="text-fg-2 mb-4">
                {error ||
                  'Something went wrong with your payment. Please try again.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setPaymentStatus('selecting')}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleBackToBooking}>
                  Back to Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (paymentStatus !== 'selecting') {
    return (
      <div className="min-h-screen bg-bg-band/30">
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">{renderPaymentStatus()}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-band/30">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="sm" onClick={handleBackToBooking}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-normal mb-2">
            Complete Your Payment
          </h1>
          <p className="text-fg-2">
            Choose your preferred payment method to confirm your booking
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Payment Methods */}
            <div className="lg:col-span-3">
              <PaymentGatewaySelector
                onPaymentMethodSelect={handlePaymentMethodSelect}
              />
            </div>

            {/* Right Column - Booking Summary & Action */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <PaymentBookingSummary
                  bookingData={bookingData}
                  onPaymentMethodSelect={handlePaymentMethodSelect}
                  isProcessing={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

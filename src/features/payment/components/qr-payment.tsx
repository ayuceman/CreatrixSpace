import { useState, useRef } from 'react'
import { Upload, Camera, Clock, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PAYMENT_CONFIG } from '@/lib/payment-config'
import { formatCurrency } from '@/lib/utils'
import { useBookingStore } from '@/store/booking-store'
import { sendBookingEmail } from '@/services/email-service'

interface QRPaymentProps {
  amount: number
  bookingId: string
  onPaymentComplete: (result: any) => void
  onCancel: () => void
}

type VerificationStatus = 'pending' | 'uploading' | 'verifying' | 'success' | 'failed'

export function QRPayment({ amount, bookingId, onPaymentComplete, onCancel }: QRPaymentProps) {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { bookingData, locations, plans, addOns, rooms } = useBookingStore()

  const qrConfig = PAYMENT_CONFIG.qrPayment

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      setUploadedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return

    setVerificationStatus('uploading')

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setVerificationStatus('verifying')
      
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock verification result
      const mockResult = {
        success: true,
        extractedData: {
          amount: formatCurrency(amount, 'NPR'),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          transactionId: `TXN${Date.now()}`,
          bankName: 'Nepal Investment Mega Bank',
        },
        confidence: 0.95,
      }

      setVerificationResult(mockResult)
      
      if (mockResult.success && mockResult.confidence > 0.8) {
        setVerificationStatus('success')
        
        // Send email notification to admin when payment is verified
        try {
          // Get location, plan, and room names for email
          const location = locations.find(l => l.id === bookingData.locationId)
          const plan = plans.find(p => p.id === bookingData.planId)
          const room = rooms.find(r => r.id === bookingData.roomId)
          const selectedAddOnNames = bookingData.addOns
            .map(addOnId => {
              const addOn = addOns.find(a => a.id === addOnId)
              return addOn?.name || 'Unknown Add-on'
            })
            .filter(Boolean)
          
          // Send email asynchronously (don't block payment completion)
          sendBookingEmail({
            customerName: `${bookingData.contactInfo.firstName} ${bookingData.contactInfo.lastName}`.trim(),
            customerEmail: bookingData.contactInfo.email,
            customerPhone: bookingData.contactInfo.phone,
            company: bookingData.contactInfo.company || undefined,
            bookingId: bookingData.bookingId || bookingId,
            locationName: location?.name || 'Unknown Location',
            planName: plan?.name || 'Unknown Plan',
            planType: plan?.type || 'unknown',
            roomName: room?.name,
            roomStatus: room?.status,
            startDate: bookingData.startDate ? bookingData.startDate.toISOString() : '',
            endDate: bookingData.endDate ? bookingData.endDate.toISOString() : '',
            startTime: bookingData.startTime || undefined,
            endTime: bookingData.endTime || undefined,
            selectedAddOns: selectedAddOnNames,
            meetingRoomHours: bookingData.meetingRoomHours,
            guestPasses: bookingData.guestPasses,
            totalAmount: bookingData.totalAmount,
            currency: bookingData.currency,
            notes: bookingData.notes || undefined,
            status: 'pending',
            bookingSource: room ? 'Online Checkout (Room Selected)' : 'Online Checkout',
            paymentMethod: 'QR Payment',
            paymentStatus: 'Pending Verification',
          }).catch(error => {
            // Log error but don't fail the payment
            console.error('Failed to send booking email:', error)
          })
        } catch (error) {
          // Log error but don't fail the payment
          console.error('Error preparing email data:', error)
        }
        
        setTimeout(() => {
          onPaymentComplete({
            success: true,
            paymentId: mockResult.extractedData.transactionId,
            method: 'qr_payment',
            amount: amount,
            metadata: mockResult.extractedData,
          })
        }, 1000)
      } else {
        setVerificationStatus('failed')
      }
    } catch (error) {
      setVerificationStatus('failed')
    }
  }

  const handleRetry = () => {
    setVerificationStatus('pending')
    setUploadedFile(null)
    setUploadPreview(null)
    setVerificationResult(null)
  }

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'uploading':
        return (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Uploading screenshot...</p>
          </div>
        )
      
      case 'verifying':
        return (
          <div className="text-center py-4">
            <div className="animate-pulse">
              <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
            </div>
            <p className="text-sm text-muted-foreground">Verifying payment details...</p>
          </div>
        )
      
      case 'success':
        return (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-600">Payment verified successfully!</p>
            {verificationResult && (
              <div className="mt-3 text-xs text-muted-foreground">
                <p>Amount: {verificationResult.extractedData.amount}</p>
                <p>Transaction ID: {verificationResult.extractedData.transactionId}</p>
              </div>
            )}
          </div>
        )
      
      case 'failed':
        return (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-red-600">Verification failed</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please ensure the screenshot is clear and shows the complete payment details
            </p>
            <Button size="sm" variant="outline" onClick={handleRetry} className="mt-2">
              Try Again
            </Button>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">QR Payment</h2>
          <p className="text-sm text-muted-foreground">
            Scan QR code and upload payment screenshot
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Payment Amount */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(amount, 'NPR')}
            </p>
            <p className="text-xs text-muted-foreground">
              Booking ID: {bookingId}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <span>Step 1: Scan QR Code</span>
            <Badge variant="outline" className="ml-2">
              <Clock className="h-3 w-3 mr-1" />
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {/* Company QR Code */}
            <div className="w-64 h-64 mx-auto bg-white border-2 border-gray-300 rounded-lg overflow-hidden p-4">
              <img
                src="/company-qr-code.png"
                alt="Company QR Code for Payment"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center">
                      <div class="text-xs text-center p-4">
                        <p class="text-gray-500">QR Code not found</p>
                        <p class="text-xs text-gray-400 mt-2">Please add company-qr-code.png to public folder</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Scan with your banking app</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Account:</strong> {qrConfig.companyName}</p>
              <p><strong>Bank:</strong> {qrConfig.bankName}</p>
              <p><strong>Amount:</strong> {formatCurrency(amount, 'NPR')}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <p className="text-xs text-yellow-800">
                📝 <strong>Please enter the amount manually:</strong> {formatCurrency(amount, 'NPR')}
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                After scanning, enter this exact amount in your banking app
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Supported Banks:</strong> {qrConfig.supportedBanks.join(', ')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Screenshot Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step 2: Upload Payment Screenshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === 'pending' && (
            <>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload your payment screenshot
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {uploadPreview && (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={uploadPreview}
                      alt="Payment screenshot"
                      className="w-full max-w-sm mx-auto rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setUploadedFile(null)
                        setUploadPreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <Button onClick={handleUpload} disabled={!uploadedFile}>
                      Verify Payment
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {renderVerificationStatus()}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Important:</strong> Ensure your screenshot clearly shows the amount, date/time, 
              transaction ID, and recipient details for successful verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

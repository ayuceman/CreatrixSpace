import { PaymentData, PaymentResult, PaymentMethod, PAYMENT_CONFIG } from '@/lib/payment-config'

// Stripe Payment Service
export class StripePaymentService {
  private stripe: any = null

  async initialize() {
    if (typeof window === 'undefined') return
    
    // Dynamically import Stripe to avoid SSR issues
    const { loadStripe } = await import('@stripe/stripe-js')
    this.stripe = await loadStripe(PAYMENT_CONFIG.stripe.publishableKey)
    
    if (!this.stripe) {
      throw new Error('Failed to initialize Stripe')
    }
  }

  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      if (!this.stripe) await this.initialize()

      // In a real app, you'd call your backend to create a PaymentIntent
      // For demo purposes, we'll simulate the process
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: 'npr',
          customer_info: paymentData.customerInfo,
          booking_id: paymentData.bookingId,
        }),
      })

      const { client_secret } = await response.json()

      const result = await this.stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: {
            // This would typically be collected from a card element
          },
          billing_details: {
            name: paymentData.customerInfo.name,
            email: paymentData.customerInfo.email,
          },
        },
      })

      if (result.error) {
        return {
          success: false,
          method: 'stripe',
          amount: paymentData.amount,
          error: result.error.message,
        }
      }

      return {
        success: true,
        method: 'stripe',
        amount: paymentData.amount,
        paymentId: result.paymentIntent.id,
        transactionId: result.paymentIntent.id,
      }
    } catch (error) {
      return {
        success: false,
        method: 'stripe',
        amount: paymentData.amount,
        error: error instanceof Error ? error.message : 'Payment failed',
      }
    }
  }
}

// eSewa Payment Service
export class ESewaPaymentService {
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const amount = paymentData.amount / 100 // Convert paisa to NPR
      const txAmt = amount
      const psc = PAYMENT_CONFIG.esewa.serviceCharge
      const pdc = PAYMENT_CONFIG.esewa.deliveryCharge
      const tAmt = txAmt + psc + pdc

      // Log payment details for debugging
      console.log('eSewa Payment Details:', {
        amount: txAmt,
        productId: paymentData.bookingId,
        successUrl: PAYMENT_CONFIG.esewa.successUrl,
        failureUrl: PAYMENT_CONFIG.esewa.failureUrl,
        merchantCode: PAYMENT_CONFIG.esewa.merchantCode
      })

      // Method 1: Standard form submission (most reliable)
      const esewaUrl = 'https://uat.esewa.com.np/epay/main'
      
      const fields = {
        amt: txAmt.toFixed(2),
        psc: psc.toFixed(2),
        pdc: pdc.toFixed(2),
        txAmt: txAmt.toFixed(2),
        tAmt: tAmt.toFixed(2),
        pid: paymentData.bookingId,
        scd: PAYMENT_CONFIG.esewa.merchantCode,
        su: PAYMENT_CONFIG.esewa.successUrl,
        fu: PAYMENT_CONFIG.esewa.failureUrl,
      }

      console.log('eSewa Payment Details:', {
        url: esewaUrl,
        fields: fields,
        amount: txAmt,
        bookingId: paymentData.bookingId
      })

      // Create and submit form in a way that ensures it works
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = esewaUrl
      form.style.display = 'none'
      
      // Add all fields
      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value
        form.appendChild(input)
      })

      // Append to body and submit immediately
      document.body.appendChild(form)
      
      // Add a small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        console.log('Submitting eSewa form to:', esewaUrl)
        console.log('Form HTML:', form.outerHTML)
        
        try {
          form.submit()
        } catch (submitError) {
          console.error('Form submission failed:', submitError)
          // Fallback to direct redirect
          const params = new URLSearchParams(fields)
          const fallbackUrl = `${esewaUrl}?${params.toString()}`
          console.log('Trying fallback redirect:', fallbackUrl)
          window.location.href = fallbackUrl
        }
        
        // Cleanup after delay
        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form)
          }
        }, 2000)
      })

      // Since eSewa redirects, we return a pending status
      return {
        success: true, // Will be determined by callback
        method: 'esewa',
        amount: paymentData.amount,
        paymentId: paymentData.bookingId,
        metadata: { redirected: true },
      }
    } catch (error) {
      console.error('eSewa Payment Error:', error)
      return {
        success: false,
        method: 'esewa',
        amount: paymentData.amount,
        error: error instanceof Error ? error.message : 'eSewa payment failed',
      }
    }
  }

  // Verify eSewa payment (called from success callback)
  async verifyPayment(
    oid: string, 
    amt: string, 
    refId: string
  ): Promise<PaymentResult> {
    try {
      // eSewa verification endpoint as per official documentation
      const verificationUrl = 'https://uat.esewa.com.np/epay/transrec'
      
      const verificationData = {
        amt: amt,
        rid: refId,
        pid: oid,
        scd: PAYMENT_CONFIG.esewa.merchantCode
      }

      console.log('eSewa verification request:', verificationData)

      // Create form for verification (eSewa requires POST form submission)
      const form = new FormData()
      Object.entries(verificationData).forEach(([key, value]) => {
        form.append(key, value)
      })

      const response = await fetch(verificationUrl, {
        method: 'POST',
        body: form,
      })

      const responseText = await response.text()
      console.log('eSewa verification response:', responseText)

      // eSewa returns 'Success' for successful transactions
      const isSuccess = responseText.trim().toLowerCase() === 'success'

      return {
        success: isSuccess,
        method: 'esewa',
        amount: parseFloat(amt) * 100, // Convert back to paisa
        paymentId: oid,
        transactionId: refId,
        metadata: {
          verificationResponse: responseText,
          verified: isSuccess
        },
      }
    } catch (error) {
      console.error('eSewa verification error:', error)
      return {
        success: false,
        method: 'esewa',
        amount: parseFloat(amt) * 100,
        error: 'Payment verification failed',
        metadata: {
          verificationError: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }
}

// Khalti Payment Service
export class KhaltiPaymentService {
  private khalti: any = null

  async initialize() {
    if (typeof window === 'undefined') return

    // Dynamically load Khalti checkout
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js'
      script.onload = () => {
        this.khalti = (window as any).KhaltiCheckout
        resolve(this.khalti)
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      if (!this.khalti) await this.initialize()

      const config = {
        publicKey: PAYMENT_CONFIG.khalti.publicKey,
        productIdentity: paymentData.bookingId,
        productName: PAYMENT_CONFIG.khalti.productName,
        productUrl: PAYMENT_CONFIG.khalti.productUrl,
        paymentPreference: [
          'KHALTI',
          'EBANKING',
          'MOBILE_BANKING',
          'CONNECT_IPS',
          'SCT',
        ],
        eventHandler: {
          onSuccess: (payload: any) => {
            console.log('Khalti payment success:', payload)
            // Handle success - you'd typically send this to your backend
            window.location.href = `${PAYMENT_CONFIG.khalti.eventHandler.onSuccess}?token=${payload.token}&amount=${payload.amount}`
          },
          onError: (error: any) => {
            console.error('Khalti payment error:', error)
            window.location.href = `${PAYMENT_CONFIG.khalti.eventHandler.onError}?error=${encodeURIComponent(error.message || 'Payment failed')}`
          },
          onClose: () => {
            console.log('Khalti checkout closed')
            window.location.href = PAYMENT_CONFIG.khalti.eventHandler.onClose
          },
        },
      }

      const checkout = new this.khalti(config)
      checkout.show({ 
        amount: paymentData.amount / 100 * 100, // Khalti expects amount in paisa
        mobile: paymentData.customerInfo.phone,
        productIdentity: paymentData.bookingId,
        productName: `CreatrixSpace Booking - ${paymentData.bookingId}`,
      })

      // Return pending status as Khalti handles the flow
      return {
        success: true,
        method: 'khalti',
        amount: paymentData.amount,
        paymentId: paymentData.bookingId,
        metadata: { initiated: true },
      }
    } catch (error) {
      return {
        success: false,
        method: 'khalti',
        amount: paymentData.amount,
        error: error instanceof Error ? error.message : 'Khalti payment failed',
      }
    }
  }

  // Verify Khalti payment (called from success callback)
  async verifyPayment(token: string, amount: string): Promise<PaymentResult> {
    try {
      // Verify with your backend which then verifies with Khalti
      const response = await fetch('/api/khalti/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, amount }),
      })

      const result = await response.json()

      return {
        success: result.state?.name === 'Completed',
        method: 'khalti',
        amount: parseInt(amount),
        paymentId: result.idx,
        transactionId: token,
        metadata: result,
      }
    } catch (error) {
      return {
        success: false,
        method: 'khalti',
        amount: parseInt(amount),
        error: 'Payment verification failed',
      }
    }
  }
}

// QR Payment Service
export class QRPaymentService {
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // QR Payment returns pending status - actual verification happens via screenshot upload
    return {
      success: true,
      method: 'qr_payment',
      amount: paymentData.amount,
      paymentId: `QR-${paymentData.bookingId}`,
      metadata: {
        status: 'pending_verification',
        qr_generated: true,
        verification_timeout: PAYMENT_CONFIG.qrPayment.verificationTimeout,
      },
    }
  }

  async verifyScreenshot(
    paymentId: string,
    screenshot: File,
    expectedAmount: number
  ): Promise<PaymentResult> {
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock OCR extraction - in production, use actual OCR service
      const extractedData = await this.extractPaymentDetails(screenshot)
      
      // Validate extracted data
      const isValid = this.validatePaymentData(extractedData, expectedAmount, paymentId)
      
      if (isValid) {
        return {
          success: true,
          method: 'qr_payment',
          amount: expectedAmount,
          paymentId: paymentId,
          transactionId: extractedData.transactionId,
          metadata: {
            verification_method: 'screenshot_ocr',
            extracted_data: extractedData,
            confidence_score: extractedData.confidence,
            verified_at: new Date().toISOString(),
          },
        }
      } else {
        return {
          success: false,
          method: 'qr_payment',
          amount: expectedAmount,
          error: 'Payment verification failed - details do not match',
          metadata: {
            verification_method: 'screenshot_ocr',
            extracted_data: extractedData,
            validation_errors: extractedData.errors,
          },
        }
      }
    } catch (error) {
      return {
        success: false,
        method: 'qr_payment',
        amount: expectedAmount,
        error: 'Screenshot processing failed',
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }
    }
  }

  private async extractPaymentDetails(screenshot: File) {
    // Mock OCR extraction - replace with actual OCR service (Tesseract, Google Vision, etc.)
    const mockExtraction = {
      amount: null as number | null,
      transactionId: `TXN${Date.now()}`,
      date: new Date().toISOString(),
      bankName: 'Laxmi Sunrise Bank',
      recipientName: 'Creatrix Technologies Pvt. Ltd.',
      confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
      errors: [] as string[],
    }

    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock some validation scenarios
    if (Math.random() > 0.8) {
      mockExtraction.errors.push('Amount not clearly visible')
      mockExtraction.confidence = 0.6
    }

    return mockExtraction
  }

  private validatePaymentData(
    extractedData: any,
    expectedAmount: number,
    paymentId: string
  ): boolean {
    // Check confidence threshold
    if (extractedData.confidence < 0.8) {
      extractedData.errors.push('Low confidence in OCR extraction')
      return false
    }

    // Check if amount matches (within 1% tolerance for rounding)
    if (extractedData.amount) {
      const tolerance = expectedAmount * 0.01
      if (Math.abs(extractedData.amount - expectedAmount) > tolerance) {
        extractedData.errors.push('Amount mismatch')
        return false
      }
    } else {
      extractedData.errors.push('Amount not found in screenshot')
      return false
    }

    // Check if transaction is recent (within last 30 minutes)
    const transactionTime = new Date(extractedData.date).getTime()
    const currentTime = Date.now()
    const timeDifference = currentTime - transactionTime
    
    if (timeDifference > 30 * 60 * 1000) { // 30 minutes
      extractedData.errors.push('Transaction too old')
      return false
    }

    return true
  }
}

// Payment Service Factory
export class PaymentService {
  private stripeService = new StripePaymentService()
  private esewaService = new ESewaPaymentService()
  private khaltiService = new KhaltiPaymentService()
  private qrPaymentService = new QRPaymentService()

  async processPayment(
    method: PaymentMethod,
    paymentData: PaymentData
  ): Promise<PaymentResult> {
    switch (method) {
      case 'stripe':
        return this.stripeService.processPayment(paymentData)
      case 'esewa':
        return this.esewaService.processPayment(paymentData)
      case 'khalti':
        return this.khaltiService.processPayment(paymentData)
      case 'qr_payment':
        return this.qrPaymentService.processPayment(paymentData)
      case 'bank_transfer':
        return this.processBankTransfer(paymentData)
      default:
        throw new Error(`Unsupported payment method: ${method}`)
    }
  }

  async verifyPayment(
    method: PaymentMethod,
    params: Record<string, string>
  ): Promise<PaymentResult> {
    switch (method) {
      case 'esewa':
        return this.esewaService.verifyPayment(
          params.oid,
          params.amt,
          params.refId
        )
      case 'khalti':
        return this.khaltiService.verifyPayment(
          params.token,
          params.amount
        )
      default:
        throw new Error(`Verification not supported for method: ${method}`)
    }
  }

  private async processBankTransfer(paymentData: PaymentData): Promise<PaymentResult> {
    // Bank transfer is manual - just return success with instructions
    return {
      success: true,
      method: 'bank_transfer',
      amount: paymentData.amount,
      paymentId: paymentData.bookingId,
      metadata: {
        instructions: 'Bank transfer details will be provided via email',
        manual_verification: true,
      },
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService()

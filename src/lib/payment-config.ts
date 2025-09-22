// Payment Gateway Configuration
export const PAYMENT_CONFIG = {
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    currency: 'npr',
    country: 'NP',
  },
  
  // eSewa Configuration  
  esewa: {
    merchantCode: import.meta.env.VITE_ESEWA_MERCHANT_CODE || 'EPAYTEST',
    serviceCharge: 0,
    deliveryCharge: 0,
    taxAmount: 0,
    successUrl: `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/payment/esewa/success`,
    failureUrl: `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/payment/esewa/failure`,
    baseUrl: import.meta.env.VITE_ESEWA_BASE_URL || 'https://uat.esewa.com.np', // UAT for testing
    paymentUrl: 'https://uat.esewa.com.np/epay/main', // Updated payment endpoint
  },
  
  // Khalti Configuration
  khalti: {
    publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY || 'test_public_key_dc74e0fd57cb46cd93832aee0a390234',
    productIdentity: 'creatrixspace',
    productName: 'CreatrixSpace Booking',
    productUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    eventHandler: {
      onSuccess: '/payment/khalti/success',
      onError: '/payment/khalti/error',
      onClose: '/payment/khalti/close',
    }
  }
}

export type PaymentMethod = 'stripe' | 'esewa' | 'khalti' | 'bank_transfer'

export interface PaymentData {
  amount: number // in paisa (1 NPR = 100 paisa)
  currency: string
  bookingId: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  transactionId?: string
  method: PaymentMethod
  amount: number
  error?: string
  metadata?: Record<string, any>
}

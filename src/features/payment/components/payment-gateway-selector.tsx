import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, Building, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PaymentMethod } from '@/lib/payment-config'
import { formatCurrency } from '@/lib/utils'

interface PaymentGatewaySelectorProps {
  amount: number
  onPaymentMethodSelect: (method: PaymentMethod) => void
  isProcessing?: boolean
  showSummary?: boolean
}

const paymentMethods = [
  {
    id: 'esewa' as PaymentMethod,
    name: 'eSewa',
    description: 'Pay securely with Nepal\'s most popular digital wallet',
    icon: Smartphone,
    features: ['Instant payment', 'Mobile banking', 'Digital wallet'],
    fees: 'No additional fees',
    processingTime: 'Instant',
    popular: true,
    logo: '🟢', // In production, use actual eSewa logo
  },
  {
    id: 'khalti' as PaymentMethod,
    name: 'Khalti',
    description: 'Digital payments made simple and secure',
    icon: Smartphone,
    features: ['Mobile banking', 'Connect IPS', 'E-banking'],
    fees: 'No additional fees',
    processingTime: 'Instant',
    popular: true,
    logo: '🟣', // In production, use actual Khalti logo
  },
  {
    id: 'stripe' as PaymentMethod,
    name: 'Credit/Debit Card',
    description: 'Pay with Visa, Mastercard, or other international cards',
    icon: CreditCard,
    features: ['Visa', 'Mastercard', 'International cards'],
    fees: '3.5% + NPR 10',
    processingTime: 'Instant',
    popular: false,
    logo: '💳',
  },
  {
    id: 'bank_transfer' as PaymentMethod,
    name: 'Bank Transfer',
    description: 'Direct bank transfer - manual verification required',
    icon: Building,
    features: ['All major banks', 'RTGS/NEFT', 'Manual verification'],
    fees: 'Bank charges may apply',
    processingTime: '1-2 business days',
    popular: false,
    logo: '🏦',
  },
]

export function PaymentGatewaySelector({
  amount,
  onPaymentMethodSelect,
  isProcessing = false,
  showSummary = true,
}: PaymentGatewaySelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('esewa')

  // Fire initial event on component mount
  useEffect(() => {
    const event = new CustomEvent('paymentMethodChanged', {
      detail: { method: selectedMethod }
    })
    window.dispatchEvent(event)
  }, [])

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method)
    
    // Emit event for summary component to listen
    const event = new CustomEvent('paymentMethodChanged', {
      detail: { method }
    })
    window.dispatchEvent(event)
  }

  const handleProceed = () => {
    onPaymentMethodSelect(selectedMethod)
  }

  // Export selected method for parent component
  const getSelectedMethod = () => selectedMethod

  const calculateFees = (method: PaymentMethod, amount: number) => {
    switch (method) {
      case 'stripe':
        return Math.round(amount * 0.035) + 1000 // 3.5% + NPR 10
      case 'esewa':
      case 'khalti':
        return 0
      case 'bank_transfer':
        return 0 // Bank may charge separately
      default:
        return 0
    }
  }

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod)
  const fees = calculateFees(selectedMethod, amount)
  const totalAmount = amount + fees

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Select Payment Method
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your preferred payment gateway
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedMethod}
            onValueChange={handleMethodChange}
            className="space-y-4"
          >
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`relative border rounded-lg p-4 transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="mt-1"
                  />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{method.logo}</div>
                        <div>
                          <h3 className="font-medium flex items-center">
                            {method.name}
                            {method.popular && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Popular
                              </Badge>
                            )}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {method.fees}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {method.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {method.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Processing: {method.processingTime}
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <div className="text-green-600 text-lg">🛡️</div>
            <div>
              <h4 className="font-medium text-green-800 text-sm">
                Secure Payment Guarantee
              </h4>
              <p className="text-xs text-green-700 mt-1">
                All payments are processed through PCI DSS compliant gateways. 
                Your card details are never stored on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

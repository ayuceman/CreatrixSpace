import { useState, useEffect } from 'react'
import { Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { PaymentMethod } from '@/lib/payment-config'

interface PaymentGatewaySelectorProps {
  amount: number
  onPaymentMethodSelect: (method: PaymentMethod) => void
  isProcessing?: boolean
  showSummary?: boolean
}

const paymentMethods = [
  {
    id: 'qr_payment' as PaymentMethod,
    name: 'QR Payment',
    description: 'Scan QR code with your banking app and upload receipt',
    icon: Smartphone,
    features: ['All major banks', 'QR scan payment', 'Receipt verification'],
    fees: 'No additional fees',
    processingTime: '2-5 minutes verification',
    popular: false,
    logo: '📱',
  },
]

export function PaymentGatewaySelector({
  amount,
  onPaymentMethodSelect,
  isProcessing = false,
  showSummary = true,
}: PaymentGatewaySelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qr_payment')
  
  // Filter to only show QR Payment
  const availablePaymentMethods = paymentMethods.filter(method => method.id === 'qr_payment')

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
      case 'qr_payment':
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
    <div className="space-y-4">
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
            className="space-y-3"
          >
            {availablePaymentMethods.map((method) => (
              <div
                key={method.id}
                className={`relative border rounded-lg p-3 transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                  />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{method.logo}</div>
                        <div>
                          <h3 className="font-medium flex items-center text-sm">
                            {method.name}
                            {method.popular && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Popular
                              </Badge>
                            )}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {method.fees}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {method.processingTime}
                        </div>
                      </div>
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
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <div className="text-green-600">🛡️</div>
            <div>
              <h4 className="font-medium text-green-800 text-xs">
                Secure Payment Guarantee
              </h4>
              <p className="text-xs text-green-700">
                PCI DSS compliant. Card details never stored.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

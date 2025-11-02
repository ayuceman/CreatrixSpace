import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  getLocationPricings, 
  updateLocationPricing, 
  initializeLocationPricing,
  type LocationPricing 
} from '@/lib/location-pricing'

const locations = [
  { id: 'dhobighat-hub', name: 'Dhobighat (WashingTown) Hub' },
  { id: 'kausimaa', name: 'Kausimaa' },
  { id: 'jhamsikhel-loft', name: 'Jhamsikhel Loft' },
  { id: 'baluwatar-studios', name: 'Baluwatar Studios' },
]

type PriceInput = {
  explorer_daily: string
  professional_weekly: string
  professional_monthly: string
  professional_annual: string
  enterprise_weekly: string
  enterprise_monthly: string
  enterprise_annual: string
  private_office_weekly: string
  private_office_monthly: string
  private_office_annual: string
}

function priceToInput(prices: LocationPricing['prices']): PriceInput {
  return {
    explorer_daily: String(prices.explorer.daily / 100),
    professional_weekly: String((prices.professional.weekly || 0) / 100),
    professional_monthly: String(prices.professional.monthly / 100),
    professional_annual: String(prices.professional.annual / 100),
    enterprise_weekly: String((prices.enterprise.weekly || 0) / 100),
    enterprise_monthly: String(prices.enterprise.monthly / 100),
    enterprise_annual: String(prices.enterprise.annual / 100),
    private_office_weekly: String((prices['private-office'].weekly || 0) / 100),
    private_office_monthly: String(prices['private-office'].monthly / 100),
    private_office_annual: String(prices['private-office'].annual / 100),
  }
}

function inputToPrice(input: PriceInput): LocationPricing['prices'] {
  return {
    explorer: { daily: Number(input.explorer_daily) * 100 },
    professional: { 
      weekly: Number(input.professional_weekly) * 100 || undefined,
      monthly: Number(input.professional_monthly) * 100,
      annual: Number(input.professional_annual) * 100
    },
    enterprise: { 
      weekly: Number(input.enterprise_weekly) * 100 || undefined,
      monthly: Number(input.enterprise_monthly) * 100,
      annual: Number(input.enterprise_annual) * 100
    },
    'private-office': { 
      weekly: Number(input.private_office_weekly) * 100 || undefined,
      monthly: Number(input.private_office_monthly) * 100,
      annual: Number(input.private_office_annual) * 100
    },
  }
}

export function AdminPricingPage() {
  const [pricings, setPricings] = useState<LocationPricing[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0].id)
  const [priceInputs, setPriceInputs] = useState<PriceInput>({
    explorer_daily: '500',
    professional_weekly: '2500',
    professional_monthly: '9500',
    professional_annual: '102600',
    enterprise_weekly: '4500',
    enterprise_monthly: '18500',
    enterprise_annual: '199800',
    private_office_weekly: '9000',
    private_office_monthly: '35000',
    private_office_annual: '378000',
  })

  useEffect(() => {
    loadPricings()
  }, [])

  useEffect(() => {
    // Load pricing for selected location
    const pricing = pricings.find((p) => p.locationId === selectedLocation)
    if (pricing) {
      setPriceInputs(priceToInput(pricing.prices))
    }
  }, [selectedLocation, pricings])

  const loadPricings = () => {
    // Initialize locations if not exists
    locations.forEach((loc) => {
      initializeLocationPricing(loc.id, loc.name)
    })
    const data = getLocationPricings()
    setPricings(data)
  }

  const handleSave = () => {
    const locationName = locations.find((l) => l.id === selectedLocation)?.name || selectedLocation
    const prices = inputToPrice(priceInputs)
    updateLocationPricing(selectedLocation, locationName, prices)
    loadPricings()
    alert(`Pricing updated for ${locationName}`)
  }

  const handleInputChange = (field: keyof PriceInput, value: string) => {
    setPriceInputs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Location Pricing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set different prices for each location and membership plan
        </p>
      </div>

      {/* Location Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {locations.map((loc) => (
              <Button
                key={loc.id}
                variant={selectedLocation === loc.id ? 'default' : 'outline'}
                onClick={() => setSelectedLocation(loc.id)}
                className="justify-start"
              >
                {loc.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pricing for {locations.find((l) => l.id === selectedLocation)?.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Prices in NPR</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Explorer */}
          <div>
            <h3 className="font-medium mb-3">Explorer (Day Pass)</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="explorer_daily">Daily Rate (NPR)</Label>
                <Input
                  id="explorer_daily"
                  type="number"
                  value={priceInputs.explorer_daily}
                  onChange={(e) => handleInputChange('explorer_daily', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Professional */}
          <div>
            <h3 className="font-medium mb-3">Professional (Hot Desk)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professional_weekly">Weekly (NPR)</Label>
                <Input
                  id="professional_weekly"
                  type="number"
                  value={priceInputs.professional_weekly}
                  onChange={(e) => handleInputChange('professional_weekly', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional_monthly">Monthly (NPR)</Label>
                <Input
                  id="professional_monthly"
                  type="number"
                  value={priceInputs.professional_monthly}
                  onChange={(e) => handleInputChange('professional_monthly', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional_annual">Annual (NPR)</Label>
                <Input
                  id="professional_annual"
                  type="number"
                  value={priceInputs.professional_annual}
                  onChange={(e) => handleInputChange('professional_annual', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Enterprise */}
          <div>
            <h3 className="font-medium mb-3">Enterprise (Dedicated Desk)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enterprise_weekly">Weekly (NPR)</Label>
                <Input
                  id="enterprise_weekly"
                  type="number"
                  value={priceInputs.enterprise_weekly}
                  onChange={(e) => handleInputChange('enterprise_weekly', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enterprise_monthly">Monthly (NPR)</Label>
                <Input
                  id="enterprise_monthly"
                  type="number"
                  value={priceInputs.enterprise_monthly}
                  onChange={(e) => handleInputChange('enterprise_monthly', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enterprise_annual">Annual (NPR)</Label>
                <Input
                  id="enterprise_annual"
                  type="number"
                  value={priceInputs.enterprise_annual}
                  onChange={(e) => handleInputChange('enterprise_annual', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Private Office */}
          <div>
            <h3 className="font-medium mb-3">Private Office</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="private_office_weekly">Weekly (NPR)</Label>
                <Input
                  id="private_office_weekly"
                  type="number"
                  value={priceInputs.private_office_weekly}
                  onChange={(e) => handleInputChange('private_office_weekly', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="private_office_monthly">Monthly (NPR)</Label>
                <Input
                  id="private_office_monthly"
                  type="number"
                  value={priceInputs.private_office_monthly}
                  onChange={(e) => handleInputChange('private_office_monthly', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="private_office_annual">Annual (NPR)</Label>
                <Input
                  id="private_office_annual"
                  type="number"
                  value={priceInputs.private_office_annual}
                  onChange={(e) => handleInputChange('private_office_annual', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={loadPricings}>Reset</Button>
            <Button onClick={handleSave}>Save Pricing</Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Price Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Explorer</div>
              <div className="text-muted-foreground">NPR {priceInputs.explorer_daily}/day</div>
            </div>
            <div>
              <div className="font-medium">Professional</div>
              <div className="text-muted-foreground">
                NPR {priceInputs.professional_weekly}/wk<br />
                NPR {priceInputs.professional_monthly}/mo<br />
                NPR {priceInputs.professional_annual}/yr
              </div>
            </div>
            <div>
              <div className="font-medium">Enterprise</div>
              <div className="text-muted-foreground">
                NPR {priceInputs.enterprise_weekly}/wk<br />
                NPR {priceInputs.enterprise_monthly}/mo<br />
                NPR {priceInputs.enterprise_annual}/yr
              </div>
            </div>
            <div>
              <div className="font-medium">Private Office</div>
              <div className="text-muted-foreground">
                NPR {priceInputs.private_office_weekly}/wk<br />
                NPR {priceInputs.private_office_monthly}/mo<br />
                NPR {priceInputs.private_office_annual}/yr
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


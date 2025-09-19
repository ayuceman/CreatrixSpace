import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Alert, AlertDescription } from '@/components/ui/alert'

export function ESewaDebug() {
  const [debugInfo, setDebugInfo] = useState<string>('')

  const testESewaDirectly = () => {
    const esewaUrl = 'https://uat.esewa.com.np/epay/main'
    const testParams = {
      amt: '100.00',
      psc: '0.00',
      pdc: '0.00', 
      txAmt: '100.00',
      tAmt: '100.00',
      pid: 'TEST-' + Date.now(),
      scd: 'EPAYTEST',
      su: window.location.origin + '/payment/esewa/success',
      fu: window.location.origin + '/payment/esewa/failure',
    }

    setDebugInfo(JSON.stringify(testParams, null, 2))

    // Create form
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = esewaUrl
    
    Object.entries(testParams).forEach(([key, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }

  const testESewaURL = () => {
    const esewaUrl = 'https://uat.esewa.com.np/epay/main'
    const params = new URLSearchParams({
      amt: '100.00',
      psc: '0.00',
      pdc: '0.00',
      txAmt: '100.00', 
      tAmt: '100.00',
      pid: 'TEST-' + Date.now(),
      scd: 'EPAYTEST',
      su: window.location.origin + '/payment/esewa/success',
      fu: window.location.origin + '/payment/esewa/failure',
    })
    
    const fullUrl = `${esewaUrl}?${params.toString()}`
    setDebugInfo(fullUrl)
    window.open(fullUrl, '_blank')
  }

  const pingESewaServer = async () => {
    try {
      const response = await fetch('https://uat.esewa.com.np/', { mode: 'no-cors' })
      setDebugInfo('eSewa server is reachable')
    } catch (error) {
      setDebugInfo(`eSewa server error: ${error.message}`)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>eSewa Debug Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testESewaDirectly} variant="outline">
            Test eSewa Form
          </Button>
          <Button onClick={testESewaURL} variant="outline">
            Test eSewa URL
          </Button>
          <Button onClick={pingESewaServer} variant="outline">
            Ping eSewa Server
          </Button>
        </div>
        
        {debugInfo && (
          <div className="p-3 bg-muted rounded-lg">
            <pre className="text-xs overflow-auto">{debugInfo}</pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <h4 className="font-medium mb-2">Manual Test URLs:</h4>
          <div className="space-y-1">
            <div>eSewa UAT: <code>https://uat.esewa.com.np/epay/main</code></div>
            <div>Success URL: <code>{window.location.origin}/payment/esewa/success</code></div>
            <div>Failure URL: <code>{window.location.origin}/payment/esewa/failure</code></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

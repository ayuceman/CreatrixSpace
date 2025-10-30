import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAdmin, getAdminEnvCreds } from '@/lib/admin-auth'
import { ROUTES } from '@/lib/constants'

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const creds = getAdminEnvCreds()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const ok = loginAdmin(email.trim(), password)
    if (ok) {
      navigate(ROUTES.ADMIN, { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6 bg-card">
        <div>
          <h1 className="text-xl font-semibold">Admin Login</h1>
          {!creds.email || !creds.password ? (
            <p className="text-xs text-red-600 mt-1">Missing VITE_ADMIN_EMAIL or VITE_ADMIN_PASSWORD in environment.</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  )
}



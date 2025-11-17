import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAdmin, getAdminEnvCreds } from '@/lib/admin-auth'
import { authService } from '@/services/supabase-service'
import { ROUTES } from '@/lib/constants'

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const creds = getAdminEnvCreds()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      // First verify credentials match env vars
      const ok = loginAdmin(email.trim(), password)
      if (!ok) {
        setError('Invalid credentials')
        setLoading(false)
        return
      }
      
      // Also sign in via Supabase auth so RLS policies work
      try {
        await authService.signIn(email.trim(), password)
      } catch (supabaseError: any) {
        // If Supabase sign-in fails, still allow admin login but warn
        console.warn('Supabase auth sign-in failed:', supabaseError)
        // Continue anyway - the localStorage session will work for UI, but DB updates might fail
      }
      
      navigate(ROUTES.ADMIN, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
    } finally {
      setLoading(false)
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}



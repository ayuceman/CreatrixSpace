import { Navigate, Outlet } from 'react-router-dom'
import { isAdminLoggedIn } from '@/lib/admin-auth'
import { ROUTES } from '@/lib/constants'

export function AdminProtectedRoute() {
  const ok = typeof window !== 'undefined' && isAdminLoggedIn()
  if (!ok) return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  return <Outlet />
}



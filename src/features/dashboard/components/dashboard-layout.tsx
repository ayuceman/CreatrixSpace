import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '@/components/layout/scroll-to-top'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-bg-band/30">
      <ScrollToTop />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <Outlet />
      </div>
    </div>
  )
}

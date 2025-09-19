import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <Outlet />
      </div>
    </div>
  )
}

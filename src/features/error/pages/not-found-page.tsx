import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function NotFoundPage() {
  return (
    <div className="container section-padding text-center">
      <h1 className="text-6xl font-display font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to={ROUTES.HOME}>Go Home</Link>
      </Button>
    </div>
  )
}

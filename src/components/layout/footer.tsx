import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-bg">
      <div className="container py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-bg">
            Come by{' '}
            <em className="text-clay-soft not-italic italic">tomorrow</em>
            .
            <br />
            Stay{' '}
            <em className="text-clay-soft not-italic italic">as long as</em>
            <br />
            you like.
          </h2>
        </div>
      </div>

      <div className="container pb-8 border-t border-rule-on-ink">
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            to={ROUTES.HOME}
            className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
          >
            <span className="font-serif text-lg font-bold text-bg">
              Creatrix
            </span>
            <span className="font-serif text-lg italic font-normal text-clay-soft">
              Space
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-sm text-fg-on-ink-2">
            <Link
              to={ROUTES.LOCATIONS}
              className="hover:opacity-80 transition-opacity"
            >
              Locations
            </Link>
            <Link
              to={ROUTES.PRICING}
              className="hover:opacity-80 transition-opacity"
            >
              Pricing
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="hover:opacity-80 transition-opacity"
            >
              About
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="hover:opacity-80 transition-opacity"
            >
              Contact
            </Link>
            <Link
              to={ROUTES.TERMS}
              className="hover:opacity-80 transition-opacity"
            >
              Terms
            </Link>
            <Link
              to={ROUTES.PRIVACY}
              className="hover:opacity-80 transition-opacity"
            >
              Privacy
            </Link>
          </div>

          <p className="text-xs text-fg-on-ink-2/60">
            © {new Date().getFullYear()} CreatrixSpace
          </p>
        </div>
      </div>
    </footer>
  )
}

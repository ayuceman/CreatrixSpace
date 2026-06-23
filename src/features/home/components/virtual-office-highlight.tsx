import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe2,
  Mail,
  Building2,
  Armchair,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, cn } from '@/lib/utils'
import { useVirtualOfficeAddon } from '@/features/home/hooks/use-virtual-office-addon'

type Props = {
  variant?: 'full' | 'compact'
}

export function VirtualOfficeHighlight({ variant = 'full' }: Props) {
  const { pricePaisa, name, description, loading } = useVirtualOfficeAddon()

  const comparison = [
    {
      label: 'Coworking',
      icon: Armchair,
      hint: 'Physical desk & lounge',
      tone: 'text-muted-foreground',
    },
    {
      label: 'Private office',
      icon: Building2,
      hint: 'Dedicated room on-site',
      tone: 'text-muted-foreground',
    },
    {
      label: 'Virtual office',
      icon: Globe2,
      hint: 'Prestige address & mail',
      tone: 'text-emerald-400',
      highlight: true,
    },
  ]

  if (variant === 'compact') {
    return (
      <section className="py-8 border-b border-purple-100/70 dark:border-purple-900/30 bg-gradient-to-r from-purple-50 via-white to-purple-50/60 dark:from-background dark:via-background dark:to-purple-950/10">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 rounded-2xl border border-purple-200/70 dark:border-purple-900/40 bg-white/90 dark:bg-background/80 px-6 py-5 shadow-sm">
            <div className="flex items-start gap-4 flex-1">
              <div className="rounded-xl bg-emerald-100/80 dark:bg-emerald-900/20 p-3 ring-1 ring-emerald-300/50 dark:ring-emerald-600/30">
                <Globe2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <Badge className="mb-2 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Standalone product
                </Badge>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  No full-time desk required. Use our office number for
                  call/enquiry handling, get a professional business address,
                  and use hot desks when you visit.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:shrink-0">
              <div className="text-right sm:text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  From
                </p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {formatCurrency(pricePaisa, 'NPR')}
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>
                )}
              </div>
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-900/40"
              >
                <Link to={`${ROUTES.PRICING}#virtual-office`}>
                  Activate virtual office
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-background dark:via-purple-950/10 dark:to-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-purple-200/20 dark:bg-purple-900/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-200/20 dark:bg-emerald-900/10 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
              Not coworking — a business presence
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-normal text-gray-900 dark:text-white leading-tight">
              Virtual office
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                for modern businesses
              </span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
              Build professional presence without renting a full-time desk. You
              get office-number enquiry handling, business address credibility,
              and hot-desk access when you visit.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {comparison.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border',
                      item.highlight
                        ? 'border-emerald-400/40 bg-emerald-100/70 text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'border-purple-200 bg-white text-muted-foreground dark:border-purple-800/40 dark:bg-background/80'
                    )}
                  >
                    <Icon className={cn('h-3.5 w-3.5', item.tone)} />
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground hidden sm:inline">
                      · {item.hint}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-purple-400/15 via-emerald-400/10 to-transparent blur-xl" />
            <div className="relative rounded-3xl border border-purple-200 dark:border-purple-900/40 bg-white/90 dark:bg-background/90 backdrop-blur p-8 shadow-lg">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 p-3 ring-1 ring-emerald-300/50 dark:ring-emerald-700/30">
                    <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Featured package
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {name}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {description}
              </p>
              <ul className="space-y-2.5 mb-8 text-sm text-gray-700 dark:text-gray-300">
                {[
                  'Prestige business address at CreatrixSpace',
                  'Office number call handling & enquiry forwarding',
                  'Mail & package receiving',
                  'Use address for registration & branding',
                  'Hot-desk access during visits (fair use)',
                  'Meeting room booking at member rate when you visit',
                ].map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ✓
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-purple-100 dark:border-purple-900/30">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Starting at
                  </p>
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                      {formatCurrency(pricePaisa, 'NPR')}
                      <span className="text-base font-normal text-muted-foreground">
                        /month
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    size="lg"
                    asChild
                    className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 w-full sm:w-auto"
                  >
                    <a
                      href="https://wa.me/9779803171819?text=Hi!%20I%20want%20to%20activate%20Virtual%20Office%20with%20call%20handling%20and%20hot-desk%20visit%20access."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get virtual office now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950/20 w-full sm:w-auto"
                  >
                    <a href="tel:+9779700045256">Call +977 9700045256</a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionProps {
  children?: React.ReactNode
  bg?: string
  className?: string
}

export function Section({ bg, className, children }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={cn('px-6 md:px-10 lg:px-16 py-16 md:py-20', bg, className)}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </motion.section>
  )
}

export function SectionHeading({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <h2
      className={cn(
        'font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.2] tracking-tight mb-8',
        className
      )}
    >
      {children}
    </h2>
  )
}

interface AnimateInProps {
  children?: React.ReactNode
  className?: string
  delay?: number
}

export function AnimateIn({ delay = 0, className, children }: AnimateInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

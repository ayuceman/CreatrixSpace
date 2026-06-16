import * as React from 'react'
import { Link } from 'react-router-dom'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { IconType } from 'react-icons'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer p-3 whitespace-nowrap rounded-full text-sm disabled:pointer-events-none disabled:opacity-50 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-clay text-white hover:bg-clay/90',
        dark: 'bg-foreground text-white border border-foreground hover:bg-white hover:text-fg-1',
        destructive: 'bg-clay-deep text-fg-on-ink-1 hover:bg-clay-deep/90',
        outline: 'border border-rule bg-bg hover:bg-clay-soft hover:text-fg-1',
        secondary: 'bg-moss-soft text-fg-1 hover:bg-moss-soft/80',
        ghost: 'hover:bg-clay-soft hover:text-fg-1',
        link: 'text-clay underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  text: string
  icon?: IconType
  iconPosition?: 'left' | 'right'
  iconSize?: number
  href?: string
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target']
  rel?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      icon: Icon,
      iconPosition = 'left',
      iconSize = 16,
      text,
      href,
      target,
      rel,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const classes = cn(buttonVariants({ variant, className }))

    const iconNode = Icon ? (
      <Icon
        size={iconSize}
        aria-hidden="true"
        className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}
      />
    ) : null

    const content = (
      <>
        {iconPosition === 'left' && iconNode}
        {text}
        {iconPosition === 'right' && iconNode}
      </>
    )

    if (href) {
      return (
        <Link
          to={href}
          target={target}
          rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
          className={classes}
        >
          {content}
        </Link>
      )
    }

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {content}
        </Slot>
      )
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {content}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

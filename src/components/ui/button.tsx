import * as React from 'react'
import { Link } from 'react-router-dom'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { IconType } from 'react-icons'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center p-3 whitespace-nowrap rounded-full text-sm disabled:pointer-events-none disabled:opacity-50 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        dark: 'bg-foreground text-white hover:bg-white hover:text-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-xs rounded-sm',
        lg: 'px-7 py-3.5 text-base',
        default: 'p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  text?: string
  children?: React.ReactNode
  icon?: IconType
  iconPosition?: 'left' | 'right'
  iconSize?: number
  href?: string
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target']
  rel?: string
  size?: 'sm' | 'lg' | 'default'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      iconPosition = 'left',
      iconSize = 16,
      text,
      children,
      href,
      target,
      rel,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    const iconNode = Icon ? (
      <Icon
        size={iconSize}
        aria-hidden="true"
        className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}
      />
    ) : null

    const label = text ?? children
    const content = (
      <>
        {iconPosition === 'left' && iconNode}
        {label}
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

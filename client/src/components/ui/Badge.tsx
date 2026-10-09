import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'violet'
  withDot?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'gray', withDot = true, children, ...props }, ref) => {
    const variants = {
      green: 'bg-green-100 text-green-700',
      amber: 'bg-amber-100 text-amber-700',
      red: 'bg-red-100 text-red-700',
      blue: 'bg-blue-100 text-blue-700',
      gray: 'bg-gray-100 text-gray-700',
      violet: 'bg-violet-100 text-violet-700',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap',
          variants[variant],
          className
        )}
        {...props}
      >
        {withDot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge

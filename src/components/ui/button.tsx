import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md cursor-pointer font-mono transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white/20 border border-white/40 text-inherit hover:bg-white/30',
        outline: 'bg-white/15 border border-current text-inherit hover:bg-white/25',
        ghost: 'bg-transparent border-none text-inherit hover:bg-white/10',
      },
      size: {
        default: 'px-3 py-1.5 text-sm',
        sm: 'px-3 py-1 text-xs',
        icon: 'p-2 text-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})

export { Button }

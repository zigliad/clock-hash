import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'font-mono text-sm px-2 py-1.5 bg-white/10 border border-white/30 rounded text-inherit outline-none placeholder:text-white/50',
        className
      )}
      {...props}
    />
  )
})

export { Input }

import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(function Input({ className, ...props }, ref) {
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

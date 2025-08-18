import React from 'react'
import { cn } from '~/lib/utils'

export default function IconButton({
  children,
  className,
  ...otherProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...{ ...otherProps, type: otherProps.type ?? 'button' }}
      className={cn('', className)}
    >
      {children}
    </button>
  )
}

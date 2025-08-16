'use client'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { flushSync } from 'react-dom'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withViewTransition(update?: () => unknown) {
  // Protect against server-side execution where `document` is undefined
  if (
    typeof document === 'undefined' ||
    typeof document.startViewTransition !== 'function'
  ) {
    return update?.()
  }

  document.startViewTransition(() => {
    flushSync(() => update?.())
  })
}

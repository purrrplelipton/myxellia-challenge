'use client'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { flushSync } from 'react-dom'
import { type FormatPriceOptions } from '~/schemas'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withViewTransition(update?: () => unknown) {
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

const DEFAULT_CONFIG: FormatPriceOptions = {
  currency: 'NGN',
  locale: 'en-NG',
  fallback: '--',
  showCurrencySymbol: true,
  showFractionDigits: true,
  currencyDisplay: 'symbol',
  currencySign: 'standard',
}

export function formatPrice(
  value?: string | number,
  options?: FormatPriceOptions,
) {
  const mergedOptions: FormatPriceOptions = { ...DEFAULT_CONFIG, ...options }

  const numericValue = Number.parseFloat(String(value ?? ''))

  if (Number.isNaN(numericValue)) return mergedOptions.fallback || ''

  const {
    currency,
    locale,
    showCurrencySymbol,
    showFractionDigits,
    currencyDisplay,
    intlOptions,
  } = mergedOptions

  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    currencyDisplay,
    useGrouping: true,
    ...(intlOptions || {}),
  }

  if (!showCurrencySymbol) {
    formatOptions.currencySign = 'accounting'
    formatOptions.currencyDisplay = 'code'
  }

  if (!showFractionDigits) {
    formatOptions.minimumFractionDigits = 0
    formatOptions.maximumFractionDigits = 0
  } else {
    formatOptions.minimumFractionDigits = 2
    formatOptions.maximumFractionDigits = 2
  }

  try {
    return new Intl.NumberFormat(locale, formatOptions)
      .format(numericValue)
      .replace(/\s?[A-Z]{3}/, '') // Remove currency code if present
  } catch (err) {
    console.error('Error formatting price:', err)
    return mergedOptions.fallback || ''
  }
}

export function fmtMillions(n: number) {
  const m = n / 1_000_000
  return (Math.abs(m) < 10 ? Math.round(m * 10) / 10 : Math.round(m)) + 'm'
}
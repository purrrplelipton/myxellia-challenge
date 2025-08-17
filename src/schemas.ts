export type FormatPriceOptions = {
  currency?: string
  locale?: string
  fallback?: string
  showCurrencySymbol?: boolean
  showFractionDigits?: boolean
  currencyDisplay?: Intl.NumberFormatOptions['currencyDisplay']
  currencySign?: Intl.NumberFormatOptions['currencySign']
  intlOptions?: Intl.NumberFormatOptions
}

import React from 'react'
import { cn, formatPrice } from '~/lib/utils'

export default function CardThing({
  value,
  previousValue,
  title,
  className,
  accentColor,
}: CardThingProps) {
  const delta = React.useMemo(
    () => value - previousValue,
    [value, previousValue],
  )
  const percentChange = React.useMemo(
    () => Math.abs((delta / previousValue) * 100 || 0).toFixed(1),
    [delta, previousValue],
  )

  const isIncrease = delta > 0
  const isSame = delta === 0

  return (
    <article
      style={{ '--accent-color': accentColor } as React.CSSProperties}
      className={cn('rounded-lg p-3', className)}
      aria-labelledby={`cardthing-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="mx-auto w-5/6 space-y-1 text-[0.5rem] font-medium md:space-y-2 md:text-[0.625rem]">
        <p className="font-semibold md:text-xl" aria-live="polite">
          <span style={{ color: 'var(--accent-color)' }} aria-hidden>
            {formatPrice(value)}
          </span>
          <span className="sr-only">{formatPrice(value)}</span>
        </p>

        <p>
          <span
            id={`cardthing-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="font-medium"
          >
            {title}
          </span>

          <span
            aria-hidden
            className="mr-0.75 ml-1 inline-grid size-2.5 place-content-center rounded-full bg-(--accent-color) text-center md:mr-1.5 md:ml-2 md:size-3.5"
          >
            <span className="inline-block size-[1em] leading-none text-(--accent-color) invert">
              {isSame ? <>&ndash;</> : isIncrease ? <>&uarr;</> : <>&darr;</>}
            </span>
          </span>

          <span className="text-(--accent-color) dark:invert">
            {percentChange}&#37;
          </span>
        </p>
      </div>
    </article>
  )
}

interface CardThingProps {
  className?: string
  value: number
  previousValue: number
  accentColor: string
  title: string
}

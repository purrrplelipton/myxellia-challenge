import React from 'react'
import { ArrowThingy } from '~/assets/svgs'
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
      className={cn('rounded-lg py-3.5', className)}
      aria-labelledby={`cardthing-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="@container/card-thingy mx-auto w-5/6 space-y-1 text-[0.625rem] font-medium md:space-y-2 @3xs/card-thingy:text-sm">
        <p
          className="text-[1.5em] font-semibold @3xs/card-thingy:text-[2.5em] @2xs/card-thingy:text-[3em]"
          aria-live="polite"
        >
          <span className="text-(--accent-color) dark:invert" aria-hidden>
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

          <ArrowThingy
            aria-hidden
            className={cn(
              'mr-0.75 ml-1 inline-block w-[1.125em] align-middle text-(--accent-color) md:mr-1.5 md:ml-2 dark:invert',
              {
                'rotate-180': !isIncrease && !isSame,
                'rounded-full bg-(--accent-color)': isSame,
              },
            )}
          />

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

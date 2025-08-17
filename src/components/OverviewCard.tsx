import React from 'react'
import { cn, formatNumber } from '~/lib/utils'

export default function OverviewCard({
  title,
  titleId,
  viewAllAction,
  className,
  metrics,
  icon,
}: OverviewCardProps) {
  return (
    <section
      className={cn(
        'space-y-2.5 rounded-2xl border border-[#e4e4e4] bg-white pb-2 md:space-y-5 md:pb-4 dark:border-[#1b1b1b] dark:bg-black',
        className,
      )}
      role="region"
      aria-labelledby={titleId}
    >
      <header className="gap-4 rounded-t-[inherit] border-b border-[#e4e4e4] bg-[#f9fafb] dark:border-[#1b1b1b] dark:bg-[#060504]">
        <div className="mx-auto flex w-5/6 items-center py-3.5 font-medium">
          <div className="flex items-center gap-1.25 md:gap-2.5">
            {icon && (
              <span
                className="grid size-[1em] place-content-center text-[#4545fe] *:inline-block *:size-[1em] md:text-2xl dark:text-[#baba01]"
                aria-hidden="true"
              >
                {icon}
              </span>
            )}
            <h3
              id={titleId}
              className="text-xs text-[#292929] md:text-sm dark:text-[#d6d6d6]"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={viewAllAction}
            className="ml-auto shrink-0 text-[0.625rem] text-[#4545fe] md:text-xs dark:text-[#baba01]"
            aria-label={`View all ${title}`}
          >
            View all <span className="text-[1.5em]">&#x3E;</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-5/6 gap-4.5 *:grow md:gap-9">
        {metrics.map((m, i) => (
          <dl
            key={i}
            className="space-y-1 text-lg font-semibold text-[#141414] md:space-y-2 md:text-2xl dark:text-[#ebebeb]"
          >
            <dt className="text-xs text-[#525252] md:text-sm dark:text-[#adadad]">
              {m.label}
            </dt>
            <dd>{formatNumber(m.value)}</dd>
          </dl>
        ))}
      </div>
    </section>
  )
}

interface OverviewCardProps {
  title: string
  titleId: string
  metrics: { label: string; value: number }[]
  viewAllAction?: () => void
  className?: string
  icon?: React.ReactNode
}

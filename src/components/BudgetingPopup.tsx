'use client'

import Image from 'next/image'
import React from 'react'
import { createPortal } from 'react-dom'
import { budgeting } from '~/assets/images'
import { AlignBottom, Calculator, Setting4, TrendUp } from '~/assets/svgs'
import { withViewTransition } from '~/lib/utils'
import Tooltip from './Tooltip'

export default function BudgetingPopup() {
  const [showPopup, setShowPopup] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const popupRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        event.target !== popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        withViewTransition(() => setShowPopup(false))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <React.Fragment>
      <Tooltip content="Budgeting" placement="bottom">
        <button
          type="button"
          onClick={() => withViewTransition(() => setShowPopup(true))}
        >
          <Calculator className="w-[1em]" />
        </button>
      </Tooltip>
      {mounted &&
        createPortal(
          <React.Fragment>
            {showPopup && (
              <div className="fixed inset-0 place-content-center-safe bg-black/10 dark:bg-white/10">
                <div
                  ref={popupRef}
                  aria-modal
                  className="bg-background text-foreground shadow-foreground/10 mx-auto w-11/12 max-w-md rounded-xl shadow-lg"
                >
                  <Image
                    src={budgeting}
                    alt="A visual representation of budgeting"
                    width={876}
                    height={426}
                    className="aspect-[438/213] w-full rounded-t-[inherit]"
                    priority
                  />
                  <div className="mx-auto w-5/6 py-6">
                    {perksList.map((perk) => (
                      <div
                        key={perk.title}
                        className="mb-6 flex items-center gap-3"
                      >
                        <perk.icon className="w-[1em] shrink-0 text-2xl text-[#52525b] dark:text-[#adada4]" />
                        <div className="space-y-1 text-xs text-[#606060] dark:text-[#9f9f9f]">
                          <h3 className="text-foreground text-base font-semibold">
                            {perk.title}
                          </h3>
                          <p>{perk.description}</p>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        withViewTransition(() => setShowPopup(false))
                      }
                      className="bg-foreground text-background block w-full rounded-full py-3 leading-snug font-medium"
                    >
                      Create Budget
                    </button>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>,
          document.body,
        )}
    </React.Fragment>
  )
}

const perksList = [
  {
    icon: Setting4,
    title: 'Set up annual budgets by account category',
    description:
      'Allocate funds across income and expense lines with full visibility.',
  },
  {
    icon: TrendUp,
    title: 'Track actuals vs budget in real time',
    description:
      'See how your community is performing against plan, month by month.',
  },
  {
    icon: AlignBottom,
    title: 'Adjust figures and forecast with ease',
    description:
      "Edit amounts, apply percentage changes, or roll forward last year's data—all in one place.",
  },
]

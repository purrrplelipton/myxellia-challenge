'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { Calendar } from '~/assets/svgs'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { withViewTransition } from '~/lib/utils'

export default React.memo(function CalendarSlideOut() {
  const [showSlideOut, setShowSlideOut] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const slideOutRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)

    const handleClickOutside = (event: MouseEvent) => {
      if (
        slideOutRef.current &&
        event.target !== slideOutRef.current &&
        !slideOutRef.current.contains(event.target as Node)
      ) {
        withViewTransition(() => setShowSlideOut(false))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <React.Fragment>
      <button
        type="button"
        onClick={() => withViewTransition(() => setShowSlideOut(true))}
      >
        <Calendar className="w-[1em]" />
      </button>
      {mounted &&
        createPortal(
          <React.Fragment>
            {showSlideOut && (
              <div className="fixed inset-0 flex bg-black/10 dark:bg-white/10">
                <div
                  ref={slideOutRef}
                  className="ml-auto w-3/4 max-w-sm bg-[#0d0d0d] text-[#969696] dark:bg-[#f2f2f2] dark:text-[#696969]"
                >
                  <DayPicker animate />
                </div>
              </div>
            )}
          </React.Fragment>,
          document.body,
        )}
    </React.Fragment>
  )
})

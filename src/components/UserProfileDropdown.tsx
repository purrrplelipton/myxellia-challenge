'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { Home } from '~/assets/svgs'
import { cn, withViewTransition } from '~/lib/utils'
import Tooltip from './Tooltip'

export default function UserProfileDropdown() {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target !== dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        withViewTransition(() => setShowDropdown(false))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getDropdownPosition = () => {
    if (!triggerRef.current) return {}
    const rect = triggerRef.current.getBoundingClientRect()
    return {
      top: rect.bottom + 8,
      left: rect.right,
    }
  }

  return (
    <React.Fragment>
      <Tooltip
        content={
          <>
            <p className="font-semibold">Emmanuel Adeyeye</p>
            <span className="text-xs">immanueltoby@gmail.com</span>
          </>
        }
        placement="bottom"
        hideArrow
        className="[--tooltip-bg:var(--background)] [--tooltip-fg:var(--foreground)]"
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => withViewTransition(() => setShowDropdown(true))}
          className={cn(
            'bg-background text-foreground grid size-8 place-content-center rounded-full text-xl leading-none font-medium transition-all transition-discrete xl:size-10 xl:text-2xl',
            {
              'outline-background/90 -outline-offset-1 hover:outline-4 focus-visible:outline-4':
                !showDropdown,
            },
          )}
          aria-label="User Profile"
        >
          E
        </button>
      </Tooltip>
      {mounted &&
        createPortal(
          <React.Fragment>
            {showDropdown && (
              <React.Fragment>
                <i aria-hidden className="fixed inset-0" />
                <div
                  ref={dropdownRef}
                  style={getDropdownPosition()}
                  className="bg-foreground text-background dark:shadow-foreground/25 fixed w-max -translate-x-full space-y-3 rounded-xl p-3 text-sm shadow-lg"
                >
                  <div className="border-background/25 flex items-center gap-3 rounded-lg border p-2">
                    <h2 className="bg-background text-foreground grid size-10 place-content-center rounded-full text-center text-2xl leading-none font-medium">
                      E
                    </h2>
                    <div>
                      <p className="font-semibold">Emmanuel Adeyeye</p>
                      <span className="text-xs">immanueltoby@gmail.com</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch">
                    {dropdownActions.map((action, index) => (
                      <React.Fragment key={action.name}>
                        {index !== 0 && <hr className="my-1" />}
                        <button
                          type="button"
                          onClick={action.action}
                          className="flex items-center gap-2 p-2 text-left"
                        >
                          <action.icon className="w-[1.5em]" />
                          <span>{action.name}</span>
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>,
          document.body,
        )}
    </React.Fragment>
  )
}

const dropdownActions = [
  {
    name: 'Teams',
    icon: Home,
    action: () => {},
  },
  {
    name: 'Contact Person',
    icon: Home,
    action: () => {},
  },
  {
    name: 'Change Password',
    icon: Home,
    action: () => {},
  },
  {
    name: '2-Factor Authentication',
    icon: Home,
    action: () => {},
  },
  {
    name: 'Logout',
    icon: Home,
    action: () => {},
  },
]

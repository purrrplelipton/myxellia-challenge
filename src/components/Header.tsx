'use client'

import React from 'react'
import {
  Article,
  Home,
  MessageNotif,
  MyxelliaInsignia,
  MyxelliaText,
  Notification1,
  Profile1,
  Scroll,
  Search1,
  Toolbox,
} from '~/assets/svgs'
import UserProfileDropdown from './UserProfileDropdown'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'
import BudgetingPopup from './BudgetingPopup'
import CalendarSlideOut from './CalendarSlideOut'
import IconButton from './IconButton'

export default function Header() {
  const pathname = usePathname()
  const navItemsWrapper = React.useRef<HTMLElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateScrollState = () => {
    const el = navItemsWrapper.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = navItemsWrapper.current
    if (!el) return
    const scrollBy = Math.round(el.clientWidth * 0.5)
    el.scrollBy({
      left: dir === 'left' ? -scrollBy : scrollBy,
      behavior: 'smooth',
    })
  }

  React.useEffect(() => {
    const el = navItemsWrapper.current
    if (!el) return
    updateScrollState()
    const onScroll = () => updateScrollState()
    window.addEventListener('resize', updateScrollState)
    el.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('resize', updateScrollState)
      el.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header>
      <div className="bg-foreground text-white dark:text-black">
        <div className="mx-auto flex h-16 w-11/12 max-w-screen-2xl items-center lg:h-20">
          <button
            type="button"
            className="flex h-5 items-center gap-1 *:h-full *:w-auto lg:h-7 lg:gap-1.5"
          >
            <MyxelliaInsignia />
            <MyxelliaText />
          </button>
          <div className="ml-auto flex items-center gap-3 text-xl *:shrink-0 lg:gap-6 lg:text-[2rem]">
            <button type="button" aria-disabled>
              <Notification1 className="w-[1em]" />
            </button>
            <BudgetingPopup />
            <CalendarSlideOut />
            <button type="button" aria-disabled>
              <MessageNotif className="w-[1em]" />
            </button>
            <UserProfileDropdown />
          </div>
        </div>
      </div>
      <div className="bg-white text-[#3d3d3d] shadow-xs shadow-[#f4f4f5] dark:bg-black dark:text-[#c2c2c2] dark:shadow-[#0b0b0a]">
        <div className="mx-auto w-11/12 max-w-screen-2xl items-center space-y-3 py-3 md:flex md:h-17 md:space-y-0">
          <div className="grid w-full grid-cols-1 grid-rows-1 items-center *:[grid-area:1/1]">
            <nav
              ref={navItemsWrapper}
              className="flex w-full max-w-full items-center overflow-auto lg:gap-5"
              style={{ scrollbarWidth: 'none' }}
            >
              {navItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs -outline-offset-2 md:gap-2 lg:text-sm xl:px-8',
                    {
                      'bg-[#f5f5f5] font-semibold dark:bg-[#0a0a0a]':
                        !!item.href?.trim() && pathname === item.href,
                    },
                  )}
                >
                  <item.icon className="w-[1.625em]" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
            {canScrollLeft && (
              <IconButton
                aria-label="Scroll slider left"
                onClick={() => scrollCarousel('left')}
                className={cn(
                  canScrollLeft
                    ? [
                        'hover:opacity-100 focus-visible:opacity-100 lg:opacity-40',
                      ]
                    : ['opacity-0'],
                  'ml-4 grid aspect-square place-content-center justify-self-start rounded-full bg-[#e4e4e4] p-1.5 text-[0.5rem] shadow shadow-current transition-all duration-200 dark:bg-[#1b1b1b] starting:opacity-0',
                )}
              >
                <span className="inline-block size-[1em] leading-none">
                  &#9664;
                </span>
              </IconButton>
            )}
            {canScrollRight && (
              <IconButton
                aria-label="Scroll slider right"
                onClick={() => scrollCarousel('right')}
                className={cn(
                  canScrollRight
                    ? [
                        'hover:opacity-100 focus-visible:opacity-100 lg:opacity-40',
                      ]
                    : ['opacity-0'],
                  'ml-4 grid aspect-square place-content-center justify-self-end rounded-full bg-[#e4e4e4] p-1.5 text-[0.5rem] shadow shadow-current transition-all duration-200 dark:bg-[#1b1b1b] starting:opacity-0',
                )}
              >
                <span className="inline-block size-[1em] leading-none">
                  &#9658;
                </span>
              </IconButton>
            )}
          </div>
          <div className="grid w-full shrink-0 grid-cols-1 grid-rows-1 items-center text-xs leading-relaxed font-light *:[grid-area:1/1] lg:max-w-64 xl:max-w-80">
            <input
              type="search"
              placeholder="Search listings, users, and more"
              className="min-w-0 truncate rounded-xl border border-[#e4e4e4] bg-[#f5f5f5] py-2.5 pr-4 pl-12 dark:border-[#1b1b1b] dark:bg-[#0a0a0a]"
            />
            <Search1 className="pointer-events-none ml-4 w-[2em] justify-self-start select-none" />
          </div>
        </div>
      </div>
    </header>
  )
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Listings',
    icon: Toolbox,
  },
  {
    name: 'Users',
    icon: Profile1,
  },
  {
    name: 'Requests',
    icon: Article,
  },
  {
    name: 'Applications',
    icon: Scroll,
  },
]

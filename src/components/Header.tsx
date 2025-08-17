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

export default function Header() {
  const pathname = usePathname()

  return (
    <header>
      <div className="bg-foreground text-white dark:text-black">
        <div className="mx-auto flex h-16 w-11/12 max-w-screen-2xl items-center xl:h-20">
          <button
            type="button"
            className="flex h-5 items-center gap-1 *:h-full *:w-auto xl:h-7 xl:gap-1.5"
          >
            <MyxelliaInsignia />
            <MyxelliaText />
          </button>
          <div className="ml-auto flex items-center gap-3 text-xl *:shrink-0 xl:gap-6 xl:text-[2rem]">
            <button type="button">
              <Notification1 className="w-[1em]" />
            </button>
            <BudgetingPopup />
            <CalendarSlideOut />
            <button type="button">
              <MessageNotif className="w-[1em]" />
            </button>
            <UserProfileDropdown />
          </div>
        </div>
      </div>
      <div className="bg-white text-[#3d3d3d] shadow-xs shadow-[#f4f4f5] dark:bg-black dark:text-[#c2c2c2] dark:shadow-[#0b0b0a]">
        <div className="mx-auto w-11/12 max-w-screen-2xl items-center space-y-3 py-3 md:flex md:h-17 md:space-y-0">
          <nav className="flex w-full max-w-full items-center overflow-auto xl:gap-5">
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
          <div className="grid w-full shrink-0 grid-cols-1 grid-rows-1 items-center text-xs leading-relaxed font-light *:[grid-area:1/1] xl:max-w-64 2xl:max-w-80">
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

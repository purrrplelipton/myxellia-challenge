'use client'

import React from 'react'
import CardThing from '~/components/CardThing'
import CarouselCard from '~/components/CarouselCard'
import { cn } from '~/lib/utils'
import dynamic from 'next/dynamic'
import OverviewCard from '~/components/OverviewCard'
import { Profile1, SolarHomeLinear } from '~/assets/svgs'
import IconButton from '~/components/IconButton'

const Chart = dynamic(() => import('~/components/Chart'), {
  ssr: false,
})

type CarouselItem = {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  action?: React.ReactNode
}

type CarouselDef = {
  ariaLabel?: string
  items: CarouselItem[]
}

function CarouselStrip({ carousels }: { carousels: CarouselDef[] }) {
  const id = React.useId()
  const carouselWrapRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateScrollState = () => {
    const el = carouselWrapRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = carouselWrapRef.current
    if (!el) return
    const scrollBy = Math.round(el.clientWidth * 0.6)
    el.scrollBy({
      left: dir === 'left' ? -scrollBy : scrollBy,
      behavior: 'smooth',
    })
  }

  React.useEffect(() => {
    const el = carouselWrapRef.current
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
    <section aria-labelledby="featured-carousels-heading">
      <h2 id="featured-carousels-heading" className="sr-only">
        Featured carousels
      </h2>
      <div className="grid grid-cols-1 grid-rows-1 items-center *:[grid-area:1/1]">
        <div
          ref={carouselWrapRef}
          className="flex max-w-full gap-4 overflow-auto *:shrink-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {carousels.map((carousel, index) => {
            const label = carousel.ariaLabel ?? `Featured carousel ${index + 1}`
            const headingId = `${id}-carousel-${index}-heading`
            return (
              <React.Fragment key={`${id}-${index}`}>
                <h3 id={headingId} className="sr-only">
                  {label}
                </h3>
                <CarouselCard
                  {...carousel}
                  ariaLabel={label}
                  className="aspect-[418/286] w-2/3 max-w-105 overflow-clip rounded-lg md:rounded-xl"
                />
              </React.Fragment>
            )
          })}
        </div>
        {canScrollLeft && (
          <IconButton
            aria-label="Scroll slider left"
            aria-disabled={!canScrollLeft}
            onClick={() => scrollCarousel('left')}
            className={cn(
              canScrollLeft
                ? ['hover:opacity-100 focus-visible:opacity-100 lg:opacity-40']
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
            aria-disabled={!canScrollRight}
            onClick={() => scrollCarousel('right')}
            className={cn(
              canScrollRight
                ? ['hover:opacity-100 focus-visible:opacity-100 lg:opacity-40']
                : ['opacity-0'],
              'mr-4 grid aspect-square place-content-center justify-self-end rounded-full bg-[#e4e4e4] p-1.5 text-[0.5rem] shadow shadow-current transition-all duration-200 dark:bg-[#1b1b1b] starting:opacity-0',
            )}
          >
            <span className="inline-block size-[1em] leading-none">
              &#9658;
            </span>
          </IconButton>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const chartWrapRef = React.useRef<HTMLDivElement>(null)
  const [canChartScrollLeft, setCanChartScrollLeft] = React.useState(false)
  const [canChartScrollRight, setCanChartScrollRight] = React.useState(false)
  const [timeframe, setTimeframe] = React.useState<
    '1-week' | '1-month' | '1-year'
  >('1-year')

  const overviewText = React.useMemo(() => {
    const now = new Date()
    const start = new Date()
    switch (timeframe) {
      case '1-week':
        start.setDate(now.getDate() - 7)
        return `the last 7 days`
      case '1-month': {
        start.setMonth(now.getMonth() - 1)
        const startYear = start.getFullYear()
        const nowYear = now.getFullYear()
        const startMonthString = start.toLocaleString('default', {
          month: 'long',
          year: startYear !== nowYear ? 'numeric' : undefined,
        })
        const nowMonthString = now.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        })
        return `${startMonthString} - ${nowMonthString}`
      }
      case '1-year':
      default: {
        start.setFullYear(now.getFullYear() - 1)
        const options: Intl.DateTimeFormatOptions = {
          month: 'short',
          year: 'numeric',
        }
        return `${start.toLocaleString('default', options)} - ${now.toLocaleString('default', options)}`
      }
    }
  }, [timeframe])

  const updateChartScrollState = () => {
    const el = chartWrapRef.current
    if (!el) return
    setCanChartScrollLeft(el.scrollLeft > 0)
    setCanChartScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  const scrollChart = (dir: 'left' | 'right') => {
    const el = chartWrapRef.current
    if (!el) return
    const scrollBy = Math.round(el.clientWidth * 0.6)
    el.scrollBy({
      left: dir === 'left' ? -scrollBy : scrollBy,
      behavior: 'smooth',
    })
  }

  React.useEffect(() => {
    const el = chartWrapRef.current
    if (!el) return
    updateChartScrollState()
    const onScroll = () => updateChartScrollState()
    window.addEventListener('resize', updateChartScrollState)
    el.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('resize', updateChartScrollState)
      el.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <React.Fragment>
      <header>
        <h1 className="font-semibold md:text-xl">
          Welcome, <span>Emmanuel</span>
        </h1>
      </header>
      <section className="mt-4 mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-2.25 rounded-lg border border-[#e4e4e4] bg-white py-4 md:space-y-4.5 lg:col-span-2 lg:rounded-2xl dark:border-[#1b1b1b] dark:bg-black">
          <div className="mx-auto flex w-11/12 items-center text-[0.625rem] md:text-xs">
            <div className="space-y-1.5 md:space-y-3">
              <h2 className="text-base font-semibold md:text-xl">
                Sales Overview
              </h2>
              <p
                className="text-[#606060] dark:text-[#9f9f9f]"
                aria-live="polite"
              >
                Showing overview for {overviewText}
              </p>
            </div>
            <button
              type="button"
              className="ml-auto rounded-full border border-[#d6d6d6] px-4.5 py-1.75 md:px-9 md:py-3.5 dark:border-[#292929]"
            >
              View Transactions
            </button>
          </div>
          <div className="space-y-2 md:space-y-4">
            <div className="border-b border-b-[#e4e4e4] pb-1.5 md:pb-3 dark:border-b-[#1b1b1b]">
              <fieldset className="mx-auto flex w-11/12 items-center justify-end gap-1.5 md:gap-3">
                <legend className="sr-only">Timeframe</legend>
                {[
                  { name: '1 Week', value: '1-week' },
                  { name: '1 Month', value: '1-month' },
                  { name: '1 Year', value: '1-year' },
                ].map((item) => (
                  <label
                    key={item.value}
                    htmlFor={item.value}
                    className="rounded px-2.5 py-1 text-xs text-[#3d3d3d] has-checked:bg-[#f5f5f5] has-checked:font-semibold md:rounded-lg md:px-5 md:py-2 md:text-sm dark:text-[#c2c2c2] dark:has-checked:bg-[#0a0a0a]"
                  >
                    <input
                      type="radio"
                      name="timeframe"
                      id={item.value}
                      className="sr-only"
                      value={item.value}
                      onChange={(e) =>
                        setTimeframe(e.target.value as typeof timeframe)
                      }
                      checked={item.value === timeframe}
                    />
                    {item.name}
                  </label>
                ))}
              </fieldset>
            </div>
            <div className="mx-auto grid w-11/12 grid-cols-1 gap-3 lg:grid-cols-9">
              <div className="grid grid-cols-1 grid-rows-1 items-center *:[grid-area:1/1] lg:col-span-5">
                <div
                  ref={chartWrapRef}
                  className="h-40 max-w-full overflow-auto"
                >
                  <Chart timeframe={timeframe} />
                </div>
                {canChartScrollLeft && (
                  <IconButton
                    aria-label="Scroll chart right"
                    aria-disabled={!canChartScrollLeft}
                    onClick={() => canChartScrollLeft && scrollChart('left')}
                    className={cn(
                      canChartScrollLeft
                        ? [
                            'hover:opacity-100 focus-visible:opacity-100 lg:opacity-40',
                          ]
                        : ['opacity-0'],
                      'mr-4 grid aspect-square place-content-center justify-self-end rounded-full bg-[#e4e4e4] p-1.5 text-[0.5rem] shadow shadow-current transition-all duration-200 dark:bg-[#1b1b1b] starting:opacity-0',
                    )}
                  >
                    <span className="inline-block size-[1em] leading-none">
                      &#9664;
                    </span>
                  </IconButton>
                )}
                {canChartScrollRight && (
                  <IconButton
                    aria-label="Scroll chart right"
                    aria-disabled={!canChartScrollRight}
                    onClick={() => canChartScrollRight && scrollChart('right')}
                    className={cn(
                      canChartScrollRight
                        ? [
                            'hover:opacity-100 focus-visible:opacity-100 lg:opacity-40',
                          ]
                        : ['opacity-0'],
                      'mr-4 grid aspect-square place-content-center justify-self-end rounded-full bg-[#e4e4e4] p-1.5 text-[0.5rem] shadow shadow-current transition-all duration-200 dark:bg-[#1b1b1b] starting:opacity-0',
                    )}
                  >
                    <span className="inline-block size-[1em] leading-none">
                      &#9658;
                    </span>
                  </IconButton>
                )}
              </div>
              <div
                className={cn(
                  'grid grid-cols-2 gap-2 md:gap-4 lg:col-span-full lg:col-start-6',
                  '*:rounded-lg *:border *:border-[#e4e4e4] *:bg-white *:py-1.75 *:md:rounded-xl md:*:py-3.5 dark:*:border-[#1b1b1b] dark:*:bg-black',
                )}
              >
                <CardThing
                  title="Total Inflow"
                  value={120000000.0}
                  previousValue={117000000.0}
                  accentColor="#4545FE"
                />
                <CardThing
                  title="MRR"
                  value={50000000.0}
                  previousValue={48750000.0}
                  accentColor="#12B76A"
                />
                <CardThing
                  title="Commission Revenue"
                  value={200000000.0}
                  previousValue={201000000.0}
                  accentColor="#14B8A6"
                />
                <CardThing
                  title="GMV"
                  value={100000000.0}
                  previousValue={100500000.0}
                  accentColor="#F04438"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-5 lg:*:col-span-2">
          <OverviewCard
            title="Listings Overview"
            titleId="listings-overview"
            metrics={[
              { label: 'Total', value: 1_800 },
              { label: 'Active', value: 80 },
              { label: 'Archived', value: 1_000 },
            ]}
            icon={<SolarHomeLinear />}
          />
          <OverviewCard
            title="Users Overview"
            titleId="users-overview"
            metrics={[
              { label: 'Total', value: 20_700 },
              { label: 'Riders', value: 8_500 },
              { label: 'Subscribers', value: 7_500 },
            ]}
            icon={<Profile1 />}
          />
        </div>
      </section>
      <CarouselStrip carousels={carousels} />
    </React.Fragment>
  )
}

const carousels = [
  {
    ariaLabel: 'Landscape highlights carousel',
    items: [
      {
        imageSrc:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba',
        imageAlt: 'A majestic mountain range at dawn.',
        title: 'Mountain Vistas',
        description:
          'Experience the breathtaking views from the highest peaks.',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
        imageAlt: 'A serene path through a lush green forest.',
        title: 'Forest Trails',
        description: 'Get lost in the beauty of nature and ancient woods.',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1519046904884-53103b34b206',
        imageAlt: 'A beautiful beach with golden sand and turquoise water.',
        title: 'Sunny Beaches',
        description: 'Relax and unwind on pristine sandy shores.',
      },
    ],
  },
  {
    ariaLabel: 'Urban scenes carousel',
    items: [
      {
        imageSrc:
          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
        imageAlt: 'A stunning skyline of a modern metropolis at night.',
        title: 'City Skylines',
        description: 'Explore the vibrant and dynamic life of the city.',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1533929736458-ca588d08c8be',
        imageAlt: 'A historic street with charming old architecture.',
        title: 'Historic Alleys',
        description: 'Wander through the narrow streets of history.',
      },
    ],
  },
  {
    ariaLabel: 'Food highlights carousel',
    items: [
      {
        imageSrc:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
        imageAlt: 'A delicious and cheesy pizza on a wooden board.',
        title: 'Gourmet Pizzas',
        description: 'Indulge in the finest handcrafted pizzas.',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
        imageAlt: 'A colorful platter of fresh sushi rolls.',
        title: 'Fresh Sushi',
        description: 'Savor the authentic taste of Japanese cuisine.',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
        imageAlt: 'A rich and decadent chocolate cake with berries.',
        title: 'Decadent Desserts',
        description: 'Satisfy your sweet tooth with our exquisite desserts.',
      },
      {
        imageSrc:
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
        imageAlt: 'A fresh and healthy salad in a white bowl.',
        title: 'Healthy Salads',
        description: 'Enjoy a light and refreshing meal.',
      },
    ],
  },
  {
    ariaLabel: 'Wildlife wonders carousel',
    items: [
      {
        imageSrc:
          'https://images.unsplash.com/photo-1720309911923-a5423123147e',
        imageAlt: 'A majestic lion with a golden mane looking to the side.',
        title: 'King of the Savanna',
        description: 'Witness the power and grace of wild lions.',
      },
      {
        imageSrc: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46',
        imageAlt: 'An adult elephant walking through a grassy field.',
        title: 'Gentle Giants',
        description: 'Discover the intelligence and beauty of elephants.',
      },
      {
        imageSrc: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
        imageAlt: 'A colorful toucan with a large yellow beak on a branch.',
        title: 'Tropical Birds',
        description: 'Explore the vibrant colors of the rainforest canopy.',
      },
    ],
  },
  {
    ariaLabel: 'Modern technology carousel',
    items: [
      {
        imageSrc:
          'https://images.unsplash.com/photo-1518770660439-4636190af475',
        imageAlt: 'A close-up of a computer motherboard and its circuits.',
        title: 'Complex Circuits',
        description: 'The intricate beauty of modern hardware.',
      },
      {
        imageSrc: 'https://images.unsplash.com/photo-1550439062-609e1531270e',
        imageAlt: 'A laptop screen showing lines of programming code.',
        title: 'Lines of Code',
        description: 'Building the future one function at a time.',
      },
    ],
  },
]

import React from 'react'
import { cn, withViewTransition } from '~/lib/utils'

export default React.memo(function CarouselCard({
  items,
  interval = 5000,
  resumeAfter = 5000,
  className = '',
  ariaLabel,
}: CarouselCardProps) {
  const count = items?.length ?? 0
  const [index, setIndex] = React.useState(0)
  const [isInteracting, setIsInteracting] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const interactTimerRef = React.useRef<number>(null)
  const autoplayRef = React.useRef<number>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const touchStartX = React.useRef<number>(null)

  const clearInteractTimer = () => {
    if (interactTimerRef.current) {
      window.clearTimeout(interactTimerRef.current)
      interactTimerRef.current = null
    }
  }

  const scheduleResume = () => {
    clearInteractTimer()
    interactTimerRef.current = window.setTimeout(() => {
      setIsInteracting(false)
      interactTimerRef.current = null
    }, resumeAfter)
  }

  const handleInteraction = () => {
    setIsInteracting(true)
    scheduleResume()
  }

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )

    observer.observe(container)

    return () => {
      observer.unobserve(container)
    }
  }, [])

  React.useEffect(() => {
    // autoplay effect
    if (count <= 1) return

    const tick = () =>
      withViewTransition(() => setIndex((i) => (i + 1) % count))

    const startAutoplay = () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current)
      }
      if (!isVisible || isInteracting) return
      autoplayRef.current = window.setInterval(tick, interval)
    }

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }

    if (isVisible && !isInteracting) {
      startAutoplay()
    } else {
      stopAutoplay()
    }

    return () => {
      stopAutoplay()
      clearInteractTimer()
    }
  }, [count, interval, isInteracting, isVisible])

  const onTouchStart = (e: React.TouchEvent) => {
    handleInteraction()
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current
    if (start == null) return
    const end = e.changedTouches[0].clientX
    const dx = end - start
    const threshold = 40
    if (dx > threshold) {
      withViewTransition(() => setIndex((i) => (i - 1 + count) % count))
    } else if (dx < -threshold) {
      withViewTransition(() => setIndex((i) => (i + 1) % count))
    }
    touchStartX.current = null
  }

  if (!items || items.length === 0) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        'grid grid-cols-1 grid-rows-1 *:[grid-area:1/1]',
        className,
      )}
      onMouseEnter={handleInteraction}
      onMouseLeave={scheduleResume}
      onFocus={handleInteraction}
      onBlur={scheduleResume}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel ?? `Carousel with ${count} items`}
    >
      <article
        key={items[index].imageSrc}
        className="grid grid-cols-1 grid-rows-1 bg-cover bg-center bg-no-repeat *:[grid-area:1/1]"
        style={{ backgroundImage: `url(${items[index].imageSrc})` }}
      >
        <i
          aria-hidden
          className="bg-gradient-to-b from-black/5 to-black/60 dark:from-white/5 dark:to-white/60"
        />
        <div className="text-background flex flex-col p-2.5 font-semibold md:text-lg">
          <h3 className="mt-auto line-clamp-1 text-xs font-medium uppercase md:text-sm">
            {items[index].title}
          </h3>
          <p className="line-clamp-1">{items[index].description}</p>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 self-center justify-self-end">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  handleInteraction()
                  setIndex(i)
                }}
                aria-label={`Show slide ${i + 1}: ${items[i].title}`}
                aria-current={i === index}
                className={cn(
                  'size-1.5 rounded-full transition-all duration-200',
                  i === index
                    ? 'border border-[#e5e5e5] bg-white dark:border-[#1a1a1a] dark:bg-black'
                    : 'bg-white/20 dark:bg-black/20',
                )}
              />
            ))}
          </div>
        </div>
        {items[index].action && (
          <div className="mb-4 p-2.5">{items[index].action}</div>
        )}
      </article>
      <span className="sr-only static place-self-center" aria-live="polite">
        {`${index + 1} of ${count}: ${items[index].title}`}
      </span>
    </div>
  )
})

interface CarouselCardProps {
  items: CarouselItem[]
  interval?: number // ms between automatic advances
  resumeAfter?: number // ms of inactivity before resuming autoplay after interaction
  className?: string
  ariaLabel?: string
}

interface CarouselItem {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  action?: React.ReactNode
}

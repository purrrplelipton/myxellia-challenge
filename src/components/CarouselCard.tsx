import React from 'react'
import { cn, withViewTransition } from '~/lib/utils'

export default function CarouselCard({
  items,
  interval = 5000,
  resumeAfter = 5000,
  className = '',
}: CarouselCardProps) {
  const count = items?.length ?? 0
  const [index, setIndex] = React.useState(0)
  const [isInteracting, setIsInteracting] = React.useState(false)
  const interactTimerRef = React.useRef<number | null>(null)
  const autoplayRef = React.useRef<number | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const touchStartX = React.useRef<number | null>(null)

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
    // autoplay effect
    if (count <= 1) return

    const tick = () =>
      withViewTransition(() => setIndex((i) => (i + 1) % count))

    const startAutoplay = () => {
      if (autoplayRef.current) return
      autoplayRef.current = window.setInterval(() => {
        if (!isInteracting) tick()
      }, interval)
    }

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }

    startAutoplay()
    return () => {
      stopAutoplay()
      clearInteractTimer()
    }
  }, [count, interval, isInteracting, resumeAfter])

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
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Carousel with ${count} items`}
    >
      <article
        key={items[index].imageSrc}
        className="flex flex-col bg-black/60 bg-cover bg-center bg-no-repeat p-2.5 text-lg font-semibold bg-blend-overlay transition-all duration-500 ease-out"
        style={{ backgroundImage: `url(${items[index].imageSrc})` }}
      >
        <h3 className="mt-auto text-sm font-medium uppercase">
          {items[index].title}
        </h3>
        <p>{items[index].description}</p>
        <div className="mt-2.5 flex items-center justify-center gap-1.5 self-center justify-self-end">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                handleInteraction()
                withViewTransition(() => setIndex(i))
              }}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'size-1.5 rounded-full transition-all duration-200',
                i === index
                  ? 'border border-[#e5e5e5] bg-white'
                  : 'bg-white/20',
              )}
            />
          ))}
        </div>
      </article>
      <span
        className="sr-only static self-end justify-self-end"
        aria-live="polite"
      >
        {`${index + 1} of ${count}: ${items[index].title}`}
      </span>
    </div>
  )
}

interface CarouselCardProps {
  items: CarouselItem[]
  interval?: number // ms between automatic advances
  resumeAfter?: number // ms of inactivity before resuming autoplay after interaction
  className?: string
}

interface CarouselItem {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
}

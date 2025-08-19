'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/lib/utils'

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  children: React.ReactNode // the element that receives the tooltip
  content: React.ReactNode // tooltip content
  placement?: Placement
  open?: boolean // controlled open state
  defaultOpen?: boolean // uncontrolled initial state
  trigger?: 'hover' | 'click' | 'manual' // how tooltip is triggered
  delay?: { open?: number; close?: number }
  interactive?: boolean // whether tooltip can be focused / hovered
  className?: string // class for the tooltip box
  id?: string // optional id for aria
  maxWidth?: number | string
  hideArrow?: boolean // whether to render a pointer/arrow
  arrowSize?: number | { inline?: number; block?: number }
}

function useTimer() {
  const t = React.useRef<number | null>(null)
  React.useEffect(
    () => () => {
      if (t.current) window.clearTimeout(t.current)
    },
    [],
  )
  return {
    set: (fn: () => void, ms: number) => {
      if (t.current) window.clearTimeout(t.current)
      t.current = window.setTimeout(fn, ms) as unknown as number
    },
    clear: () => {
      if (t.current) window.clearTimeout(t.current)
      t.current = null
    },
  }
}

// Merge multiple refs into one callback ref
function useForkRef<T>(...refs: Array<React.Ref<T> | undefined>) {
  return React.useCallback((node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') {
        try {
          ref(node)
        } catch {
          // ignore
        }
      } else {
        try {
          ;(ref as React.RefObject<T | null>).current = node
        } catch {
          // ignore
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs)
}

export default function Tooltip({
  children,
  content,
  placement = 'top',
  open: controlledOpen,
  defaultOpen = false,
  trigger = 'hover',
  delay = { open: 80, close: 160 },
  interactive,
  className,
  id,
  maxWidth = 300,
  hideArrow,
  arrowSize = { inline: 16, block: 6 },
}: TooltipProps) {
  const uniqueId = React.useId()
  const idRef = React.useRef<string>(id ?? `tooltip-${uniqueId}`)
  const [open, setOpen] = React.useState<boolean>(defaultOpen)
  const isControlled = typeof controlledOpen === 'boolean'
  const visible = isControlled ? controlledOpen! : open

  const anchorRef = React.useRef<HTMLElement | null>(null)
  const tooltipRef = React.useRef<HTMLDivElement | null>(null)

  const openTimer = useTimer()
  const closeTimer = useTimer()

  const [coords, setCoords] = React.useState<{
    top: number
    left: number
    placement: Placement
  } | null>(null)

  const [arrowOffset, setArrowOffset] = React.useState<{
    left?: number
    top?: number
  } | null>(null)

  const arrow = React.useMemo(() => {
    if (typeof arrowSize === 'number')
      return { inline: arrowSize, block: arrowSize }
    return { inline: arrowSize?.inline ?? 16, block: arrowSize?.block ?? 6 }
  }, [arrowSize])

  const childElement = children as React.ReactElement<Record<string, unknown>>
  type OrigProps = Partial<React.HTMLAttributes<HTMLElement>> & {
    ref?: React.Ref<HTMLElement>
  }
  const origProps = (childElement.props ?? {}) as OrigProps
  const mergedRef = useForkRef<HTMLElement>(anchorRef, origProps.ref)

  // compute and set coords
  const updatePosition = React.useCallback(() => {
    const anchor = anchorRef.current
    const tip = tooltipRef.current
    if (!anchor || !tip) return

    const a = anchor.getBoundingClientRect()
    const t = tip.getBoundingClientRect()
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0,
    )
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0,
    )

    const space = {
      top: a.top,
      bottom: vh - a.bottom,
      left: a.left,
      right: vw - a.right,
    }

    let chosen: Placement = placement

    const fits = (p: Placement) => {
      switch (p) {
        case 'top':
          return space.top >= t.height + 6
        case 'bottom':
          return space.bottom >= t.height + 6
        case 'left':
          return space.left >= t.width + 6
        case 'right':
          return space.right >= t.width + 6
      }
    }

    if (!fits(chosen)) {
      const opposite: Record<Placement, Placement> = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
      }
      if (fits(opposite[chosen])) chosen = opposite[chosen]
      else {
        const sorted = (Object.keys(space) as (keyof typeof space)[])
          .sort((a, b) => (space[a] as number) - (space[b] as number))
          .reverse()
        chosen = sorted[0]
      }
    }

    let top = 0
    let left = 0
    const margin = 6

    switch (chosen) {
      case 'top':
        top = a.top - t.height - margin + window.scrollY
        left = a.left + a.width / 2 - t.width / 2 + window.scrollX
        break
      case 'bottom':
        top = a.bottom + margin + window.scrollY
        left = a.left + a.width / 2 - t.width / 2 + window.scrollX
        break
      case 'left':
        top = a.top + a.height / 2 - t.height / 2 + window.scrollY
        left = a.left - t.width - margin + window.scrollX
        break
      case 'right':
        top = a.top + a.height / 2 - t.height / 2 + window.scrollY
        left = a.right + margin + window.scrollX
        break
    }

    const pad = 4
    left = Math.max(
      pad + window.scrollX,
      Math.min(left, window.scrollX + vw - t.width - pad),
    )
    top = Math.max(
      pad + window.scrollY,
      Math.min(top, window.scrollY + vh - t.height - pad),
    )

    setCoords({ top, left, placement: chosen })

    if (!hideArrow) {
      const anchorCenterX = a.left + a.width / 2 + window.scrollX
      const anchorCenterY = a.top + a.height / 2 + window.scrollY

      if (chosen === 'top' || chosen === 'bottom') {
        const arrowInline = arrow.inline
        const relative = anchorCenterX - left - arrowInline / 2
        const clamped = Math.max(
          6,
          Math.min(relative, t.width - 6 - arrowInline),
        )
        setArrowOffset({ left: clamped })
      } else {
        const arrowInline = arrow.inline
        const relative = anchorCenterY - top - arrowInline / 2
        const clamped = Math.max(
          6,
          Math.min(relative, t.height - 6 - arrowInline),
        )
        setArrowOffset({ top: clamped })
      }
    } else {
      setArrowOffset(null)
    }
  }, [arrow.inline, hideArrow, placement])

  React.useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => updatePosition())
    }
  }, [visible, content, updatePosition])

  // listeners to update on resize/scroll
  React.useEffect(() => {
    if (!visible) return
    updatePosition()
    const onScroll = () => requestAnimationFrame(updatePosition)
    const onResize = () => requestAnimationFrame(updatePosition)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [visible, updatePosition])

  // outside click & escape to close
  React.useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isControlled) setOpen(false)
      }
    }
    const onDoc = (e: MouseEvent) => {
      const t = tooltipRef.current
      const a = anchorRef.current
      if (!t || !a) return
      const target = e.target as Node
      if (interactive) {
        if (t.contains(target) || a.contains(target)) return
      } else {
        if (a.contains(target)) return
      }
      if (!isControlled) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDoc)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDoc)
    }
  }, [visible, interactive, isControlled])

  const childCount = React.Children.count(children)
  const singleChildIsElement =
    childCount === 1 && React.isValidElement(children)

  if (!singleChildIsElement) {
    const message =
      '[Tooltip] Tooltip requires a single React element child (e.g. <button />).'
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`${message} Received children count: ${childCount}.`)
    }
    console.warn(message)
    return null
  }

  // helpers to open/close with delay
  const doOpen = () => {
    closeTimer.clear()
    openTimer.set(() => {
      if (!isControlled) setOpen(true)
    }, delay.open ?? 0)
  }

  const doClose = () => {
    openTimer.clear()
    closeTimer.set(() => {
      if (!isControlled) setOpen(false)
    }, delay.close ?? 0)
  }

  const composeHandler = <E extends unknown[]>(
    orig?: (...args: E) => unknown,
    next?: (...args: E) => void,
  ) => {
    if (!orig) return (next as (...args: E) => void) ?? (() => undefined)
    return (...args: E) => {
      next?.(...args)
      orig(...args)
    }
  }

  const anchorProps: Partial<React.HTMLAttributes<HTMLElement>> & {
    ref?: React.Ref<HTMLElement>
  } = {
    'aria-describedby': visible ? idRef.current : undefined,
  }

  if (trigger === 'hover') {
    anchorProps.onMouseEnter = composeHandler(origProps.onMouseEnter, doOpen)
    anchorProps.onMouseLeave = composeHandler(origProps.onMouseLeave, doClose)
    anchorProps.onFocus = composeHandler(origProps.onFocus, doOpen)
    anchorProps.onBlur = composeHandler(origProps.onBlur, doClose)
  } else if (trigger === 'click') {
    anchorProps.onClick = composeHandler(origProps.onClick, () => {
      if (!isControlled) setOpen((v) => !v)
    })
    anchorProps.onKeyDown = composeHandler(
      origProps.onKeyDown,
      (e?: React.KeyboardEvent<HTMLElement>) => {
        if (e && 'key' in e && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          if (!isControlled) setOpen((v) => !v)
        }
      },
    )
  }

  anchorProps.ref = mergedRef

  const clonedChild = React.cloneElement(childElement, anchorProps)

  return (
    <>
      {clonedChild}
      {visible &&
        createPortal(
          <div
            aria-hidden={!visible}
            data-placement={coords?.placement ?? placement}
            style={{ position: 'fixed', top: 0, left: 0 }}
          >
            <div
              ref={tooltipRef}
              id={idRef.current}
              role="tooltip"
              aria-hidden={!visible}
              className={cn(
                '__tooltip__root transition-all transition-discrete ease-in-out [--tw-drop-shadow-color:var(--tooltip-fg,_var(--background))] dark:[--tw-drop-shadow-color:var(--tooltip-bg,_var(--foreground))] starting:opacity-0',
                className,
              )}
              style={{
                filter:
                  'drop-shadow(1px 1px var(--tw-drop-shadow-color)) drop-shadow(-1px -1px var(--tw-drop-shadow-color))',
                position: 'fixed',
                top: coords ? `${coords.top}px` : '-9999px',
                left: coords ? `${coords.left}px` : '-9999px',
                maxWidth:
                  typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
                zIndex: 9999,
                pointerEvents: interactive ? 'auto' : 'none',
              }}
              onMouseEnter={() => {
                if (interactive) doOpen()
              }}
              onMouseLeave={() => {
                if (interactive) doClose()
              }}
            >
              {!hideArrow && arrowOffset && coords && (
                <i
                  className="__tooltip__arrow pointer-events-none bg-(--tooltip-bg,_var(--foreground))"
                  style={{
                    position: 'absolute',
                    width:
                      coords.placement === 'top' ||
                      coords.placement === 'bottom'
                        ? `${arrow.inline}px`
                        : `${arrow.block}px`,
                    height:
                      coords.placement === 'left' ||
                      coords.placement === 'right'
                        ? `${arrow.inline}px`
                        : `${arrow.block}px`,
                    left:
                      coords.placement === 'top' ||
                      coords.placement === 'bottom'
                        ? `${arrowOffset.left}px`
                        : undefined,
                    top:
                      coords.placement === 'left' ||
                      coords.placement === 'right'
                        ? `${arrowOffset.top}px`
                        : undefined,
                  }}
                  aria-hidden
                />
              )}
              <div
                className="__tooltip__box pointer-events-auto rounded-lg bg-(--tooltip-bg,_var(--foreground)) px-2.5 py-2 text-xs text-(--tooltip-fg,_var(--background))"
                aria-hidden={!visible}
              >
                {content}
              </div>
            </div>

            <style>{`
              @media (hover: none) { .__tooltip__root { display: none; } }
              /* top: tooltip above anchor => arrow points down */
              [data-placement="top"] .__tooltip__arrow { clip-path: polygon(50% 100%, 0 0, 100% 0); bottom: -${Math.round(arrow.block / 2)}px; }
              /* bottom: tooltip below anchor => arrow points up */
              [data-placement="bottom"] .__tooltip__arrow { clip-path: polygon(50% 0, 0 100%, 100% 100%); top: -${Math.round(arrow.block / 2)}px; }
              /* left: tooltip left of anchor => arrow points right */
              [data-placement="left"] .__tooltip__arrow { clip-path: polygon(100% 50%, 0 0, 0 100%); right: -${Math.round(arrow.block / 2)}px; }
              /* right: tooltip right of anchor => arrow points left */
              [data-placement="right"] .__tooltip__arrow { clip-path: polygon(0 50%, 100% 0, 100% 100%); left: -${Math.round(arrow.block / 2)}px; }
            `}</style>
          </div>,
          document.body,
        )}
    </>
  )
}

import { useState, useEffect, useCallback, useRef } from 'react'

const CURSOR_HIDE_DELAY_MS = 3000
const INPUT_TAG_NAMES = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

function isFullscreenSupported() {
  return typeof document !== 'undefined' && !!document.documentElement?.requestFullscreen
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => isFullscreenSupported() && !!document.fullscreenElement
  )
  const [cursorHidden, setCursorHidden] = useState(false)
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreenSupported()) return
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      if (!document.fullscreenElement) {
        setCursorHidden(false)
        clearTimeout(cursorTimerRef.current)
      }
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (INPUT_TAG_NAMES.has((e.target as HTMLElement | null)?.tagName ?? '')) return
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [toggleFullscreen])

  useEffect(() => {
    const startCursorTimer = () => {
      clearTimeout(cursorTimerRef.current)
      cursorTimerRef.current = setTimeout(() => {
        setCursorHidden(true)
      }, CURSOR_HIDE_DELAY_MS)
    }

    const resetCursorTimer = () => {
      setCursorHidden(false)
      if (document.fullscreenElement) {
        startCursorTimer()
      } else {
        clearTimeout(cursorTimerRef.current)
      }
    }

    if (isFullscreen) {
      startCursorTimer()
    }

    document.addEventListener('mousemove', resetCursorTimer)
    return () => {
      document.removeEventListener('mousemove', resetCursorTimer)
      clearTimeout(cursorTimerRef.current)
    }
  }, [isFullscreen])

  return { isFullscreen, cursorHidden, toggleFullscreen }
}

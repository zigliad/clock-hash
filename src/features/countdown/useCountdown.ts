import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { parseTarget, calcSecondsUntil, secondsToHms, formatCountdown } from '../../utils/countdown'

const REACHED_DURATION_MS = 3000

export function useCountdown(targetTime: string | null): {
  remaining: { hours: number; minutes: number; seconds: number } | null
  reached: boolean
  display: string | null
} {
  const [tick, setTick] = useState(0)
  const [reachedTarget, setReachedTarget] = useState<string | null>(null)
  const reachedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevSecondsRef = useRef<number | null>(null)

  const clearReachedTimeout = useCallback(() => {
    if (reachedTimeoutRef.current !== null) {
      clearTimeout(reachedTimeoutRef.current)
      reachedTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!targetTime) {
      prevSecondsRef.current = null
      clearReachedTimeout()
      return
    }

    clearReachedTimeout()
    const target = parseTarget(targetTime)
    prevSecondsRef.current = calcSecondsUntil(target, new Date())

    const interval = setInterval(() => {
      setTick((t) => (t + 1) % Number.MAX_SAFE_INTEGER)

      const seconds = calcSecondsUntil(target, new Date())
      const prev = prevSecondsRef.current
      if (prev !== null && prev > 0 && seconds <= 0) {
        setReachedTarget(targetTime)
        reachedTimeoutRef.current = setTimeout(() => {
          setReachedTarget(null)
          reachedTimeoutRef.current = null
        }, REACHED_DURATION_MS)
      }
      prevSecondsRef.current = seconds
    }, 1000)

    return () => {
      clearInterval(interval)
      clearReachedTimeout()
    }
  }, [targetTime, clearReachedTimeout])

  const remaining = useMemo(() => {
    void tick
    if (!targetTime) return null
    const target = parseTarget(targetTime)
    const seconds = calcSecondsUntil(target, new Date())
    return secondsToHms(seconds)
  }, [targetTime, tick])

  const reached = reachedTarget === targetTime && targetTime !== null
  const display = remaining ? formatCountdown(remaining) : null

  return { remaining, reached, display }
}

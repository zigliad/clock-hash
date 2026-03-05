import { useState, useCallback, useMemo } from 'react'
import { DEFAULT_TIMEZONES, getCityName } from '../../utils/timezones'

const STORAGE_KEY = 'clock-hash-custom-timezones'

interface TimezoneEntry {
  zone: string
  label: string
}

function isValidTimezoneEntry(entry: unknown): entry is TimezoneEntry {
  return (
    !!entry &&
    typeof (entry as TimezoneEntry).zone === 'string' &&
    typeof (entry as TimezoneEntry).label === 'string'
  )
}

function loadTimezones(): TimezoneEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_TIMEZONES
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length !== DEFAULT_TIMEZONES.length) {
      return DEFAULT_TIMEZONES
    }
    if (!parsed.every(isValidTimezoneEntry)) return DEFAULT_TIMEZONES
    return parsed
  } catch {
    return DEFAULT_TIMEZONES
  }
}

function persist(timezones: TimezoneEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timezones))
  } catch {
    // localStorage unavailable
  }
}

export function useCustomTimezones() {
  const [timezones, setTimezones] = useState<TimezoneEntry[]>(loadTimezones)

  const isCustomized = useMemo(() => {
    return timezones.some((tz, i) => tz.zone !== DEFAULT_TIMEZONES[i].zone)
  }, [timezones])

  const updateTimezone = useCallback((index: number, ianaZone: string) => {
    setTimezones((prev) => {
      if (index < 0 || index >= prev.length) return prev
      const next = [...prev]
      next[index] = { label: getCityName(ianaZone), zone: ianaZone }
      persist(next)
      return next
    })
  }, [])

  const resetTimezones = useCallback(() => {
    setTimezones(DEFAULT_TIMEZONES)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { timezones, isCustomized, updateTimezone, resetTimezones }
}

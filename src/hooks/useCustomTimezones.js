import { useState, useCallback, useMemo } from 'react'
import { DEFAULT_TIMEZONES, getCityName } from '../timezones'

const STORAGE_KEY = 'clock-hash-custom-timezones'

function isValidTimezoneEntry(entry) {
  return entry && typeof entry.zone === 'string' && typeof entry.label === 'string'
}

function loadTimezones() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_TIMEZONES
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length !== DEFAULT_TIMEZONES.length) {
      return DEFAULT_TIMEZONES
    }
    if (!parsed.every(isValidTimezoneEntry)) return DEFAULT_TIMEZONES
    return parsed
  } catch {
    return DEFAULT_TIMEZONES
  }
}

function persist(timezones) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timezones))
  } catch {
    // localStorage unavailable
  }
}

export function useCustomTimezones() {
  const [timezones, setTimezones] = useState(loadTimezones)

  const isCustomized = useMemo(() => {
    return timezones.some((tz, i) => tz.zone !== DEFAULT_TIMEZONES[i].zone)
  }, [timezones])

  const updateTimezone = useCallback((index, ianaZone) => {
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

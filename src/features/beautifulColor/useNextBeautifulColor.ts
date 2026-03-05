import { useState, useEffect, useMemo } from 'react'
import { findNextBeautifulTime } from '../../utils/beautifulColor'

const TICK_INTERVAL_MS = 1000
const RESCAN_INTERVAL_MS = 60000
const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / SECONDS_IN_HOUR)
  const m = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE)
  const s = totalSeconds % SECONDS_IN_MINUTE
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function getCurrentSeconds() {
  const now = new Date()
  return now.getHours() * SECONDS_IN_HOUR + now.getMinutes() * SECONDS_IN_MINUTE + now.getSeconds()
}

function performScan(is24h: boolean): { secondsUntil: number; hex: string; label: string; scannedAt: number } | null {
  const seconds = getCurrentSeconds()
  const found = findNextBeautifulTime(seconds, is24h)
  return found ? { ...found, scannedAt: seconds } : null
}

export function useNextBeautifulColor(is24h: boolean): { label: string; display: string } | null {
  const [tick, setTick] = useState(0)
  const [scanData, setScanData] = useState(() => performScan(is24h))

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setTick((t) => t + 1)
    }, TICK_INTERVAL_MS)

    const rescanInterval = setInterval(() => {
      setScanData(performScan(is24h))
    }, RESCAN_INTERVAL_MS)

    return () => {
      clearInterval(tickInterval)
      clearInterval(rescanInterval)
    }
  }, [is24h])

  const result = useMemo(() => {
    void tick
    if (!scanData) return null

    const currentSecs = getCurrentSeconds()
    const elapsed = ((currentSecs - scanData.scannedAt) + SECONDS_IN_DAY) % SECONDS_IN_DAY
    const remaining = scanData.secondsUntil - elapsed
    if (remaining <= 0) return null

    return { label: scanData.label, display: formatCountdown(remaining) }
  }, [tick, scanData])

  return result
}

const STORAGE_KEY = 'clock-hash-time-format'
const FORMAT_24H = '24h'
const FORMAT_12H = '12h'

export { STORAGE_KEY, FORMAT_24H, FORMAT_12H }

export function convertTo12Hour(timeStr: string): string {
  const [h, m, s] = timeStr.split(':')
  const hour24 = parseInt(h, 10)
  const hour12 = hour24 % 12 || 12
  return `${String(hour12).padStart(2, '0')}:${m}:${s}`
}

export function loadTimeFormat(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === FORMAT_12H ? FORMAT_12H : FORMAT_24H
  } catch {
    return FORMAT_24H
  }
}

export function saveTimeFormat(format: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, format)
  } catch {
    // localStorage unavailable
  }
}

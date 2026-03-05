export function getLocalTime(): string {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function timeToColor(time: string): string {
  const hex = time.replace(/:/g, '')
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return `#${hex}`
  }
  return '#000000'
}

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 86400

export function incrementTime(hhmmss: string): string {
  const [h, m, s] = hhmmss.split(':').map(Number)
  let totalSeconds = h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s + 1
  totalSeconds = totalSeconds % SECONDS_PER_DAY

  const newH = Math.floor(totalSeconds / SECONDS_PER_HOUR)
  const newM = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const newS = totalSeconds % SECONDS_PER_MINUTE

  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}`
}

export function getLightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b
}

import { CSS_COLORS } from './cssColors'

export const MAX_SCAN_SECONDS = 43200
const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60
const MIN_SATURATION = 0.7
const MIN_LIGHTNESS = 0.3
const MAX_LIGHTNESS = 0.7

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2

  if (max === min) {
    return { h: 0, s: 0, l }
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60
  else if (max === gn) h = ((bn - rn) / d + 2) * 60
  else h = ((rn - gn) / d + 4) * 60

  return { h, s, l }
}

export function isExactCssColor(r: number, g: number, b: number): string | null {
  for (const color of CSS_COLORS) {
    if (color.r === r && color.g === g && color.b === b) {
      return color.name
    }
  }
  return null
}

export function isBeautiful(hex: string): { type: 'named' | 'high-saturation'; name: string } | null {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const name = isExactCssColor(r, g, b)
  if (name) {
    return { type: 'named' as const, name }
  }

  const { s, l } = rgbToHsl(r, g, b)
  if (s > MIN_SATURATION && l >= MIN_LIGHTNESS && l <= MAX_LIGHTNESS) {
    return { type: 'high-saturation' as const, name: 'high-saturation color' }
  }

  return null
}

export function timeStringToHex(timeStr: string): string {
  const hex = timeStr.replace(/:/g, '')
  return /^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex}` : '#000000'
}

export function secondsToTimeStr(totalSeconds: number, is24h: boolean): string {
  const wrapped = ((totalSeconds % SECONDS_IN_DAY) + SECONDS_IN_DAY) % SECONDS_IN_DAY
  const h = Math.floor(wrapped / SECONDS_IN_HOUR)
  const m = Math.floor((wrapped % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE)
  const s = wrapped % SECONDS_IN_MINUTE

  let hour = h
  if (!is24h) {
    hour = h % 12
    if (hour === 0) hour = 12
  }

  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function findNextBeautifulTime(currentSeconds: number, is24h: boolean): { secondsUntil: number; hex: string; label: string } | null {
  for (let offset = 1; offset <= MAX_SCAN_SECONDS; offset++) {
    const timeStr = secondsToTimeStr(currentSeconds + offset, is24h)
    const hex = timeStringToHex(timeStr)
    const result = isBeautiful(hex)
    if (result) {
      return {
        secondsUntil: offset,
        hex,
        label: result.name,
      }
    }
  }
  return null
}

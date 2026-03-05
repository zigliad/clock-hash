import { describe, it, expect } from 'vitest'
import {
  rgbToHsl,
  isExactCssColor,
  isBeautiful,
  timeStringToHex,
  secondsToTimeStr,
  findNextBeautifulTime,
  MAX_SCAN_SECONDS,
} from './beautifulColor'

describe('rgbToHsl', () => {
  it('converts pure red', () => {
    const { h, s, l } = rgbToHsl(255, 0, 0)
    expect(h).toBeCloseTo(0)
    expect(s).toBeCloseTo(1)
    expect(l).toBeCloseTo(0.5)
  })

  it('converts pure green', () => {
    const { h, s, l } = rgbToHsl(0, 128, 0)
    expect(h).toBeCloseTo(120)
    expect(s).toBeCloseTo(1)
    expect(l).toBeCloseTo(0.251, 1)
  })

  it('converts white to zero saturation', () => {
    const { s } = rgbToHsl(255, 255, 255)
    expect(s).toBe(0)
  })

  it('converts black to zero saturation', () => {
    const { s, l } = rgbToHsl(0, 0, 0)
    expect(s).toBe(0)
    expect(l).toBe(0)
  })
})

describe('isExactCssColor', () => {
  it('finds exact match for red', () => {
    const result = isExactCssColor(255, 0, 0)
    expect(result).toBe('red')
  })

  it('finds exact match for coral', () => {
    const result = isExactCssColor(255, 127, 80)
    expect(result).toBe('coral')
  })

  it('returns null for non-matching color', () => {
    const result = isExactCssColor(1, 2, 3)
    expect(result).toBeNull()
  })
})

describe('isBeautiful', () => {
  it('returns match for exact CSS named color', () => {
    const result = isBeautiful('#ff0000')
    expect(result).toEqual({ type: 'named', name: 'red' })
  })

  it('returns match for high-saturation color', () => {
    const result = isBeautiful('#0066cc')
    expect(result).not.toBeNull()
    expect(result!.type).toBe('high-saturation')
  })

  it('returns null for low-saturation color', () => {
    const result = isBeautiful('#818283')
    expect(result).toBeNull()
  })

  it('returns null for too-dark high-saturation color', () => {
    const result = isBeautiful('#100020')
    expect(result).toBeNull()
  })

  it('returns null for too-light high-saturation color', () => {
    const result = isBeautiful('#eeccff')
    expect(result).toBeNull()
  })
})

describe('timeStringToHex', () => {
  it('converts valid time to hex', () => {
    expect(timeStringToHex('14:22:10')).toBe('#142210')
  })

  it('converts midnight to hex', () => {
    expect(timeStringToHex('00:00:00')).toBe('#000000')
  })

  it('handles time with all valid hex digits', () => {
    expect(timeStringToHex('12:34:56')).toBe('#123456')
  })
})

describe('secondsToTimeStr', () => {
  it('converts 0 seconds to midnight in 24h', () => {
    expect(secondsToTimeStr(0, true)).toBe('00:00:00')
  })

  it('converts midday in 24h', () => {
    expect(secondsToTimeStr(43200, true)).toBe('12:00:00')
  })

  it('converts 14:30:22 in 24h', () => {
    expect(secondsToTimeStr(52222, true)).toBe('14:30:22')
  })

  it('converts midnight in 12h to 12:00:00', () => {
    expect(secondsToTimeStr(0, false)).toBe('12:00:00')
  })

  it('converts 13:00:00 in 12h to 01:00:00', () => {
    expect(secondsToTimeStr(46800, false)).toBe('01:00:00')
  })

  it('wraps around 86400 seconds', () => {
    expect(secondsToTimeStr(86400, true)).toBe('00:00:00')
  })
})

describe('findNextBeautifulTime', () => {
  it('finds a beautiful time from midnight in 24h', () => {
    const result = findNextBeautifulTime(0, true)
    expect(result).not.toBeNull()
    expect(result!.secondsUntil).toBeGreaterThan(0)
    expect(result!.hex).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(typeof result!.label).toBe('string')
    expect(result!.label.length).toBeGreaterThan(0)
  })

  it('does not exceed 12 hour scan window', () => {
    const result = findNextBeautifulTime(0, true)
    expect(result).not.toBeNull()
    expect(result!.secondsUntil).toBeLessThanOrEqual(MAX_SCAN_SECONDS)
  })

  it('skips the current second (offset starts at 1)', () => {
    const result = findNextBeautifulTime(0, true)
    expect(result).not.toBeNull()
    expect(result!.secondsUntil).toBeGreaterThanOrEqual(1)
  })

  it('finds a beautiful time in 12h mode', () => {
    const result = findNextBeautifulTime(0, false)
    expect(result).not.toBeNull()
    expect(result!.secondsUntil).toBeGreaterThan(0)
  })

  it('returns a non-empty label string', () => {
    const result = findNextBeautifulTime(0, true)
    expect(result).not.toBeNull()
    expect(result!.label).toBeTruthy()
    expect(typeof result!.label).toBe('string')
  })
})

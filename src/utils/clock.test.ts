import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getLocalTime, timeToColor, getLightness, incrementTime } from './clock'

describe('clock utils', () => {
  describe('getLocalTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns time in HH:MM:SS format', () => {
      vi.setSystemTime(new Date('2026-03-05T14:30:45'))
      expect(getLocalTime()).toBe('14:30:45')
    })

    it('zero-pads single digit values', () => {
      vi.setSystemTime(new Date('2026-01-01T01:02:03'))
      expect(getLocalTime()).toBe('01:02:03')
    })
  })

  describe('timeToColor', () => {
    it('converts valid time to hex color', () => {
      expect(timeToColor('14:3a:52')).toBe('#143a52')
    })

    it('returns hex for valid hex time like 23:59:59', () => {
      expect(timeToColor('23:59:59')).toBe('#235959')
    })

    it('returns black for time with non-hex digits', () => {
      expect(timeToColor('23:GG:59')).toBe('#000000')
    })

    it('handles midnight', () => {
      expect(timeToColor('00:00:00')).toBe('#000000')
    })

    it('returns black for 12h format with AM/PM', () => {
      expect(timeToColor('02:30:00 AM')).toBe('#000000')
    })
  })

  describe('incrementTime', () => {
    it('increments seconds normally', () => {
      expect(incrementTime('14:30:22')).toBe('14:30:23')
    })

    it('rolls over seconds to next minute', () => {
      expect(incrementTime('14:30:59')).toBe('14:31:00')
    })

    it('rolls over minutes to next hour', () => {
      expect(incrementTime('14:59:59')).toBe('15:00:00')
    })

    it('rolls over midnight', () => {
      expect(incrementTime('23:59:59')).toBe('00:00:00')
    })

    it('handles start of day', () => {
      expect(incrementTime('00:00:00')).toBe('00:00:01')
    })
  })

  describe('getLightness', () => {
    it('returns 0 for black', () => {
      expect(getLightness('#000000')).toBe(0)
    })

    it('returns ~1 for white', () => {
      expect(getLightness('#ffffff')).toBeCloseTo(1, 2)
    })

    it('returns value between 0 and 1', () => {
      const result = getLightness('#143a52')
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(1)
    })
  })
})

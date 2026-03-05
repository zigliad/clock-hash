import { describe, it, expect } from 'vitest'
import { parseTarget, calcSecondsUntil, secondsToHms, formatCountdown, isValidTimeInput } from './countdown'

describe('countdown utils', () => {
  describe('parseTarget', () => {
    it('parses HH:MM string', () => {
      expect(parseTarget('17:00')).toEqual({ hours: 17, minutes: 0 })
      expect(parseTarget('09:30')).toEqual({ hours: 9, minutes: 30 })
    })
  })

  describe('calcSecondsUntil', () => {
    it('calculates seconds until a future time today', () => {
      const now = new Date('2026-03-05T14:30:00')
      const result = calcSecondsUntil({ hours: 17, minutes: 0 }, now)
      expect(result).toBe(9000)
    })

    it('wraps to tomorrow for past times', () => {
      const now = new Date('2026-03-05T14:30:00')
      const result = calcSecondsUntil({ hours: 10, minutes: 0 }, now)
      expect(result).toBe(70200)
    })

    it('returns 0 when target equals now', () => {
      const now = new Date('2026-03-05T14:30:00')
      const result = calcSecondsUntil({ hours: 14, minutes: 30 }, now)
      expect(result).toBe(0)
    })
  })

  describe('secondsToHms', () => {
    it('converts seconds to hours, minutes, seconds', () => {
      expect(secondsToHms(9000)).toEqual({ hours: 2, minutes: 30, seconds: 0 })
      expect(secondsToHms(3661)).toEqual({ hours: 1, minutes: 1, seconds: 1 })
      expect(secondsToHms(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 })
    })
  })

  describe('formatCountdown', () => {
    it('formats countdown display string', () => {
      expect(formatCountdown({ hours: 2, minutes: 30, seconds: 0 })).toBe('in 2h 30m 00s')
      expect(formatCountdown({ hours: 0, minutes: 5, seconds: 9 })).toBe('in 0h 05m 09s')
    })
  })

  describe('isValidTimeInput', () => {
    it('accepts valid HH:MM strings', () => {
      expect(isValidTimeInput('17:00')).toBe(true)
      expect(isValidTimeInput('00:00')).toBe(true)
      expect(isValidTimeInput('23:59')).toBe(true)
    })

    it('rejects invalid inputs', () => {
      expect(isValidTimeInput('')).toBe(false)
      expect(isValidTimeInput(null)).toBe(false)
      expect(isValidTimeInput('25:00')).toBe(false)
      expect(isValidTimeInput('12:60')).toBe(false)
      expect(isValidTimeInput('abc')).toBe(false)
      expect(isValidTimeInput('1:30')).toBe(false)
    })
  })
})

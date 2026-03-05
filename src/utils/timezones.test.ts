import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TIMEZONES, getTimeForTimezone } from './timezones'

describe('TIMEZONES', () => {
  it('exports an array of 5 default timezones', () => {
    expect(TIMEZONES).toHaveLength(5)
  })

  it('contains UTC, New York, London, Tokyo, Sydney', () => {
    const labels = TIMEZONES.map((tz) => tz.label)
    expect(labels).toEqual(['UTC', 'New York', 'London', 'Tokyo', 'Sydney'])
  })

  it('each timezone has a label and a valid IANA zone', () => {
    const validZones = [
      'UTC',
      'America/New_York',
      'Europe/London',
      'Asia/Tokyo',
      'Australia/Sydney',
    ]
    TIMEZONES.forEach((tz, i) => {
      expect(tz).toHaveProperty('label')
      expect(tz).toHaveProperty('zone')
      expect(tz.zone).toBe(validZones[i])
    })
  })
})

describe('getTimeForTimezone', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a string in HH:MM:SS format', () => {
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
    const result = getTimeForTimezone('UTC')
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('returns 12:00:00 for UTC at noon UTC', () => {
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
    const result = getTimeForTimezone('UTC')
    expect(result).toBe('12:00:00')
  })

  it('returns correct time for Asia/Tokyo (UTC+9)', () => {
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
    const result = getTimeForTimezone('Asia/Tokyo')
    expect(result).toBe('21:00:00')
  })

  it('returns correct time for America/New_York (UTC-5 in winter)', () => {
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'))
    const result = getTimeForTimezone('America/New_York')
    expect(result).toBe('07:00:00')
  })

  it('pads single-digit hours, minutes, seconds with leading zeros', () => {
    vi.setSystemTime(new Date('2026-03-05T01:02:03Z'))
    const result = getTimeForTimezone('UTC')
    expect(result).toBe('01:02:03')
  })

  it('returns fallback for invalid timezone', () => {
    const result = getTimeForTimezone('Invalid/Zone')
    expect(result).toBe('00:00:00')
  })
})

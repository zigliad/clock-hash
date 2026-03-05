import { describe, it, expect, beforeEach } from 'vitest'
import {
  convertTo12Hour,
  loadTimeFormat,
  saveTimeFormat,
  STORAGE_KEY,
  FORMAT_24H,
  FORMAT_12H,
} from './timeFormat'

describe('convertTo12Hour', () => {
  it('converts 14:30:22 to 02:30:22', () => {
    expect(convertTo12Hour('14:30:22')).toBe('02:30:22')
  })

  it('converts 00:00:00 to 12:00:00', () => {
    expect(convertTo12Hour('00:00:00')).toBe('12:00:00')
  })

  it('converts 12:00:00 to 12:00:00', () => {
    expect(convertTo12Hour('12:00:00')).toBe('12:00:00')
  })

  it('converts 01:02:03 to 01:02:03', () => {
    expect(convertTo12Hour('01:02:03')).toBe('01:02:03')
  })

  it('converts 23:59:59 to 11:59:59', () => {
    expect(convertTo12Hour('23:59:59')).toBe('11:59:59')
  })

  it('converts 13:00:00 to 01:00:00', () => {
    expect(convertTo12Hour('13:00:00')).toBe('01:00:00')
  })
})

describe('loadTimeFormat', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns 24h by default when nothing stored', () => {
    expect(loadTimeFormat()).toBe(FORMAT_24H)
  })

  it('returns 12h when localStorage has 12h', () => {
    localStorage.setItem(STORAGE_KEY, FORMAT_12H)
    expect(loadTimeFormat()).toBe(FORMAT_12H)
  })

  it('returns 24h for invalid stored value', () => {
    localStorage.setItem(STORAGE_KEY, 'garbage')
    expect(loadTimeFormat()).toBe(FORMAT_24H)
  })
})

describe('saveTimeFormat', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists the format to localStorage', () => {
    saveTimeFormat(FORMAT_12H)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(FORMAT_12H)
  })
})

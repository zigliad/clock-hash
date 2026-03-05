import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCustomTimezones } from './useCustomTimezones'
import { DEFAULT_TIMEZONES } from '../../utils/timezones'

const STORAGE_KEY = 'clock-hash-custom-timezones'

describe('useCustomTimezones', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('returns default timezones when nothing is stored', () => {
    const { result } = renderHook(() => useCustomTimezones())
    expect(result.current.timezones).toEqual(DEFAULT_TIMEZONES)
  })

  it('returns isCustomized false initially', () => {
    const { result } = renderHook(() => useCustomTimezones())
    expect(result.current.isCustomized).toBe(false)
  })

  it('updates a timezone at a given index', () => {
    const { result } = renderHook(() => useCustomTimezones())
    act(() => {
      result.current.updateTimezone(0, 'Asia/Dubai')
    })
    expect(result.current.timezones[0]).toEqual({ label: 'Dubai', zone: 'Asia/Dubai' })
  })

  it('persists custom timezones to localStorage', () => {
    const { result } = renderHook(() => useCustomTimezones())
    act(() => {
      result.current.updateTimezone(2, 'Asia/Dubai')
    })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored[2].zone).toBe('Asia/Dubai')
  })

  it('loads persisted timezones from localStorage', () => {
    const custom = [
      { label: 'Dubai', zone: 'Asia/Dubai' },
      ...DEFAULT_TIMEZONES.slice(1),
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
    const { result } = renderHook(() => useCustomTimezones())
    expect(result.current.timezones[0].zone).toBe('Asia/Dubai')
  })

  it('returns isCustomized true when timezones differ from defaults', () => {
    const custom = [
      { label: 'Dubai', zone: 'Asia/Dubai' },
      ...DEFAULT_TIMEZONES.slice(1),
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
    const { result } = renderHook(() => useCustomTimezones())
    expect(result.current.isCustomized).toBe(true)
  })

  it('resets to default timezones', () => {
    const { result } = renderHook(() => useCustomTimezones())
    act(() => {
      result.current.updateTimezone(0, 'Asia/Dubai')
    })
    expect(result.current.timezones[0].zone).toBe('Asia/Dubai')
    act(() => {
      result.current.resetTimezones()
    })
    expect(result.current.timezones).toEqual(DEFAULT_TIMEZONES)
  })

  it('clears localStorage on reset', () => {
    const { result } = renderHook(() => useCustomTimezones())
    act(() => {
      result.current.updateTimezone(0, 'Asia/Dubai')
    })
    act(() => {
      result.current.resetTimezones()
    })
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('extracts city name from IANA timezone', () => {
    const { result } = renderHook(() => useCustomTimezones())
    act(() => {
      result.current.updateTimezone(0, 'America/Los_Angeles')
    })
    expect(result.current.timezones[0].label).toBe('Los Angeles')
  })

  it('handles single-segment timezone names', () => {
    const { result } = renderHook(() => useCustomTimezones())
    act(() => {
      result.current.updateTimezone(0, 'UTC')
    })
    expect(result.current.timezones[0].label).toBe('UTC')
  })

  it('ignores invalid localStorage data gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    const { result } = renderHook(() => useCustomTimezones())
    expect(result.current.timezones).toEqual(DEFAULT_TIMEZONES)
  })
})

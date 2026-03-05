import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T14:30:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null remaining when no target is set', () => {
    const { result } = renderHook(() => useCountdown(null))
    expect(result.current.remaining).toBeNull()
    expect(result.current.reached).toBe(false)
  })

  it('calculates remaining time to target', () => {
    const { result } = renderHook(() => useCountdown('17:00'))
    expect(result.current.remaining).toEqual({ hours: 2, minutes: 30, seconds: 0 })
    expect(result.current.reached).toBe(false)
  })

  it('ticks down each second', () => {
    const { result } = renderHook(() => useCountdown('17:00'))
    expect(result.current.remaining!.minutes).toBe(30)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.remaining!.seconds).toBe(59)
    expect(result.current.remaining!.minutes).toBe(29)
  })

  it('treats past times as tomorrow', () => {
    const { result } = renderHook(() => useCountdown('10:00'))
    // 10:00 is before 14:30, so it should be tomorrow
    // remaining = 24h - 4h30m = 19h30m
    expect(result.current.remaining!.hours).toBe(19)
    expect(result.current.remaining!.minutes).toBe(30)
  })

  it('sets reached to true when countdown hits zero', () => {
    const { result } = renderHook(() => useCountdown('14:31'))
    expect(result.current.reached).toBe(false)

    act(() => {
      vi.advanceTimersByTime(60 * 1000)
    })
    expect(result.current.reached).toBe(true)
  })

  it('reached state lasts for 3 seconds then resets', () => {
    const { result } = renderHook(() => useCountdown('14:31'))

    act(() => {
      vi.advanceTimersByTime(60 * 1000)
    })
    expect(result.current.reached).toBe(true)

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.reached).toBe(false)
  })

  it('formats remaining time as display string', () => {
    const { result } = renderHook(() => useCountdown('17:00'))
    expect(result.current.display).toBe('in 2h 30m 00s')
  })

  it('returns null display when no target', () => {
    const { result } = renderHook(() => useCountdown(null))
    expect(result.current.display).toBeNull()
  })
})

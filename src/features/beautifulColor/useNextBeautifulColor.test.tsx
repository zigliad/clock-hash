import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNextBeautifulColor } from './useNextBeautifulColor'

describe('useNextBeautifulColor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 2, 5, 0, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns result with label and display', () => {
    const { result } = renderHook(() => useNextBeautifulColor(true))
    act(() => { vi.advanceTimersByTime(0) })
    const value = result.current
    expect(value).not.toBeNull()
    expect(value).toHaveProperty('label')
    expect(value).toHaveProperty('display')
  })

  it('updates countdown every second', () => {
    const { result } = renderHook(() => useNextBeautifulColor(true))
    act(() => { vi.advanceTimersByTime(0) })
    const initial = result.current
    expect(initial).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).not.toBeNull()
    expect(result.current.display).not.toBe(initial.display)
  })

  it('re-scans every 60 seconds', () => {
    const { result } = renderHook(() => useNextBeautifulColor(true))
    act(() => { vi.advanceTimersByTime(0) })

    act(() => {
      vi.advanceTimersByTime(60000)
    })

    expect(result.current).not.toBeNull()
    expect(result.current).toHaveProperty('label')
  })
})

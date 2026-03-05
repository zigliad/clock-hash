import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimeFormat } from './useTimeFormat'
import { FORMAT_24H, FORMAT_12H, STORAGE_KEY } from '../../utils/timeFormat'

describe('useTimeFormat', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to 24h mode', () => {
    const { result } = renderHook(() => useTimeFormat())
    expect(result.current.is24h).toBe(true)
  })

  it('reads initial value from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, FORMAT_12H)
    const { result } = renderHook(() => useTimeFormat())
    expect(result.current.is24h).toBe(false)
  })

  it('toggles between 12h and 24h', () => {
    const { result } = renderHook(() => useTimeFormat())
    expect(result.current.is24h).toBe(true)
    act(() => result.current.toggle())
    expect(result.current.is24h).toBe(false)
    act(() => result.current.toggle())
    expect(result.current.is24h).toBe(true)
  })

  it('persists format to localStorage on toggle', () => {
    const { result } = renderHook(() => useTimeFormat())
    act(() => result.current.toggle())
    expect(localStorage.getItem(STORAGE_KEY)).toBe(FORMAT_12H)
  })
})

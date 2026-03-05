import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useColorHistory } from './useColorHistory'

describe('useColorHistory', () => {
  const BUFFER_SIZE = 60

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with an empty history', () => {
    const { result } = renderHook(() => useColorHistory('#112233'))
    expect(result.current).toEqual([])
  })

  it('adds an entry after 1 second', () => {
    const { result } = renderHook(() => useColorHistory('#112233'))
    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({ hex: '#112233' })
    expect(result.current[0].time).toBeDefined()
  })

  it('accumulates entries over multiple seconds', () => {
    const { result } = renderHook(() => useColorHistory('#aabbcc'))
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current).toHaveLength(5)
  })

  it('caps at 60 entries (circular buffer)', () => {
    const { result } = renderHook(() => useColorHistory('#aabbcc'))
    act(() => { vi.advanceTimersByTime(65000) })
    expect(result.current).toHaveLength(BUFFER_SIZE)
  })

  it('orders oldest first, newest last', () => {
    let color = '#000001'
    const { result, rerender } = renderHook(
      ({ c }) => useColorHistory(c),
      { initialProps: { c: color } },
    )
    act(() => { vi.advanceTimersByTime(1000) })
    color = '#000002'
    rerender({ c: color })
    act(() => { vi.advanceTimersByTime(1000) })

    expect(result.current[0].hex).toBe('#000001')
    expect(result.current[1].hex).toBe('#000002')
  })

  it('each entry has id, time and hex fields', () => {
    const { result } = renderHook(() => useColorHistory('#abcdef'))
    act(() => { vi.advanceTimersByTime(1000) })
    const entry = result.current[0]
    expect(entry).toHaveProperty('id')
    expect(entry).toHaveProperty('time')
    expect(entry).toHaveProperty('hex')
    expect(typeof entry.time).toBe('string')
    expect(entry.hex).toBe('#abcdef')
  })

  it('clears interval on unmount', () => {
    const { result, unmount } = renderHook(() => useColorHistory('#aabbcc'))
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current).toHaveLength(3)
    unmount()
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current).toHaveLength(3)
  })
})

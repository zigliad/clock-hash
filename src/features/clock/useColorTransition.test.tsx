import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useColorTransition } from './useColorTransition'

describe('useColorTransition', () => {
  let rafCallbacks: FrameRequestCallback[]
  let rafId: number

  beforeEach(() => {
    rafCallbacks = []
    rafId = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb)
      return ++rafId
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a color string', () => {
    const { result } = renderHook(() =>
      useColorTransition('#143022', '#143023')
    )
    expect(result.current).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('uses requestAnimationFrame for animation', () => {
    renderHook(() => useColorTransition('#143022', '#143023'))
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('cancels animation frame on unmount', () => {
    const { unmount } = renderHook(() =>
      useColorTransition('#143022', '#143023')
    )
    unmount()
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('interpolates between colors based on sub-second progress', () => {
    vi.spyOn(Date, 'now').mockReturnValue(500) // 500ms into second → t=0.5
    const { result } = renderHook(() =>
      useColorTransition('#000000', '#ffffff')
    )

    // Flush one rAF frame
    act(() => {
      if (rafCallbacks.length > 0) rafCallbacks[rafCallbacks.length - 1](0)
    })

    // At t=0.5, should be approximately #808080
    expect(result.current).toBe('#808080')
  })

  it('returns start color near second boundary (t≈0)', () => {
    vi.spyOn(Date, 'now').mockReturnValue(0) // 0ms into second → t=0
    const { result } = renderHook(() =>
      useColorTransition('#ff0000', '#00ff00')
    )

    act(() => {
      if (rafCallbacks.length > 0) rafCallbacks[rafCallbacks.length - 1](0)
    })

    expect(result.current).toBe('#ff0000')
  })

  it('restarts animation when colors change', () => {
    const { rerender } = renderHook(
      ({ from, to }) => useColorTransition(from, to),
      { initialProps: { from: '#000000', to: '#ffffff' } }
    )

    const rafSpy = window.requestAnimationFrame as ReturnType<typeof vi.fn>
    const callsBefore = rafSpy.mock.calls.length

    rerender({ from: '#ff0000', to: '#00ff00' })

    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    expect(rafSpy.mock.calls.length).toBeGreaterThan(callsBefore)
  })
})

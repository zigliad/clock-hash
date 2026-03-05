import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFullscreen } from './useFullscreen'

describe('useFullscreen', () => {
  let addSpy
  let removeSpy

  beforeEach(() => {
    vi.useFakeTimers()
    addSpy = vi.spyOn(document, 'addEventListener')
    removeSpy = vi.spyOn(document, 'removeEventListener')
    document.fullscreenElement = null
    document.documentElement.requestFullscreen = vi.fn().mockResolvedValue(undefined)
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('returns isFullscreen false initially', () => {
    const { result } = renderHook(() => useFullscreen())
    expect(result.current.isFullscreen).toBe(false)
  })

  it('returns cursorHidden false initially', () => {
    const { result } = renderHook(() => useFullscreen())
    expect(result.current.cursorHidden).toBe(false)
  })

  it('toggleFullscreen calls requestFullscreen when not in fullscreen', () => {
    const { result } = renderHook(() => useFullscreen())
    act(() => {
      result.current.toggleFullscreen()
    })
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled()
  })

  it('toggleFullscreen calls exitFullscreen when in fullscreen', () => {
    document.fullscreenElement = document.documentElement
    const { result } = renderHook(() => useFullscreen())

    act(() => {
      document.dispatchEvent(new Event('fullscreenchange'))
    })

    act(() => {
      result.current.toggleFullscreen()
    })
    expect(document.exitFullscreen).toHaveBeenCalled()
  })

  it('updates isFullscreen on fullscreenchange event', () => {
    const { result } = renderHook(() => useFullscreen())

    act(() => {
      document.fullscreenElement = document.documentElement
      document.dispatchEvent(new Event('fullscreenchange'))
    })

    expect(result.current.isFullscreen).toBe(true)

    act(() => {
      document.fullscreenElement = null
      document.dispatchEvent(new Event('fullscreenchange'))
    })

    expect(result.current.isFullscreen).toBe(false)
  })

  it('pressing F key toggles fullscreen', () => {
    renderHook(() => useFullscreen())
    const keyHandler = addSpy.mock.calls.find(([e]) => e === 'keydown')?.[1]
    expect(keyHandler).toBeDefined()

    act(() => {
      keyHandler(new KeyboardEvent('keydown', { key: 'f' }))
    })
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled()
  })

  it('does not toggle fullscreen when F is pressed in input element', () => {
    renderHook(() => useFullscreen())
    const keyHandler = addSpy.mock.calls.find(([e]) => e === 'keydown')?.[1]

    const input = document.createElement('input')
    const event = new KeyboardEvent('keydown', { key: 'f', bubbles: true })
    Object.defineProperty(event, 'target', { value: input })
    act(() => {
      keyHandler(event)
    })
    expect(document.documentElement.requestFullscreen).not.toHaveBeenCalled()
  })

  it('hides cursor after 3 seconds of inactivity in fullscreen', () => {
    const { result } = renderHook(() => useFullscreen())

    act(() => {
      document.fullscreenElement = document.documentElement
      document.dispatchEvent(new Event('fullscreenchange'))
    })

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.cursorHidden).toBe(true)
  })

  it('shows cursor on mouse move in fullscreen', () => {
    const { result } = renderHook(() => useFullscreen())

    act(() => {
      document.fullscreenElement = document.documentElement
      document.dispatchEvent(new Event('fullscreenchange'))
    })

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.cursorHidden).toBe(true)

    act(() => {
      document.dispatchEvent(new Event('mousemove'))
    })
    expect(result.current.cursorHidden).toBe(false)
  })

  it('does not hide cursor when not in fullscreen', () => {
    const { result } = renderHook(() => useFullscreen())

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.cursorHidden).toBe(false)
  })

  it('does not toggle fullscreen when modifier keys are held', () => {
    renderHook(() => useFullscreen())
    const keyHandler = addSpy.mock.calls.find(([e]) => e === 'keydown')?.[1]

    act(() => {
      keyHandler(new KeyboardEvent('keydown', { key: 'f', ctrlKey: true }))
    })
    expect(document.documentElement.requestFullscreen).not.toHaveBeenCalled()

    act(() => {
      keyHandler(new KeyboardEvent('keydown', { key: 'f', metaKey: true }))
    })
    expect(document.documentElement.requestFullscreen).not.toHaveBeenCalled()

    act(() => {
      keyHandler(new KeyboardEvent('keydown', { key: 'f', altKey: true }))
    })
    expect(document.documentElement.requestFullscreen).not.toHaveBeenCalled()
  })

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useFullscreen())
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
  })
})

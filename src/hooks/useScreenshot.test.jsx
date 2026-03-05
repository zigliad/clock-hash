import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScreenshot } from './useScreenshot'

const originalCreateElement = Document.prototype.createElement

describe('useScreenshot', () => {
  let mockContext
  let mockCanvas
  let mockLink
  let mockAppendChild
  let mockRemoveChild

  beforeEach(() => {
    mockContext = {
      fillRect: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 100 })),
      textAlign: '',
      textBaseline: '',
      font: '',
      fillStyle: '',
    }
    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      toDataURL: vi.fn(() => 'data:image/png;base64,fake'),
      width: 0,
      height: 0,
    }
    mockAppendChild = vi.fn()
    mockRemoveChild = vi.fn()
    const origAppend = document.body.appendChild.bind(document.body)
    const origRemove = document.body.removeChild.bind(document.body)
    document.body.appendChild = function (node) {
      if (node === mockLink) { mockAppendChild(node); return node }
      return origAppend(node)
    }
    document.body.removeChild = function (node) {
      if (node === mockLink) { mockRemoveChild(node); return node }
      return origRemove(node)
    }
    Document.prototype.createElement = function (tag) {
      if (tag === 'canvas') return mockCanvas
      if (tag === 'a') {
        mockLink = { href: '', download: '', click: vi.fn() }
        return mockLink
      }
      return originalCreateElement.call(this, tag)
    }
  })

  afterEach(() => {
    Document.prototype.createElement = originalCreateElement
  })

  it('returns a takeScreenshot function', () => {
    const { result } = renderHook(() => useScreenshot())
    expect(typeof result.current.takeScreenshot).toBe('function')
  })

  it('creates a canvas and draws background color', () => {
    const { result } = renderHook(() => useScreenshot())
    act(() => {
      result.current.takeScreenshot({
        time: '14:30:22',
        hex: '#143022',
        textColor: '#ffffff',
      })
    })
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')
    expect(mockContext.fillStyle).not.toBe('')
    expect(mockContext.fillRect).toHaveBeenCalled()
  })

  it('draws time text centered on canvas', () => {
    const { result } = renderHook(() => useScreenshot())
    act(() => {
      result.current.takeScreenshot({
        time: '14:30:22',
        hex: '#143022',
        textColor: '#ffffff',
      })
    })
    const fillTextCalls = mockContext.fillText.mock.calls
    const timeCall = fillTextCalls.find((c) => c[0] === '14:30:22')
    expect(timeCall).toBeDefined()
  })

  it('draws hex label on canvas', () => {
    const { result } = renderHook(() => useScreenshot())
    act(() => {
      result.current.takeScreenshot({
        time: '14:30:22',
        hex: '#143022',
        textColor: '#ffffff',
      })
    })
    const fillTextCalls = mockContext.fillText.mock.calls
    const hexCall = fillTextCalls.find((c) => c[0] === '#143022')
    expect(hexCall).toBeDefined()
  })

  it('triggers download with correct filename', () => {
    const { result } = renderHook(() => useScreenshot())
    act(() => {
      result.current.takeScreenshot({
        time: '14:30:22',
        hex: '#143022',
        textColor: '#ffffff',
      })
    })
    expect(mockLink.download).toBe('clock-hash-143022-#143022.png')
    expect(mockLink.href).toBe('data:image/png;base64,fake')
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('uses text color for time and hex text', () => {
    const { result } = renderHook(() => useScreenshot())
    act(() => {
      result.current.takeScreenshot({
        time: '09:15:45',
        hex: '#091545',
        textColor: '#000000',
      })
    })
    const fillTextCalls = mockContext.fillText.mock.calls
    expect(fillTextCalls.length).toBeGreaterThanOrEqual(2)
  })

  it('does nothing when time is missing', () => {
    const { result } = renderHook(() => useScreenshot())
    act(() => {
      result.current.takeScreenshot({ time: '', hex: '#143022', textColor: '#fff' })
    })
    expect(mockCanvas.getContext).not.toHaveBeenCalled()
  })

  it('does nothing when getContext returns null', () => {
    mockCanvas.getContext = vi.fn(() => null)
    const { result } = renderHook(() => useScreenshot())
    act(() => {
      result.current.takeScreenshot({ time: '14:30:22', hex: '#143022', textColor: '#fff' })
    })
    expect(mockCanvas.toDataURL).not.toHaveBeenCalled()
  })

  it('appends and removes link from document body', () => {
    const { result } = renderHook(() => useScreenshot())
    act(() => {
      result.current.takeScreenshot({ time: '14:30:22', hex: '#143022', textColor: '#fff' })
    })
    expect(mockAppendChild).toHaveBeenCalled()
    expect(mockRemoveChild).toHaveBeenCalled()
  })
})

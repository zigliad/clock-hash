import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'

const STORAGE_KEY = 'clock-hash-favorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('returns empty favorites initially', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('adds a favorite with time, hex, and timezone', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite({ time: '14:30:22', hex: '#143022', timezone: 'local' })
    })
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0]).toMatchObject({
      time: '14:30:22',
      hex: '#143022',
      timezone: 'local',
    })
    expect(result.current.favorites[0].id).toBeDefined()
  })

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite({ time: '14:30:22', hex: '#143022', timezone: 'local' })
    })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].hex).toBe('#143022')
  })

  it('loads persisted favorites from localStorage', () => {
    const saved = [{ id: 'abc', time: '10:00:00', hex: '#100000', timezone: 'UTC' }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].hex).toBe('#100000')
  })

  it('removes a favorite by id', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite({ time: '14:30:22', hex: '#143022', timezone: 'local' })
    })
    const id = result.current.favorites[0].id
    act(() => {
      result.current.removeFavorite(id)
    })
    expect(result.current.favorites).toHaveLength(0)
  })

  it('enforces max 20 favorites', () => {
    const { result } = renderHook(() => useFavorites())
    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.addFavorite({ time: `10:00:${String(i).padStart(2, '0')}`, hex: `#10000${String(i).padStart(2, '0')}`, timezone: 'local' })
      })
    }
    expect(result.current.favorites).toHaveLength(20)
    expect(result.current.isFull).toBe(true)
  })

  it('does not add beyond 20 favorites', () => {
    const saved = Array.from({ length: 20 }, (_, i) => ({
      id: String(i),
      time: `10:00:${String(i).padStart(2, '0')}`,
      hex: `#10000${String(i).padStart(2, '0')}`,
      timezone: 'local',
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite({ time: '20:00:00', hex: '#200000', timezone: 'local' })
    })
    expect(result.current.favorites).toHaveLength(20)
  })

  it('handles invalid localStorage data gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('removes from localStorage when favorite is deleted', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite({ time: '14:30:22', hex: '#143022', timezone: 'local' })
    })
    const id = result.current.favorites[0].id
    act(() => {
      result.current.removeFavorite(id)
    })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(0)
  })

  it('does not add duplicate hex+time combinations', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite({ time: '14:30:22', hex: '#143022', timezone: 'local' })
    })
    act(() => {
      result.current.addFavorite({ time: '14:30:22', hex: '#143022', timezone: 'local' })
    })
    expect(result.current.favorites).toHaveLength(1)
  })
})

import { useState, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'clock-hash-favorites'
const MAX_FAVORITES = 20

interface Favorite {
  id: string
  time: string
  hex: string
  timezone: string
}

function isValidFavorite(entry: unknown): entry is Favorite {
  return (
    !!entry &&
    typeof (entry as Favorite).id === 'string' &&
    typeof (entry as Favorite).time === 'string' &&
    typeof (entry as Favorite).hex === 'string' &&
    typeof (entry as Favorite).timezone === 'string'
  )
}

function loadFavorites(): Favorite[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    if (!parsed.every(isValidFavorite)) return []
    return parsed.slice(0, MAX_FAVORITES)
  } catch {
    return []
  }
}

function persist(favorites: Favorite[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // localStorage unavailable
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(loadFavorites)

  const isFull = useMemo(() => favorites.length >= MAX_FAVORITES, [favorites])

  const addFavorite = useCallback(({ time, hex, timezone }: Omit<Favorite, 'id'>) => {
    setFavorites((prev) => {
      if (prev.length >= MAX_FAVORITES) return prev
      const isDuplicate = prev.some((f) => f.time === time && f.hex === hex)
      if (isDuplicate) return prev
      const next = [...prev, { id: crypto.randomUUID(), time, hex, timezone }]
      persist(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id)
      persist(next)
      return next
    })
  }, [])

  return { favorites, isFull, addFavorite, removeFavorite }
}

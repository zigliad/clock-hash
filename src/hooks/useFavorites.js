import { useState, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'clock-hash-favorites'
const MAX_FAVORITES = 20

function isValidFavorite(entry) {
  return (
    entry &&
    typeof entry.id === 'string' &&
    typeof entry.time === 'string' &&
    typeof entry.hex === 'string' &&
    typeof entry.timezone === 'string'
  )
}

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    if (!parsed.every(isValidFavorite)) return []
    return parsed.slice(0, MAX_FAVORITES)
  } catch {
    return []
  }
}

function persist(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // localStorage unavailable
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites)

  const isFull = useMemo(() => favorites.length >= MAX_FAVORITES, [favorites])

  const addFavorite = useCallback(({ time, hex, timezone }) => {
    setFavorites((prev) => {
      if (prev.length >= MAX_FAVORITES) return prev
      const isDuplicate = prev.some((f) => f.time === time && f.hex === hex)
      if (isDuplicate) return prev
      const next = [...prev, { id: crypto.randomUUID(), time, hex, timezone }]
      persist(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id)
      persist(next)
      return next
    })
  }, [])

  return { favorites, isFull, addFavorite, removeFavorite }
}

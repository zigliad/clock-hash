import { useState, useEffect, useRef } from 'react'

const BUFFER_SIZE = 60

export function useColorHistory(currentHex) {
  const [history, setHistory] = useState([])
  const hexRef = useRef(currentHex)
  const idRef = useRef(0)

  useEffect(() => {
    hexRef.current = currentHex
  }, [currentHex])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      const time = `${h}:${m}:${s}`
      const id = idRef.current++

      setHistory((prev) => {
        const entry = { id, time, hex: hexRef.current }
        if (prev.length >= BUFFER_SIZE) {
          return [...prev.slice(1), entry]
        }
        return [...prev, entry]
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return history
}

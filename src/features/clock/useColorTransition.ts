import { useState, useEffect } from 'react'
import { lerpColor } from '../../utils/colorTransition'

export function useColorTransition(currentColor: string, nextColor: string): string {
  const [displayColor, setDisplayColor] = useState<string>(currentColor)
  const [prevColor, setPrevColor] = useState<string>(currentColor)

  if (prevColor !== currentColor) {
    setPrevColor(currentColor)
    setDisplayColor(currentColor)
  }

  useEffect(() => {
    let rafId: number
    let lastComputed = currentColor

    function tick() {
      const progress = (Date.now() % 1000) / 1000
      const next = lerpColor(currentColor, nextColor, progress)
      if (next !== lastComputed) {
        lastComputed = next
        setDisplayColor(next)
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [currentColor, nextColor])

  return displayColor
}

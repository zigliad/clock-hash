import { useState, useCallback } from 'react'
import {
  loadTimeFormat,
  saveTimeFormat,
  FORMAT_24H,
  FORMAT_12H,
} from '../../utils/timeFormat'

export function useTimeFormat() {
  const [format, setFormat] = useState(loadTimeFormat)

  const toggle = useCallback(() => {
    setFormat((prev) => {
      const next = prev === FORMAT_24H ? FORMAT_12H : FORMAT_24H
      saveTimeFormat(next)
      return next
    })
  }, [])

  return { is24h: format === FORMAT_24H, toggle }
}

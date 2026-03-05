import { useCallback } from 'react'

const CANVAS_WIDTH = 1920
const CANVAS_HEIGHT = 1080
const TIME_FONT_SIZE = 120
const HEX_FONT_SIZE = 32
const FONT_FAMILY = 'monospace'
const HEX_PADDING_RIGHT = 40
const HEX_PADDING_BOTTOM = 30
const FILENAME_PREFIX = 'clock-hash'

export function useScreenshot() {
  const takeScreenshot = useCallback(({ time, hex, textColor }: { time: string; hex: string; textColor: string }) => {
    if (!time || !hex || !textColor) return

    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = hex
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${TIME_FONT_SIZE}px ${FONT_FAMILY}`
    ctx.fillText(time, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)

    ctx.font = `${HEX_FONT_SIZE}px ${FONT_FAMILY}`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText(hex, CANVAS_WIDTH - HEX_PADDING_RIGHT, CANVAS_HEIGHT - HEX_PADDING_BOTTOM)

    const timeStripped = time.replace(/:/g, '')
    const filename = `${FILENAME_PREFIX}-${timeStripped}-${hex}.png`

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  return { takeScreenshot }
}

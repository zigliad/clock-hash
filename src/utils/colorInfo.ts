import { findNearestCssColor } from './cssColors'

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export function formatRgb({ r, g, b }: { r: number; g: number; b: number }): string {
  return `rgb(${r}, ${g}, ${b})`
}

export function formatColorInfo(hex: string): { hex: string; rgb: string; cssName: string } {
  const { r, g, b } = hexToRgb(hex)
  return {
    hex,
    rgb: formatRgb({ r, g, b }),
    cssName: findNearestCssColor(r, g, b),
  }
}

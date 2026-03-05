import { COLOR_NAMES } from './colorNames'

export const CSS_COLORS = COLOR_NAMES

export function findNearestCssColor(r: number, g: number, b: number): string {
  let nearest = CSS_COLORS[0].name
  let minDist = Infinity

  for (const color of CSS_COLORS) {
    const dr = r - color.r
    const dg = g - color.g
    const db = b - color.b
    const dist = dr * dr + dg * dg + db * db
    if (dist === 0) return color.name
    if (dist < minDist) {
      minDist = dist
      nearest = color.name
    }
  }

  return nearest
}

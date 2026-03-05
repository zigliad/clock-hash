import { describe, it, expect } from 'vitest'
import { hexToRgb, formatRgb, formatColorInfo } from './colorInfo'

describe('hexToRgb', () => {
  it('parses a valid hex color', () => {
    expect(hexToRgb('#143a52')).toEqual({ r: 20, g: 58, b: 82 })
  })

  it('parses black', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('parses white', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('handles uppercase hex', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('formatRgb', () => {
  it('formats RGB values as a string', () => {
    expect(formatRgb({ r: 20, g: 58, b: 82 })).toBe('rgb(20, 58, 82)')
  })

  it('formats black', () => {
    expect(formatRgb({ r: 0, g: 0, b: 0 })).toBe('rgb(0, 0, 0)')
  })
})

describe('formatColorInfo', () => {
  it('returns hex, rgb, and nearest CSS color name', () => {
    const result = formatColorInfo('#143a52')
    expect(result.hex).toBe('#143a52')
    expect(result.rgb).toBe('rgb(20, 58, 82)')
    expect(result.cssName).toBe('darkslategray')
  })

  it('identifies exact CSS color matches', () => {
    const result = formatColorInfo('#ff0000')
    expect(result.cssName).toBe('red')
  })

  it('identifies black', () => {
    const result = formatColorInfo('#000000')
    expect(result.cssName).toBe('black')
  })

  it('identifies white', () => {
    const result = formatColorInfo('#ffffff')
    expect(result.cssName).toBe('white')
  })
})

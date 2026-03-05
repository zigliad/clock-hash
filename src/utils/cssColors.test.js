import { describe, it, expect } from 'vitest'
import { findNearestCssColor, CSS_COLORS } from './cssColors'

describe('CSS_COLORS', () => {
  it('contains exactly 140 named colors', () => {
    expect(CSS_COLORS).toHaveLength(140)
  })

  it('each entry has name, r, g, b properties', () => {
    for (const color of CSS_COLORS) {
      expect(color).toHaveProperty('name')
      expect(color).toHaveProperty('r')
      expect(color).toHaveProperty('g')
      expect(color).toHaveProperty('b')
    }
  })
})

describe('findNearestCssColor', () => {
  it('returns exact match for red', () => {
    expect(findNearestCssColor(255, 0, 0)).toBe('red')
  })

  it('returns exact match for black', () => {
    expect(findNearestCssColor(0, 0, 0)).toBe('black')
  })

  it('returns exact match for white', () => {
    expect(findNearestCssColor(255, 255, 255)).toBe('white')
  })

  it('returns nearest color for arbitrary RGB', () => {
    expect(findNearestCssColor(20, 58, 82)).toBe('darkslategray')
  })

  it('returns exact match for cornflowerblue', () => {
    expect(findNearestCssColor(100, 149, 237)).toBe('cornflowerblue')
  })
})

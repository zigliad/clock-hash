import { describe, it, expect } from 'vitest'
import { lerpColor } from './colorTransition'

describe('lerpColor', () => {
  it('returns the start color at t=0', () => {
    expect(lerpColor('#000000', '#ffffff', 0)).toBe('#000000')
  })

  it('returns the end color at t=1', () => {
    expect(lerpColor('#000000', '#ffffff', 1)).toBe('#ffffff')
  })

  it('returns midpoint at t=0.5', () => {
    expect(lerpColor('#000000', '#ffffff', 0.5)).toBe('#808080')
  })

  it('interpolates each RGB channel independently', () => {
    expect(lerpColor('#ff0000', '#00ff00', 0.5)).toBe('#808000')
  })

  it('handles same color gracefully', () => {
    expect(lerpColor('#143022', '#143022', 0.5)).toBe('#143022')
  })

  it('clamps t below 0', () => {
    expect(lerpColor('#000000', '#ffffff', -0.5)).toBe('#000000')
  })

  it('clamps t above 1', () => {
    expect(lerpColor('#000000', '#ffffff', 1.5)).toBe('#ffffff')
  })
})

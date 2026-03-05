import { describe, it, expect } from 'vitest'
import { lerpColor, incrementTime } from './colorTransition'

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

describe('incrementTime', () => {
  it('increments seconds normally', () => {
    expect(incrementTime('14:30:22')).toBe('14:30:23')
  })

  it('rolls over seconds to next minute', () => {
    expect(incrementTime('14:30:59')).toBe('14:31:00')
  })

  it('rolls over minutes to next hour', () => {
    expect(incrementTime('14:59:59')).toBe('15:00:00')
  })

  it('rolls over midnight', () => {
    expect(incrementTime('23:59:59')).toBe('00:00:00')
  })

  it('handles start of day', () => {
    expect(incrementTime('00:00:00')).toBe('00:00:01')
  })
})

import { describe, it, expect } from 'vitest'
import { Z_OVERLAY, Z_MODAL } from './zIndex'

describe('zIndex constants', () => {
  it('exports Z_OVERLAY as a positive integer', () => {
    expect(typeof Z_OVERLAY).toBe('number')
    expect(Z_OVERLAY).toBeGreaterThan(0)
    expect(Number.isInteger(Z_OVERLAY)).toBe(true)
  })

  it('exports Z_MODAL as a positive integer', () => {
    expect(typeof Z_MODAL).toBe('number')
    expect(Z_MODAL).toBeGreaterThan(0)
    expect(Number.isInteger(Z_MODAL)).toBe(true)
  })

  it('Z_MODAL is greater than Z_OVERLAY', () => {
    expect(Z_MODAL).toBeGreaterThan(Z_OVERLAY)
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ColorInfoOverlay } from './ColorInfoOverlay'

describe('ColorInfoOverlay', () => {
  it('renders hex code', () => {
    render(<ColorInfoOverlay hex="#143a52" textColor="#fff" />)
    expect(screen.getByText(/#143a52/)).toBeInTheDocument()
  })

  it('renders RGB values', () => {
    render(<ColorInfoOverlay hex="#143a52" textColor="#fff" />)
    expect(screen.getByText(/rgb\(20, 58, 82\)/)).toBeInTheDocument()
  })

  it('renders nearest CSS color name', () => {
    render(<ColorInfoOverlay hex="#143a52" textColor="#fff" />)
    expect(screen.getByText(/port blue/)).toBeInTheDocument()
  })

  it('adapts text color based on textColor prop', () => {
    const { container } = render(<ColorInfoOverlay hex="#ffffff" textColor="#000" />)
    const overlay = container.firstChild
    expect(overlay.style.color).toBe('rgb(0, 0, 0)')
  })

  it('updates when hex changes', () => {
    const { rerender } = render(<ColorInfoOverlay hex="#ff0000" textColor="#fff" />)
    expect(screen.getByText(/red/)).toBeInTheDocument()

    rerender(<ColorInfoOverlay hex="#0000ff" textColor="#fff" />)
    expect(screen.getByText(/blue/)).toBeInTheDocument()
  })

  it('has data-testid for querying', () => {
    render(<ColorInfoOverlay hex="#143a52" textColor="#fff" />)
    expect(screen.getByTestId('color-info-overlay')).toBeInTheDocument()
  })
})

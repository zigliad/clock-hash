import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ColorHistoryStrip from './ColorHistoryStrip'

const makeHistory = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    time: `12:00:${String(i).padStart(2, '0')}`,
    hex: `#${String(i).padStart(6, '0')}`,
  }))

describe('ColorHistoryStrip', () => {
  it('renders a strip container', () => {
    render(<ColorHistoryStrip history={[]} />)
    const strip = screen.getByTestId('color-history-strip')
    expect(strip).toBeInTheDocument()
  })

  it('is fixed at the bottom of the screen', () => {
    render(<ColorHistoryStrip history={[]} />)
    const strip = screen.getByTestId('color-history-strip')
    expect(strip.style.position).toBe('fixed')
    expect(strip.style.bottom).toBe('0px')
  })

  it('has height of 20px (within 24px limit)', () => {
    render(<ColorHistoryStrip history={[]} />)
    const strip = screen.getByTestId('color-history-strip')
    expect(strip.style.height).toBe('20px')
  })

  it('renders correct number of slices', () => {
    const history = makeHistory(10)
    render(<ColorHistoryStrip history={history} />)
    const slices = screen.getAllByTestId('color-slice')
    expect(slices).toHaveLength(10)
  })

  it('renders empty when history is empty', () => {
    render(<ColorHistoryStrip history={[]} />)
    const slices = screen.queryAllByTestId('color-slice')
    expect(slices).toHaveLength(0)
  })

  it('applies the correct background color to each slice', () => {
    const history = [
      { id: 1, time: '12:00:01', hex: '#ff0000' },
      { id: 2, time: '12:00:02', hex: '#00ff00' },
    ]
    render(<ColorHistoryStrip history={history} />)
    const slices = screen.getAllByTestId('color-slice')
    expect(slices[0].style.backgroundColor).toBe('rgb(255, 0, 0)')
    expect(slices[1].style.backgroundColor).toBe('rgb(0, 255, 0)')
  })

  it('shows tooltip with time and hex on hover', () => {
    const history = [{ id: 0, time: '12:00:05', hex: '#abcdef' }]
    render(<ColorHistoryStrip history={history} />)
    const slice = screen.getByTestId('color-slice')
    expect(slice.getAttribute('title')).toBe('12:00:05 — #abcdef')
  })

  it('does not interfere with main layout (full width, no extra height)', () => {
    render(<ColorHistoryStrip history={[]} />)
    const strip = screen.getByTestId('color-history-strip')
    expect(strip.style.width).toBe('100%')
    expect(strip.style.left).toBe('0px')
  })
})

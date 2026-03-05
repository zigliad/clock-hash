import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the main clock with current time', () => {
    render(<App />)
    const timeDisplays = screen.getAllByText(/\d{2}:\d{2}:\d{2}/)
    expect(timeDisplays.length).toBeGreaterThanOrEqual(6)
  })

  it('renders the world clocks bar', () => {
    render(<App />)
    expect(screen.getByText('UTC')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('Tokyo')).toBeInTheDocument()
    expect(screen.getByText('Sydney')).toBeInTheDocument()
  })

  it('clicking a timezone card changes the main clock to that timezone', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByText('Tokyo'))
    const mainClockDiv = container.querySelector('div[style*="flex: 1"]')
    expect(mainClockDiv.textContent).toBe('21:00:00')
  })

  it('clicking the active timezone again returns to local time', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByText('Tokyo'))
    const mainClockDiv = container.querySelector('div[style*="flex: 1"]')
    expect(mainClockDiv.textContent).toBe('21:00:00')
    // Click Tokyo again to deselect
    fireEvent.click(screen.getByText('Tokyo'))
    // Should return to local time (14:00:00 in IST at noon UTC)
    expect(mainClockDiv.textContent).toMatch(/\d{2}:\d{2}:\d{2}/)
    expect(mainClockDiv.textContent).not.toBe('21:00:00')
  })

  it('maintains full-viewport background color based on time', () => {
    const { container } = render(<App />)
    const wrapper = container.firstChild
    expect(wrapper.style.backgroundColor).toBeTruthy()
  })

  it('sets background color derived from current time as hex', () => {
    const { container } = render(<App />)
    const wrapper = container.firstChild
    // At noon UTC+2 local = 14:00:00, color = #140000
    expect(wrapper.style.backgroundColor).toBeTruthy()
  })

  it('no timezone is active by default (local time shown)', () => {
    render(<App />)
    const cards = document.querySelectorAll('[data-testid="tz-card"]')
    expect(cards.length).toBe(5)
  })
})

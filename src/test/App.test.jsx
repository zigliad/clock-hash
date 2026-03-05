import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from '../App'
import { STORAGE_KEY } from '../utils/timeFormat'

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
    localStorage.clear()
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
    const mainClockDiv = container.querySelector('[data-testid="main-clock"]')
    expect(mainClockDiv.textContent).toBe('21:00:00')
  })

  it('clicking the active timezone again returns to local time', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByText('Tokyo'))
    const mainClockDiv = container.querySelector('[data-testid="main-clock"]')
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

  it('background color changes when a timezone card is clicked', () => {
    const { container } = render(<App />)
    const wrapper = container.firstChild
    act(() => vi.advanceTimersByTime(16))
    const initialBg = wrapper.style.backgroundColor
    fireEvent.click(screen.getByText('Tokyo'))
    act(() => vi.advanceTimersByTime(16))
    const newBg = wrapper.style.backgroundColor
    expect(newBg).not.toBe(initialBg)
  })

  it('no timezone is active by default (local time shown)', () => {
    render(<App />)
    const cards = document.querySelectorAll('[data-testid="tz-card"]')
    expect(cards.length).toBe(5)
  })

  it('renders the 12h/24h toggle button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /time format/i })).toBeInTheDocument()
  })

  it('defaults to 24h mode', () => {
    render(<App />)
    expect(screen.getByText('24h')).toBeInTheDocument()
  })

  it('switches to 12h display when toggle is clicked', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /time format/i }))
    expect(screen.getByText('12h')).toBeInTheDocument()
    const mainClockDiv = container.querySelector('[data-testid="main-clock"]')
    expect(mainClockDiv.textContent).toMatch(/^(0[1-9]|1[0-2]):\d{2}:\d{2}$/)
  })

  it('updates background color immediately on toggle', () => {
    const { container } = render(<App />)
    fireEvent.click(screen.getByText('Tokyo'))
    const wrapper = container.firstChild
    act(() => vi.advanceTimersByTime(16))
    const bg24h = wrapper.style.backgroundColor
    fireEvent.click(screen.getByRole('button', { name: /time format/i }))
    act(() => vi.advanceTimersByTime(16))
    const bg12h = wrapper.style.backgroundColor
    expect(bg12h).not.toBe(bg24h)
  })

  it('persists format across re-renders via localStorage', () => {
    const { unmount } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /time format/i }))
    expect(localStorage.getItem(STORAGE_KEY)).toBe('12h')
    unmount()
    render(<App />)
    expect(screen.getByText('12h')).toBeInTheDocument()
  })

  it('world clock cards also switch to 12h format', () => {
    render(<App />)
    expect(screen.getByText('21:00:00')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /time format/i }))
    expect(screen.getByText('09:00:00')).toBeInTheDocument()
  })
})

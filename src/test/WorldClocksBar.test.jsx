import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WorldClocksBar from '../WorldClocksBar'
import { TIMEZONES } from '../timezones'

describe('WorldClocksBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a card for each default timezone', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    TIMEZONES.forEach((tz) => {
      expect(screen.getByText(tz.label)).toBeInTheDocument()
    })
  })

  it('displays the current time for each timezone', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    // UTC and London both show 12:00:00 at noon UTC in March
    const twelves = screen.getAllByText('12:00:00')
    expect(twelves.length).toBeGreaterThanOrEqual(1)
    // Tokyo should show 21:00:00
    expect(screen.getByText('21:00:00')).toBeInTheDocument()
  })

  it('calls onSelectZone with the timezone zone when a card is clicked', () => {
    const onSelectZone = vi.fn()
    render(<WorldClocksBar activeZone={null} onSelectZone={onSelectZone} />)
    fireEvent.click(screen.getByText('Tokyo'))
    expect(onSelectZone).toHaveBeenCalledWith('Asia/Tokyo')
  })

  it('highlights the active card differently from inactive cards', () => {
    const { container } = render(
      <WorldClocksBar activeZone="Asia/Tokyo" onSelectZone={() => {}} />
    )
    const cards = container.querySelectorAll('[data-testid="tz-card"]')
    const tokyoCard = Array.from(cards).find((card) =>
      card.textContent.includes('Tokyo')
    )
    const utcCard = Array.from(cards).find((card) =>
      card.textContent.includes('UTC')
    )
    expect(tokyoCard.style.backgroundColor).not.toBe(utcCard.style.backgroundColor)
  })

  it('renders cards container with CSS module class', () => {
    const { container } = render(
      <WorldClocksBar activeZone={null} onSelectZone={() => {}} />
    )
    const bar = container.firstChild
    expect(bar.className).toBeTruthy()
  })

  it('each card has CSS module class applied', () => {
    const { container } = render(
      <WorldClocksBar activeZone={null} onSelectZone={() => {}} />
    )
    const cards = container.querySelectorAll('[data-testid="tz-card"]')
    cards.forEach((card) => {
      expect(card.className).toBeTruthy()
    })
  })

  it('cards have keyboard accessibility (role button, tabIndex)', () => {
    const { container } = render(
      <WorldClocksBar activeZone={null} onSelectZone={() => {}} />
    )
    const cards = container.querySelectorAll('[data-testid="tz-card"]')
    cards.forEach((card) => {
      expect(card.getAttribute('role')).toBe('button')
      expect(card.getAttribute('tabindex')).toBe('0')
    })
  })

  it('cards are activatable via Enter key', () => {
    const onSelectZone = vi.fn()
    render(<WorldClocksBar activeZone={null} onSelectZone={onSelectZone} />)
    const tokyoCard = screen.getByText('Tokyo').closest('[data-testid="tz-card"]')
    fireEvent.keyDown(tokyoCard, { key: 'Enter' })
    expect(onSelectZone).toHaveBeenCalledWith('Asia/Tokyo')
  })

  it('does not crash when onSelectZone is not provided', () => {
    expect(() => {
      render(<WorldClocksBar activeZone={null} />)
      fireEvent.click(screen.getByText('UTC'))
    }).not.toThrow()
  })

  it('sets aria-pressed on active card', () => {
    render(
      <WorldClocksBar activeZone="Asia/Tokyo" onSelectZone={() => {}} />
    )
    const tokyoCard = screen.getByText('Tokyo').closest('[data-testid="tz-card"]')
    const utcCard = screen.getByText('UTC').closest('[data-testid="tz-card"]')
    expect(tokyoCard.getAttribute('aria-pressed')).toBe('true')
    expect(utcCard.getAttribute('aria-pressed')).toBe('false')
  })
})

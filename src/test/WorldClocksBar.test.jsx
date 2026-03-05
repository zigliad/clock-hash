import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WorldClocksBar from '../WorldClocksBar'
import { DEFAULT_TIMEZONES, getTimeForTimezone } from '../timezones'
import { timeToColor } from '../utils/clock'

describe('WorldClocksBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'))
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it('renders a card for each default timezone', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    DEFAULT_TIMEZONES.forEach((tz) => {
      expect(screen.getByText(tz.label)).toBeInTheDocument()
    })
  })

  it('displays the current time for each timezone', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    const twelves = screen.getAllByText('12:00:00')
    expect(twelves.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('21:00:00')).toBeInTheDocument()
  })

  it('calls onSelectZone with the timezone zone when a card is clicked', () => {
    const onSelectZone = vi.fn()
    render(<WorldClocksBar activeZone={null} onSelectZone={onSelectZone} />)
    fireEvent.click(screen.getByText('Tokyo'))
    expect(onSelectZone).toHaveBeenCalledWith('Asia/Tokyo')
  })

  it('highlights the active card differently from inactive cards', () => {
    render(
      <WorldClocksBar activeZone="Asia/Tokyo" onSelectZone={() => {}} />
    )
    const tokyoCard = screen.getByText('Tokyo').closest('[role="button"]')
    const utcCard = screen.getByText('UTC').closest('[role="button"]')
    expect(tokyoCard.className).not.toBe(utcCard.className)
  })

  it('renders cards container with Tailwind classes', () => {
    const { container } = render(
      <WorldClocksBar activeZone={null} onSelectZone={() => {}} />
    )
    const bar = container.firstChild
    expect(bar.className).toBeTruthy()
  })

  it('each card has Tailwind classes applied', () => {
    render(
      <WorldClocksBar activeZone={null} onSelectZone={() => {}} />
    )
    const cards = screen.getAllByRole('button', { name: /timezone/i })
    cards.forEach((card) => {
      expect(card.className).toBeTruthy()
    })
  })

  it('cards have keyboard accessibility (role button, tabIndex)', () => {
    render(
      <WorldClocksBar activeZone={null} onSelectZone={() => {}} />
    )
    DEFAULT_TIMEZONES.forEach((tz) => {
      const card = screen.getByLabelText(`${tz.label} timezone`)
      expect(card.getAttribute('role')).toBe('button')
      expect(card.getAttribute('tabindex')).toBe('0')
    })
  })

  it('cards are activatable via Enter key', () => {
    const onSelectZone = vi.fn()
    render(<WorldClocksBar activeZone={null} onSelectZone={onSelectZone} />)
    const tokyoCard = screen.getByLabelText('Tokyo timezone')
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
    const tokyoCard = screen.getByLabelText('Tokyo timezone')
    const utcCard = screen.getByLabelText('UTC timezone')
    expect(tokyoCard.getAttribute('aria-pressed')).toBe('true')
    expect(utcCard.getAttribute('aria-pressed')).toBe('false')
  })

  it('shows edit button on each card', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    const editBtns = screen.getAllByLabelText(/edit .+ timezone/i)
    expect(editBtns).toHaveLength(DEFAULT_TIMEZONES.length)
  })

  it('opens timezone picker when edit button is clicked', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    const editBtn = screen.getByLabelText('Edit UTC timezone')
    fireEvent.click(editBtn)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('closes picker when close is clicked', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    fireEvent.click(screen.getByLabelText('Edit UTC timezone'))
    fireEvent.click(screen.getByLabelText(/close/i))
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument()
  })

  it('updates card timezone when a timezone is selected from picker', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    fireEvent.click(screen.getByLabelText('Edit UTC timezone'))
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'dubai' },
    })
    fireEvent.click(screen.getByText('Dubai'))
    expect(screen.getByText('Dubai')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument()
  })

  it('shows reset button when timezones are customized', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    expect(screen.queryByLabelText(/reset/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Edit UTC timezone'))
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'dubai' },
    })
    fireEvent.click(screen.getByText('Dubai'))
    expect(screen.getByLabelText(/reset/i)).toBeInTheDocument()
  })

  it('resets timezones to defaults when reset is clicked', () => {
    render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
    fireEvent.click(screen.getByLabelText('Edit UTC timezone'))
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'dubai' },
    })
    fireEvent.click(screen.getByText('Dubai'))
    fireEvent.click(screen.getByLabelText(/reset/i))
    expect(screen.getByText('UTC')).toBeInTheDocument()
  })

  it('edit button click does not trigger card selection', () => {
    const onSelectZone = vi.fn()
    render(<WorldClocksBar activeZone={null} onSelectZone={onSelectZone} />)
    fireEvent.click(screen.getByLabelText('Edit UTC timezone'))
    expect(onSelectZone).not.toHaveBeenCalled()
  })

  describe('color swatch', () => {
    it('renders a color swatch for each timezone card with correct color and tooltip', () => {
      render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
      const swatches = screen.getAllByTestId('tz-swatch')
      expect(swatches).toHaveLength(DEFAULT_TIMEZONES.length)
      DEFAULT_TIMEZONES.forEach((tz, i) => {
        const tzTime = getTimeForTimezone(tz.zone)
        const tzColor = timeToColor(tzTime)
        expect(swatches[i].title).toBe(tzColor)
        expect(swatches[i].style.backgroundColor).toBeTruthy()
      })
    })

    it('swatch is decorative (aria-hidden) since parent button provides context', () => {
      render(<WorldClocksBar activeZone={null} onSelectZone={() => {}} />)
      const swatches = screen.getAllByTestId('tz-swatch')
      swatches.forEach((swatch) => {
        expect(swatch.getAttribute('aria-hidden')).toBe('true')
      })
    })
  })
})

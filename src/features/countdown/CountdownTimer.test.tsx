import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CountdownTimer } from './CountdownTimer'

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-05T14:30:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a "Set target" button when no target is set', () => {
    render(<CountdownTimer />)
    expect(screen.getByRole('button', { name: /set target/i })).toBeInTheDocument()
  })

  it('shows time input when "Set target" is clicked', () => {
    render(<CountdownTimer />)
    fireEvent.click(screen.getByRole('button', { name: /set target/i }))
    expect(screen.getByLabelText(/target time/i)).toBeInTheDocument()
  })

  it('sets the target and shows countdown display', () => {
    render(<CountdownTimer />)
    fireEvent.click(screen.getByRole('button', { name: /set target/i }))
    const input = screen.getByLabelText(/target time/i)
    fireEvent.change(input, { target: { value: '17:00' } })
    fireEvent.submit(input.closest('form')!)

    expect(screen.getByText(/in 2h 30m 00s/)).toBeInTheDocument()
  })

  it('shows clear button when target is active', () => {
    render(<CountdownTimer />)
    fireEvent.click(screen.getByRole('button', { name: /set target/i }))
    const input = screen.getByLabelText(/target time/i)
    fireEvent.change(input, { target: { value: '17:00' } })
    fireEvent.submit(input.closest('form')!)

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('clears the target when clear button is clicked', () => {
    render(<CountdownTimer />)
    fireEvent.click(screen.getByRole('button', { name: /set target/i }))
    const input = screen.getByLabelText(/target time/i)
    fireEvent.change(input, { target: { value: '17:00' } })
    fireEvent.submit(input.closest('form')!)

    fireEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(screen.getByRole('button', { name: /set target/i })).toBeInTheDocument()
    expect(screen.queryByText(/in \d/)).not.toBeInTheDocument()
  })

  it('applies pulse class when target is reached', () => {
    const { container } = render(<CountdownTimer />)
    fireEvent.click(screen.getByRole('button', { name: /set target/i }))
    const input = screen.getByLabelText(/target time/i)
    fireEvent.change(input, { target: { value: '14:31' } })
    fireEvent.submit(input.closest('form')!)

    act(() => {
      vi.advanceTimersByTime(60 * 1000)
    })

    const wrapper = container.querySelector('[data-testid="countdown-timer"]')
    expect((wrapper as HTMLElement).className).toContain('pulse')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TimeFormatToggle from './TimeFormatToggle'

describe('TimeFormatToggle', () => {
  it('renders the toggle button', () => {
    render(<TimeFormatToggle is24h={true} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: /time format/i })).toBeInTheDocument()
  })

  it('shows "24h" label when in 24h mode', () => {
    render(<TimeFormatToggle is24h={true} onToggle={() => {}} />)
    expect(screen.getByText('24h')).toBeInTheDocument()
  })

  it('shows "12h" label when in 12h mode', () => {
    render(<TimeFormatToggle is24h={false} onToggle={() => {}} />)
    expect(screen.getByText('12h')).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<TimeFormatToggle is24h={true} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: /time format/i }))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('is keyboard accessible via native button behavior', () => {
    const onToggle = vi.fn()
    render(<TimeFormatToggle is24h={true} onToggle={onToggle} />)
    const btn = screen.getByRole('button', { name: /time format/i })
    expect(btn.tagName).toBe('BUTTON')
    expect(btn.getAttribute('type')).toBe('button')
  })
})

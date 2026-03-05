import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimezonePicker } from './TimezonePicker'

describe('TimezonePicker', () => {
  const onSelect = vi.fn()
  const onClose = vi.fn()

  beforeEach(() => {
    onSelect.mockClear()
    onClose.mockClear()
  })

  it('renders a search input', () => {
    render(<TimezonePicker onSelect={onSelect} onClose={onClose} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('displays timezone options', () => {
    const { container } = render(<TimezonePicker onSelect={onSelect} onClose={onClose} />)
    const options = container.querySelectorAll('li button')
    expect(options.length).toBeGreaterThan(0)
  })

  it('filters timezones by search query', () => {
    const { container } = render(<TimezonePicker onSelect={onSelect} onClose={onClose} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'dubai' },
    })
    const options = container.querySelectorAll('li button')
    expect(options.length).toBe(1)
    expect(options[0].textContent).toContain('Dubai')
  })

  it('calls onSelect with timezone when an option is clicked', () => {
    const { container } = render(<TimezonePicker onSelect={onSelect} onClose={onClose} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'dubai' },
    })
    const option = container.querySelector('li button')
    fireEvent.click(option)
    expect(onSelect).toHaveBeenCalledWith('Asia/Dubai')
  })

  it('calls onClose when close button is clicked', () => {
    render(<TimezonePicker onSelect={onSelect} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText(/close/i))
    expect(onClose).toHaveBeenCalled()
  })

  it('filters by region name as well', () => {
    render(<TimezonePicker onSelect={onSelect} onClose={onClose} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'america' },
    })
    expect(screen.getByText(/New York/i)).toBeInTheDocument()
  })

  it('shows no results message for unmatched search', () => {
    render(<TimezonePicker onSelect={onSelect} onClose={onClose} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'xyznonexistent' },
    })
    expect(screen.getByText(/no timezones found/i)).toBeInTheDocument()
  })

  it('displays city portion as label in the list', () => {
    render(<TimezonePicker onSelect={onSelect} onClose={onClose} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'los angeles' },
    })
    expect(screen.getByText(/Los Angeles/)).toBeInTheDocument()
  })
})

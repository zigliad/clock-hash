import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HeartButton } from './HeartButton'

describe('HeartButton', () => {
  it('renders a button with heart aria-label', () => {
    render(<HeartButton onSave={() => {}} isFull={false} />)
    expect(screen.getByLabelText('Save favorite color')).toBeDefined()
  })

  it('calls onSave when clicked', () => {
    const onSave = vi.fn()
    render(<HeartButton onSave={onSave} isFull={false} />)
    fireEvent.click(screen.getByTestId('heart-button'))
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('shows full indicator when favorites list is full', () => {
    render(<HeartButton onSave={() => {}} isFull={true} />)
    const btn = screen.getByTestId('heart-button')
    expect(btn.getAttribute('aria-label')).toBe('Favorites full')
  })

  it('is disabled when favorites list is full', () => {
    const onSave = vi.fn()
    render(<HeartButton onSave={onSave} isFull={true} />)
    fireEvent.click(screen.getByTestId('heart-button'))
    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByTestId('heart-button').disabled).toBe(true)
  })

  it('has data-testid for targeting', () => {
    render(<HeartButton onSave={() => {}} isFull={false} />)
    expect(screen.getByTestId('heart-button')).toBeDefined()
  })
})

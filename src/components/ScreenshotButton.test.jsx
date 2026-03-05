import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ScreenshotButton } from './ScreenshotButton'

describe('ScreenshotButton', () => {
  it('renders a button with camera aria-label', () => {
    render(<ScreenshotButton onCapture={() => {}} />)
    expect(screen.getByLabelText('Take screenshot')).toBeDefined()
  })

  it('calls onCapture when clicked', () => {
    const onCapture = vi.fn()
    render(<ScreenshotButton onCapture={onCapture} />)
    fireEvent.click(screen.getByTestId('screenshot-button'))
    expect(onCapture).toHaveBeenCalledTimes(1)
  })

  it('has data-testid for targeting', () => {
    render(<ScreenshotButton onCapture={() => {}} />)
    expect(screen.getByTestId('screenshot-button')).toBeDefined()
  })
})

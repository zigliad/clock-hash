import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FullscreenButton } from './FullscreenButton'

describe('FullscreenButton', () => {
  it('renders a button with fullscreen icon', () => {
    render(<FullscreenButton isFullscreen={false} onToggle={() => {}} />)
    const btn = screen.getByTestId('fullscreen-button')
    expect(btn).toBeDefined()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<FullscreenButton isFullscreen={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByTestId('fullscreen-button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('has accessible aria-label for enter fullscreen', () => {
    render(<FullscreenButton isFullscreen={false} onToggle={() => {}} />)
    expect(screen.getByLabelText('Enter fullscreen')).toBeDefined()
  })

  it('has accessible aria-label for exit fullscreen', () => {
    render(<FullscreenButton isFullscreen={true} onToggle={() => {}} />)
    expect(screen.getByLabelText('Exit fullscreen')).toBeDefined()
  })
})

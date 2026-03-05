import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FavoriteSwatch } from './FavoriteSwatch'

const mockFav = { id: '1', time: '14:30:22', hex: '#143022', timezone: 'local' }

describe('FavoriteSwatch', () => {
  it('renders the color swatch with correct background', () => {
    render(<FavoriteSwatch favorite={mockFav} isActive={false} onSelect={() => {}} onDelete={() => {}} />)
    const swatch = screen.getByTestId('swatch-1')
    expect((swatch.querySelector('[data-testid="swatch-color-1"]') as HTMLElement).style.backgroundColor).toBe('rgb(20, 48, 34)')
  })

  it('displays hex code', () => {
    render(<FavoriteSwatch favorite={mockFav} isActive={false} onSelect={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('#143022')).toBeDefined()
  })

  it('displays the saved time', () => {
    render(<FavoriteSwatch favorite={mockFav} isActive={false} onSelect={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('14:30:22')).toBeDefined()
  })

  it('calls onSelect when swatch is clicked', () => {
    const onSelect = vi.fn()
    render(<FavoriteSwatch favorite={mockFav} isActive={false} onSelect={onSelect} onDelete={() => {}} />)
    fireEvent.click(screen.getByTestId('swatch-1'))
    expect(onSelect).toHaveBeenCalledWith('1')
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<FavoriteSwatch favorite={mockFav} isActive={false} onSelect={() => {}} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('Delete favorite'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('shows active indicator when selected', () => {
    render(<FavoriteSwatch favorite={mockFav} isActive={true} onSelect={() => {}} onDelete={() => {}} />)
    const swatch = screen.getByTestId('swatch-1')
    expect(swatch.getAttribute('data-active')).toBe('true')
  })

  it('is keyboard accessible with Enter key', () => {
    const onSelect = vi.fn()
    render(<FavoriteSwatch favorite={mockFav} isActive={false} onSelect={onSelect} onDelete={() => {}} />)
    const swatch = screen.getByTestId('swatch-1')
    expect(swatch.getAttribute('role')).toBe('button')
    expect(swatch.getAttribute('tabindex')).toBe('0')
    fireEvent.keyDown(swatch, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('1')
  })
})

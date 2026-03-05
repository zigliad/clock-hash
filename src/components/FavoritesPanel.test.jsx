import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FavoritesPanel } from './FavoritesPanel'

const mockFavorites = [
  { id: '1', time: '14:30:22', hex: '#143022', timezone: 'local' },
  { id: '2', time: '08:15:44', hex: '#081544', timezone: 'UTC' },
]

describe('FavoritesPanel', () => {
  it('renders toggle button to open panel', () => {
    render(<FavoritesPanel favorites={[]} activeFavoriteId={null} onSelect={() => {}} onDelete={() => {}} />)
    expect(screen.getByTestId('favorites-toggle')).toBeDefined()
  })

  it('opens panel when toggle is clicked', () => {
    render(<FavoritesPanel favorites={mockFavorites} activeFavoriteId={null} onSelect={() => {}} onDelete={() => {}} />)
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    expect(screen.getByTestId('favorites-panel')).toBeDefined()
  })

  it('renders all favorite swatches when open', () => {
    render(<FavoritesPanel favorites={mockFavorites} activeFavoriteId={null} onSelect={() => {}} onDelete={() => {}} />)
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    expect(screen.getByTestId('swatch-1')).toBeDefined()
    expect(screen.getByTestId('swatch-2')).toBeDefined()
  })

  it('shows empty message when no favorites', () => {
    render(<FavoritesPanel favorites={[]} activeFavoriteId={null} onSelect={() => {}} onDelete={() => {}} />)
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    expect(screen.getByText('No favorites yet')).toBeDefined()
  })

  it('closes panel when toggle is clicked again', () => {
    render(<FavoritesPanel favorites={mockFavorites} activeFavoriteId={null} onSelect={() => {}} onDelete={() => {}} />)
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    expect(screen.queryByTestId('favorites-panel')).toBeNull()
  })

  it('closes panel on Escape key', () => {
    render(<FavoritesPanel favorites={mockFavorites} activeFavoriteId={null} onSelect={() => {}} onDelete={() => {}} />)
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByTestId('favorites-panel')).toBeNull()
  })

  it('passes activeFavoriteId to swatches', () => {
    render(<FavoritesPanel favorites={mockFavorites} activeFavoriteId="1" onSelect={() => {}} onDelete={() => {}} />)
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    const swatch = screen.getByTestId('swatch-1')
    expect(swatch.className).toMatch(/active/)
  })

  it('calls onSelect when a swatch is clicked', () => {
    const onSelect = vi.fn()
    render(<FavoritesPanel favorites={mockFavorites} activeFavoriteId={null} onSelect={onSelect} onDelete={() => {}} />)
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    fireEvent.click(screen.getByTestId('swatch-1'))
    expect(onSelect).toHaveBeenCalledWith('1')
  })

  it('calls onDelete when delete is clicked on a swatch', () => {
    const onDelete = vi.fn()
    render(<FavoritesPanel favorites={mockFavorites} activeFavoriteId={null} onSelect={() => {}} onDelete={onDelete} />)
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    const deleteButtons = screen.getAllByLabelText('Delete favorite')
    fireEvent.click(deleteButtons[0])
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('closes panel on click outside', () => {
    render(
      <div>
        <div data-testid="outside">outside</div>
        <FavoritesPanel favorites={mockFavorites} activeFavoriteId={null} onSelect={() => {}} onDelete={() => {}} />
      </div>
    )
    fireEvent.click(screen.getByTestId('favorites-toggle'))
    expect(screen.getByTestId('favorites-panel')).toBeDefined()
    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(screen.queryByTestId('favorites-panel')).toBeNull()
  })
})

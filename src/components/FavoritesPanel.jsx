import { useState, useEffect, useRef } from 'react'
import { FavoriteSwatch } from './FavoriteSwatch'
import { Button } from '@/components/ui/button'
import { Z_OVERLAY } from '@/utils/zIndex'

export function FavoritesPanel({ favorites, activeFavoriteId, onSelect, onDelete }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setIsOpen(false)
      }
    }
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={containerRef}>
      <Button
        data-testid="favorites-toggle"
        aria-label="Toggle favorites panel"
        variant="ghost"
        size="icon"
        className="opacity-50"
        onClick={() => setIsOpen((o) => !o)}
      >
        &#127912;
      </Button>
      {isOpen && (
        <div
          data-testid="favorites-panel"
          className="absolute top-full right-0 w-60 max-w-[calc(100vw-32px)] max-h-[min(360px,60vh)] overflow-y-auto bg-black/85 text-white rounded-lg p-2 flex flex-col gap-1"
          style={{ zIndex: Z_OVERLAY }}
        >
          <div className="text-sm font-bold px-2 py-1 opacity-70">Favorites</div>
          {favorites.length === 0 ? (
            <div className="py-4 px-2 text-center opacity-50 text-xs">No favorites yet</div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {favorites.map((fav) => (
                <FavoriteSwatch
                  key={fav.id}
                  favorite={fav}
                  isActive={fav.id === activeFavoriteId}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

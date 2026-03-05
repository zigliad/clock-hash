import { useState, useEffect, useRef } from 'react'
import { FavoriteSwatch } from './FavoriteSwatch'
import styles from './FavoritesPanel.module.css'

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
    <div className={styles.container} ref={containerRef}>
      <button
        data-testid="favorites-toggle"
        aria-label="Toggle favorites panel"
        className={styles.toggleBtn}
        onClick={() => setIsOpen((o) => !o)}
      >
        &#127912;
      </button>
      {isOpen && (
        <div data-testid="favorites-panel" className={styles.panel}>
          <div className={styles.header}>Favorites</div>
          {favorites.length === 0 ? (
            <div className={styles.empty}>No favorites yet</div>
          ) : (
            <div className={styles.list}>
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

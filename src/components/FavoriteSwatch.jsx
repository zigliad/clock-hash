import styles from './FavoriteSwatch.module.css'

export function FavoriteSwatch({ favorite, isActive, onSelect, onDelete }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(favorite.id)
    }
  }

  return (
    <div
      data-testid={`swatch-${favorite.id}`}
      className={`${styles.swatch} ${isActive ? styles.active : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(favorite.id)}
      onKeyDown={handleKeyDown}
    >
      <div
        data-testid={`swatch-color-${favorite.id}`}
        className={styles.color}
        style={{ backgroundColor: favorite.hex }}
      />
      <span className={styles.hex}>{favorite.hex}</span>
      <span className={styles.time}>{favorite.time}</span>
      <button
        aria-label="Delete favorite"
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation()
          onDelete(favorite.id)
        }}
      >
        &times;
      </button>
    </div>
  )
}

import styles from './HeartButton.module.css'

export function HeartButton({ onSave, isFull }) {
  return (
    <button
      data-testid="heart-button"
      aria-label={isFull ? 'Favorites full' : 'Save favorite color'}
      onClick={onSave}
      disabled={isFull}
      className={styles.button}
    >
      {isFull ? '\u2764\uFE0F' : '\u2661'}
    </button>
  )
}

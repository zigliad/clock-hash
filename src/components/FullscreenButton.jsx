import styles from './FullscreenButton.module.css'

export function FullscreenButton({ isFullscreen, onToggle }) {
  return (
    <button
      data-testid="fullscreen-button"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      onClick={onToggle}
      className={styles.button}
    >
      {isFullscreen ? '\u2716' : '\u26F6'}
    </button>
  )
}

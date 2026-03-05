import styles from './ScreenshotButton.module.css'

export function ScreenshotButton({ onCapture }) {
  return (
    <button
      data-testid="screenshot-button"
      aria-label="Take screenshot"
      onClick={onCapture}
      className={styles.button}
    >
      &#128247;
    </button>
  )
}

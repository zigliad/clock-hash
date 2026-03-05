import styles from './NextBeautifulColorLabel.module.css'

export function NextBeautifulColorLabel({ label, display, textColor }) {
  if (!label || !display) return null

  return (
    <div
      data-testid="next-beautiful-label"
      className={styles.label}
      style={{ color: textColor, opacity: 0.7 }}
    >
      Next: {label} in {display}
    </div>
  )
}

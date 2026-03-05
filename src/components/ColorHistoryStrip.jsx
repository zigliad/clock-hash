import styles from './ColorHistoryStrip.module.css'

function ColorHistoryStrip({ history = [] }) {
  return (
    <div
      data-testid="color-history-strip"
      className={styles.strip}
    >
      {history.map((entry) => (
        <div
          key={entry.id}
          data-testid="color-slice"
          title={`${entry.time} — ${entry.hex}`}
          className={styles.slice}
          style={{ backgroundColor: entry.hex }}
        />
      ))}
    </div>
  )
}

export default ColorHistoryStrip

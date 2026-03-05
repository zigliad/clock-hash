import styles from './TimeFormatToggle.module.css'

function TimeFormatToggle({ is24h, onToggle }) {
  return (
    <button
      type="button"
      aria-label="time format toggle"
      onClick={onToggle}
      className={styles.button}
    >
      {is24h ? '24h' : '12h'}
    </button>
  )
}

export default TimeFormatToggle

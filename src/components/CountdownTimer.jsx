import { useState } from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { isValidTimeInput } from '../utils/countdown'
import styles from './CountdownTimer.module.css'

const MODE_IDLE = 'idle'
const MODE_INPUT = 'input'
const MODE_COUNTING = 'counting'

export function CountdownTimer() {
  const [mode, setMode] = useState(MODE_IDLE)
  const [targetTime, setTargetTime] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const { display, reached } = useCountdown(targetTime)

  function handleSubmit(e) {
    e.preventDefault()
    if (isValidTimeInput(inputValue)) {
      setTargetTime(inputValue)
      setMode(MODE_COUNTING)
    }
  }

  function handleClear() {
    setTargetTime(null)
    setInputValue('')
    setMode(MODE_IDLE)
  }

  function handleCancel() {
    setInputValue('')
    setMode(MODE_IDLE)
  }

  if (mode === MODE_INPUT) {
    return (
      <div data-testid="countdown-timer" className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            aria-label="Target time"
            type="time"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
            className={styles.input}
          />
          <button type="submit" className={styles.setButton}>
            Set
          </button>
        </form>
        <button
          onClick={handleCancel}
          aria-label="Cancel"
          className={styles.clearButton}
        >
          &times;
        </button>
      </div>
    )
  }

  if (mode === MODE_COUNTING) {
    return (
      <div
        data-testid="countdown-timer"
        className={`${reached ? 'pulse' : ''} ${styles.container}`}
      >
        <span className={styles.display}>{display}</span>
        <button
          onClick={handleClear}
          aria-label="Clear target"
          className={styles.clearButton}
        >
          &times;
        </button>
      </div>
    )
  }

  return (
    <div data-testid="countdown-timer" className={styles.container}>
      <button
        onClick={() => setMode(MODE_INPUT)}
        aria-label="Set target"
        className={styles.setButton}
      >
        Set target
      </button>
    </div>
  )
}

import { useState } from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { isValidTimeInput } from '../utils/countdown'

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
      <div data-testid="countdown-timer" style={containerStyle}>
        <form onSubmit={handleSubmit}>
          <input
            aria-label="Target time"
            type="time"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
            style={inputStyle}
          />
        </form>
        <button
          onClick={handleCancel}
          aria-label="Cancel"
          style={clearButtonStyle}
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
        className={reached ? 'pulse' : ''}
        style={containerStyle}
      >
        <span style={displayStyle}>{display}</span>
        <button
          onClick={handleClear}
          aria-label="Clear target"
          style={clearButtonStyle}
        >
          &times;
        </button>
      </div>
    )
  }

  return (
    <div data-testid="countdown-timer" style={containerStyle}>
      <button
        onClick={() => setMode(MODE_INPUT)}
        aria-label="Set target"
        style={setButtonStyle}
      >
        Set target
      </button>
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '8px',
  fontSize: '1.2rem',
}

const displayStyle = {
  fontFamily: 'monospace',
}

const inputStyle = {
  fontFamily: 'monospace',
  fontSize: '1rem',
  padding: '4px 8px',
  background: 'rgba(255,255,255,0.2)',
  border: '1px solid currentColor',
  borderRadius: '4px',
  color: 'inherit',
}

const setButtonStyle = {
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  padding: '4px 12px',
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid currentColor',
  borderRadius: '4px',
  color: 'inherit',
  cursor: 'pointer',
}

const clearButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'inherit',
  fontSize: '1.4rem',
  cursor: 'pointer',
  padding: '0 4px',
}

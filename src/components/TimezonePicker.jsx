import { useState, useMemo, useRef, useEffect } from 'react'
import { getCityName } from '../timezones'
import styles from './TimezonePicker.module.css'

let ALL_TIMEZONES = []
try {
  ALL_TIMEZONES = Intl.supportedValuesOf('timeZone')
} catch {
  ALL_TIMEZONES = ['UTC']
}

export function TimezonePicker({ onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_TIMEZONES
    const lower = query.toLowerCase()
    return ALL_TIMEZONES.filter((tz) => {
      const readable = tz.replace(/_/g, ' ').toLowerCase()
      return readable.includes(lower)
    })
  }, [query])

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <input
          ref={inputRef}
          className={styles.search}
          type="text"
          placeholder="Search timezone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={styles.closeBtn}
          aria-label="Close picker"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <ul className={styles.list}>
        {filtered.length === 0 && (
          <li className={styles.noResults}>No timezones found</li>
        )}
        {filtered.map((tz) => (
          <li key={tz}>
            <button
              className={styles.option}
              onClick={() => onSelect(tz)}
            >
              <span className={styles.city}>{getCityName(tz)}</span>
              <span className={styles.region}>{tz}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

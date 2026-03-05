import { useState } from 'react'
import { getTimeForTimezone } from './timezones'
import { convertTo12Hour } from './utils/timeFormat'
import { useCustomTimezones } from './hooks/useCustomTimezones'
import { TimezonePicker } from './components/TimezonePicker'
import styles from './WorldClocksBar.module.css'

function WorldClocksBar({ activeZone, onSelectZone, is24h = true }) {
  const { timezones, isCustomized, updateTimezone, resetTimezones } = useCustomTimezones()
  const [editingIndex, setEditingIndex] = useState(null)

  function handleEditClick(e, index) {
    e.stopPropagation()
    setEditingIndex(index)
  }

  function handleSelect(ianaZone) {
    if (editingIndex !== null) {
      updateTimezone(editingIndex, ianaZone)
      setEditingIndex(null)
    }
  }

  function handleClosePicker() {
    setEditingIndex(null)
  }

  return (
    <div className={styles.bar}>
      {timezones.map((tz, index) => {
        const isActive = activeZone === tz.zone
        const cardClass = `${styles.card} ${isActive ? styles.cardActive : styles.cardInactive}`
        return (
          <div
            key={tz.zone + index}
            data-testid="tz-card"
            className={styles.cardWrapper}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`${tz.label} timezone`}
              aria-pressed={isActive}
              onClick={() => onSelectZone?.(tz.zone)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectZone?.(tz.zone)
                }
              }}
              className={cardClass}
            >
              <div className={styles.cardLabel}>{tz.label}</div>
              <div className={styles.cardTime}>
                {is24h ? getTimeForTimezone(tz.zone) : convertTo12Hour(getTimeForTimezone(tz.zone))}
              </div>
              <button
                className={styles.editBtn}
                aria-label={`Edit ${tz.label} timezone`}
                onClick={(e) => handleEditClick(e, index)}
              >
                &#9998;
              </button>
            </div>
            {editingIndex === index && (
              <div className={styles.pickerContainer}>
                <TimezonePicker onSelect={handleSelect} onClose={handleClosePicker} />
              </div>
            )}
          </div>
        )
      })}
      {isCustomized && (
        <button
          className={styles.resetBtn}
          aria-label="Reset to default timezones"
          onClick={resetTimezones}
        >
          Reset
        </button>
      )}
    </div>
  )
}

export default WorldClocksBar

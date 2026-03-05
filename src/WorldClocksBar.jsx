import { TIMEZONES, getTimeForTimezone } from './timezones'
import { convertTo12Hour } from './utils/timeFormat'
import styles from './WorldClocksBar.module.css'

function WorldClocksBar({ activeZone, onSelectZone, is24h = true }) {
  return (
    <div className={styles.bar}>
      {TIMEZONES.map((tz) => {
        const isActive = activeZone === tz.zone
        return (
          <div
            key={tz.zone}
            data-testid="tz-card"
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
            className={styles.card}
            style={{
              backgroundColor: isActive
                ? 'rgba(255,255,255,0.35)'
                : 'rgba(255,255,255,0.15)',
              border: isActive ? '2px solid rgba(255,255,255,0.6)' : '2px solid transparent',
            }}
          >
            <div className={styles.cardLabel}>{tz.label}</div>
            <div className={styles.cardTime}>
              {is24h ? getTimeForTimezone(tz.zone) : convertTo12Hour(getTimeForTimezone(tz.zone))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WorldClocksBar

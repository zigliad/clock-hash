import { TIMEZONES, getTimeForTimezone } from './timezones'

function WorldClocksBar({ activeZone, onSelectZone }) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}>
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
            style={{
              backgroundColor: isActive
                ? 'rgba(255,255,255,0.35)'
                : 'rgba(255,255,255,0.15)',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              minWidth: '100px',
              border: isActive ? '2px solid rgba(255,255,255,0.6)' : '2px solid transparent',
              transition: 'background-color 0.2s, border-color 0.2s',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{tz.label}</div>
            <div style={{ fontFamily: 'monospace' }}>{getTimeForTimezone(tz.zone)}</div>
          </div>
        )
      })}
    </div>
  )
}

export default WorldClocksBar

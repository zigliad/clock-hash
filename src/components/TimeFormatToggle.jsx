function TimeFormatToggle({ is24h, onToggle }) {
  return (
    <button
      type="button"
      aria-label="time format toggle"
      onClick={onToggle}
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '6px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        color: 'inherit',
      }}
    >
      {is24h ? '24h' : '12h'}
    </button>
  )
}

export default TimeFormatToggle

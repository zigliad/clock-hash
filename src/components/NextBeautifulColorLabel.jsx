const BOTTOM_OFFSET = 30

export function NextBeautifulColorLabel({ label, display, textColor }) {
  if (!label || !display) return null

  return (
    <div
      data-testid="next-beautiful-label"
      style={{
        position: 'absolute',
        bottom: BOTTOM_OFFSET,
        left: '50%',
        transform: 'translateX(-50%)',
        color: textColor,
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        opacity: 0.7,
        whiteSpace: 'nowrap',
      }}
    >
      Next: {label} in {display}
    </div>
  )
}

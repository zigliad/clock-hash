const STRIP_HEIGHT = 20

function ColorHistoryStrip({ history = [] }) {
  return (
    <div
      data-testid="color-history-strip"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: `${STRIP_HEIGHT}px`,
        display: 'flex',
        zIndex: 10,
      }}
    >
      {history.map((entry) => (
        <div
          key={entry.id}
          data-testid="color-slice"
          title={`${entry.time} — ${entry.hex}`}
          style={{
            flex: 1,
            backgroundColor: entry.hex,
          }}
        />
      ))}
    </div>
  )
}

export default ColorHistoryStrip

interface ColorHistoryEntry {
  id: number
  time: string
  hex: string
}

interface ColorHistoryStripProps {
  history?: ColorHistoryEntry[]
}

function ColorHistoryStrip({ history = [] }: ColorHistoryStripProps) {
  return (
    <div
      data-testid="color-history-strip"
      className="w-full h-5 flex shrink-0"
    >
      {history.map((entry) => (
        <div
          key={entry.id}
          data-testid="color-slice"
          title={`${entry.time} — ${entry.hex}`}
          className="flex-1"
          style={{ backgroundColor: entry.hex }}
        />
      ))}
    </div>
  )
}

export default ColorHistoryStrip

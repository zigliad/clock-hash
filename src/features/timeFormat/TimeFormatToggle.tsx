import { Button } from '@/components/ui/button'

function TimeFormatToggle({ is24h, onToggle }) {
  return (
    <Button
      type="button"
      aria-label="time format toggle"
      onClick={onToggle}
      variant="outline"
      size="sm"
      className="font-mono"
    >
      {is24h ? '24h' : '12h'}
    </Button>
  )
}

export default TimeFormatToggle

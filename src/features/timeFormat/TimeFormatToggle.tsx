import { Button } from '@/components/ui/button'

interface TimeFormatToggleProps {
  is24h: boolean
  onToggle: () => void
}

function TimeFormatToggle({ is24h, onToggle }: TimeFormatToggleProps) {
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

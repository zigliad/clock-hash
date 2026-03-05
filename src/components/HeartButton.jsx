import { Button } from '@/components/ui/button'

export function HeartButton({ onSave, isFull }) {
  return (
    <Button
      data-testid="heart-button"
      aria-label={isFull ? 'Favorites full' : 'Save favorite color'}
      onClick={onSave}
      disabled={isFull}
      variant="ghost"
      size="icon"
      className="opacity-50"
    >
      {isFull ? '\u2764\uFE0F' : '\u2661'}
    </Button>
  )
}

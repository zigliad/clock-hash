import { Button } from '@/components/ui/button'

export function FullscreenButton({ isFullscreen, onToggle }) {
  return (
    <Button
      data-testid="fullscreen-button"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      onClick={onToggle}
      variant="ghost"
      size="icon"
      className="opacity-50"
    >
      {isFullscreen ? '\u2716' : '\u26F6'}
    </Button>
  )
}

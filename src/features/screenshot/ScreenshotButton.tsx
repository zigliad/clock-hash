import { Button } from '@/components/ui/button'

export function ScreenshotButton({ onCapture }) {
  return (
    <Button
      data-testid="screenshot-button"
      aria-label="Take screenshot"
      onClick={onCapture}
      variant="ghost"
      size="icon"
      className="opacity-50"
    >
      &#128247;
    </Button>
  )
}

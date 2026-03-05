import { Button } from '@/components/ui/button'

interface ScreenshotButtonProps {
  onCapture: () => void
}

export function ScreenshotButton({ onCapture }: ScreenshotButtonProps) {
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

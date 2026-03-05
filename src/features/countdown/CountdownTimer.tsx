import { useState } from 'react'
import { useCountdown } from './useCountdown'
import { isValidTimeInput } from '../../utils/countdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const MODE_IDLE = 'idle'
const MODE_INPUT = 'input'
const MODE_COUNTING = 'counting'
const CONTAINER_CLASSES = 'flex items-center justify-center gap-2 p-2 text-lg'

type Mode = 'idle' | 'input' | 'counting'

export function CountdownTimer() {
  const [mode, setMode] = useState<Mode>(MODE_IDLE)
  const [targetTime, setTargetTime] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const { display, reached } = useCountdown(targetTime)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isValidTimeInput(inputValue)) {
      setTargetTime(inputValue)
      setMode(MODE_COUNTING)
    }
  }

  function handleClear() {
    setTargetTime(null)
    setInputValue('')
    setMode(MODE_IDLE)
  }

  function handleCancel() {
    setInputValue('')
    setMode(MODE_IDLE)
  }

  if (mode === MODE_INPUT) {
    return (
      <div data-testid="countdown-timer" className={CONTAINER_CLASSES}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            aria-label="Target time"
            type="time"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Escape' && handleCancel()}
            className="font-mono text-base py-1 px-2 bg-white/20 border-current"
          />
          <Button type="submit" variant="outline" size="sm" className="font-mono">
            Set
          </Button>
        </form>
        <Button
          onClick={handleCancel}
          aria-label="Cancel"
          variant="ghost"
          size="icon"
          className="text-xl"
        >
          &times;
        </Button>
      </div>
    )
  }

  if (mode === MODE_COUNTING) {
    return (
      <div
        data-testid="countdown-timer"
        className={`${reached ? 'pulse' : ''} ${CONTAINER_CLASSES}`}
      >
        <span className="font-mono">{display}</span>
        <Button
          onClick={handleClear}
          aria-label="Clear target"
          variant="ghost"
          size="icon"
          className="text-xl"
        >
          &times;
        </Button>
      </div>
    )
  }

  return (
    <div data-testid="countdown-timer" className={CONTAINER_CLASSES}>
      <Button
        onClick={() => setMode(MODE_INPUT)}
        aria-label="Set target"
        variant="outline"
        size="sm"
        className="font-mono"
      >
        Set target
      </Button>
    </div>
  )
}

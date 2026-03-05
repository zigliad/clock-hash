import { useState } from 'react'
import { getTimeForTimezone } from '../../utils/timezones'
import { timeToColor } from '../../utils/clock'
import { convertTo12Hour } from '../../utils/timeFormat'
import { useCustomTimezones } from './useCustomTimezones'
import { TimezonePicker } from './TimezonePicker'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { Z_MODAL } from '@/utils/zIndex'

interface WorldClocksBarProps {
  activeZone: string | null
  onSelectZone: (zone: string) => void
  is24h?: boolean
}

function WorldClocksBar({ activeZone, onSelectZone, is24h = true }: WorldClocksBarProps) {
  const { timezones, isCustomized, updateTimezone, resetTimezones } = useCustomTimezones()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  function handleEditClick(e: React.MouseEvent, index: number) {
    e.stopPropagation()
    setEditingIndex(index)
  }

  function handleSelect(ianaZone: string) {
    if (editingIndex !== null) {
      updateTimezone(editingIndex, ianaZone)
      setEditingIndex(null)
    }
  }

  function handleClosePicker() {
    setEditingIndex(null)
  }

  return (
    <div className="flex gap-3 justify-center flex-wrap overflow-visible items-start">
      {timezones.map((tz, index) => {
        const isActive = activeZone === tz.zone
        const tzTime = getTimeForTimezone(tz.zone)
        const tzColor = timeToColor(tzTime)
        return (
          <div
            key={tz.zone + index}
            data-testid="tz-card"
            className="relative"
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`${tz.label} timezone`}
              aria-pressed={isActive}
              onClick={() => onSelectZone?.(tz.zone)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectZone?.(tz.zone)
                }
              }}
              className={cn(
                'group relative p-3 px-4 rounded-lg cursor-pointer text-center min-w-[100px] transition-colors duration-200 border-2',
                isActive
                  ? 'bg-white/35 border-white/60'
                  : 'bg-white/15 border-transparent'
              )}
            >
              <span
                data-testid="tz-swatch"
                className="inline-block w-3 h-3 rounded-full border border-white/40 mb-1 cursor-default"
                style={{ backgroundColor: tzColor }}
                title={tzColor}
                aria-hidden="true"
              />
              <div className="font-bold mb-1">{tz.label}</div>
              <div className="font-mono">
                {is24h ? tzTime : convertTo12Hour(tzTime)}
              </div>
              <button
                className="absolute top-1 right-1 bg-transparent border-none text-inherit text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1 py-0.5 rounded-sm focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white/60"
                aria-label={`Edit ${tz.label} timezone`}
                onClick={(e) => handleEditClick(e, index)}
              >
                &#9998;
              </button>
            </div>
            {editingIndex === index && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 max-[480px]:left-0 max-[480px]:translate-x-0"
                style={{ zIndex: Z_MODAL }}
              >
                <TimezonePicker onSelect={handleSelect} onClose={handleClosePicker} />
              </div>
            )}
          </div>
        )
      })}
      {isCustomized && (
        <Button
          aria-label="Reset to default timezones"
          onClick={resetTimezones}
          variant="outline"
          size="sm"
          className="self-center"
        >
          Reset
        </Button>
      )}
    </div>
  )
}

export default WorldClocksBar

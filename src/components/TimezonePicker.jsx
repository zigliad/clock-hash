import { useState, useMemo, useRef, useEffect } from 'react'
import { getCityName } from '../timezones'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

let ALL_TIMEZONES = []
try {
  ALL_TIMEZONES = Intl.supportedValuesOf('timeZone')
} catch {
  ALL_TIMEZONES = ['UTC']
}

export function TimezonePicker({ onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_TIMEZONES
    const lower = query.toLowerCase()
    return ALL_TIMEZONES.filter((tz) => {
      const readable = tz.replace(/_/g, ' ').toLowerCase()
      return readable.includes(lower)
    })
  }, [query])

  return (
    <div className="flex flex-col w-[280px] max-h-[320px] bg-black/85 rounded-lg overflow-hidden">
      <div className="flex gap-1 p-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search timezone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
        />
        <Button
          aria-label="Close picker"
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-white text-lg min-w-7"
        >
          &times;
        </Button>
      </div>
      <ul className="list-none m-0 p-0 overflow-y-auto flex-1">
        {filtered.length === 0 && (
          <li className="p-3 text-center text-white/50 text-[13px]">No timezones found</li>
        )}
        {filtered.map((tz) => (
          <li key={tz}>
            <button
              className="flex justify-between items-center w-full py-2 px-3 bg-transparent border-none text-white cursor-pointer text-left text-[13px] gap-2 hover:bg-white/15"
              onClick={() => onSelect(tz)}
            >
              <span className="font-bold">{getCityName(tz)}</span>
              <span className="text-[11px] opacity-60">{tz}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

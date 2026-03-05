import { useState, useEffect } from 'react'
import WorldClocksBar from './WorldClocksBar'
import TimeFormatToggle from './components/TimeFormatToggle'
import ColorHistoryStrip from './components/ColorHistoryStrip'
import { getTimeForTimezone } from './timezones'
import { useTimeFormat } from './hooks/useTimeFormat'
import { useColorHistory } from './hooks/useColorHistory'
import { CountdownTimer } from './components/CountdownTimer'
import { ColorInfoOverlay } from './components/ColorInfoOverlay'
import { convertTo12Hour } from './utils/timeFormat'
import { useNextBeautifulColor } from './hooks/useNextBeautifulColor'
import { NextBeautifulColorLabel } from './components/NextBeautifulColorLabel'

function App() {
  const [activeZone, setActiveZone] = useState(null)
  const [tick, setTick] = useState(0)
  const { is24h, toggle } = useTimeFormat()

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  void tick
  const rawTime = getDisplayTime(activeZone)
  const time = is24h ? rawTime : convertTo12Hour(rawTime)
  const color = timeToColor(time)
  const lightness = getLightness(color)
  const colorHistory = useColorHistory(color)
  const nextBeautiful = useNextBeautifulColor(is24h)

  function handleSelectZone(zone) {
    setActiveZone((prev) => (prev === zone ? null : zone))
  }

  return (
    <div style={{
      backgroundColor: color,
      color: lightness > 0.5 ? '#000' : '#fff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 1s, color 1s',
      fontFamily: 'monospace',
      position: 'relative',
    }}>
      <TimeFormatToggle is24h={is24h} onToggle={toggle} />
      <WorldClocksBar activeZone={activeZone} onSelectZone={handleSelectZone} is24h={is24h} />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div data-testid="main-clock" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
          {time}
        </div>
        <CountdownTimer />
      </div>
      <ColorHistoryStrip history={colorHistory} />
      {nextBeautiful && (
        <NextBeautifulColorLabel
          label={nextBeautiful.label}
          display={nextBeautiful.display}
          textColor={lightness > 0.5 ? '#000' : '#fff'}
        />
      )}
      <ColorInfoOverlay hex={color} textColor={lightness > 0.5 ? '#000' : '#fff'} />
    </div>
  )
}

function getDisplayTime(zone) {
  if (zone) {
    return getTimeForTimezone(zone)
  }
  return getLocalTime()
}

function getLocalTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function timeToColor(time) {
  const hex = time.replace(/:/g, '')
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return `#${hex}`
  }
  return '#000000'
}

function getLightness(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b
}

export default App

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
import { getLocalTime, timeToColor, getLightness, incrementTime } from './utils/clock'
import { useColorTransition } from './hooks/useColorTransition'
import { useNextBeautifulColor } from './hooks/useNextBeautifulColor'
import { NextBeautifulColorLabel } from './components/NextBeautifulColorLabel'
import { useFullscreen } from './hooks/useFullscreen'
import { FullscreenButton } from './components/FullscreenButton'
import { useScreenshot } from './hooks/useScreenshot'
import { ScreenshotButton } from './components/ScreenshotButton'
import styles from './App.module.css'

function App() {
  const [activeZone, setActiveZone] = useState(null)
  const [tick, setTick] = useState(0)
  const { is24h, toggle } = useTimeFormat()

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  void tick
  const rawTime = activeZone ? getTimeForTimezone(activeZone) : getLocalTime()
  const time = is24h ? rawTime : convertTo12Hour(rawTime)
  const color = timeToColor(time)
  const nextRawTime = incrementTime(rawTime)
  const nextTime = is24h ? nextRawTime : convertTo12Hour(nextRawTime)
  const nextColor = timeToColor(nextTime)
  const interpolatedColor = useColorTransition(color, nextColor)
  const lightness = getLightness(interpolatedColor)
  const colorHistory = useColorHistory(color)
  const nextBeautiful = useNextBeautifulColor(is24h)
  const { isFullscreen, cursorHidden, toggleFullscreen } = useFullscreen()
  const { takeScreenshot } = useScreenshot()
  const textColor = lightness > 0.5 ? '#000' : '#fff'

  function handleScreenshot() {
    takeScreenshot({ time: rawTime, hex: color, textColor })
  }

  function handleSelectZone(zone) {
    setActiveZone((prev) => (prev === zone ? null : zone))
  }

  return (
    <div
      className={styles.root}
      style={{
        backgroundColor: interpolatedColor,
        color: textColor,
        cursor: cursorHidden ? 'none' : 'default',
      }}
    >
      {!isFullscreen ? (
        <div className={styles.header}>
          <div className={styles.headerClocks}>
            <WorldClocksBar activeZone={activeZone} onSelectZone={handleSelectZone} is24h={is24h} />
          </div>
          <div className={styles.toolbar}>
            <ScreenshotButton onCapture={handleScreenshot} />
            <TimeFormatToggle is24h={is24h} onToggle={toggle} />
            {!cursorHidden && <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />}
          </div>
        </div>
      ) : (
        !cursorHidden && (
          <div className={styles.toolbar}>
            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
          </div>
        )
      )}
      <div className={styles.center}>
        <div data-testid="main-clock" className={styles.clock}>
          {time}
        </div>
        {!isFullscreen && <CountdownTimer />}
      </div>
      {!isFullscreen && nextBeautiful && (
        <NextBeautifulColorLabel
          label={nextBeautiful.label}
          display={nextBeautiful.display}
          textColor={textColor}
        />
      )}
      {!isFullscreen && <ColorInfoOverlay hex={color} textColor={textColor} />}
      {!isFullscreen && <ColorHistoryStrip history={colorHistory} />}
    </div>
  )
}

export default App

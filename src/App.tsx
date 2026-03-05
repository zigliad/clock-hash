import { useState, useEffect, useCallback } from 'react'
import WorldClocksBar from './features/worldClocks/WorldClocksBar'
import TimeFormatToggle from './features/timeFormat/TimeFormatToggle'
import ColorHistoryStrip from './features/colorHistory/ColorHistoryStrip'
import { getTimeForTimezone } from './utils/timezones'
import { useTimeFormat } from './features/timeFormat/useTimeFormat'
import { useColorHistory } from './features/colorHistory/useColorHistory'
import { CountdownTimer } from './features/countdown/CountdownTimer'
import { ColorInfoOverlay } from './features/colorInfo/ColorInfoOverlay'
import { convertTo12Hour } from './utils/timeFormat'
import { getLocalTime, timeToColor, getLightness, incrementTime } from './utils/clock'
import { useColorTransition } from './features/clock/useColorTransition'
import { useNextBeautifulColor } from './features/beautifulColor/useNextBeautifulColor'
import { NextBeautifulColorLabel } from './features/beautifulColor/NextBeautifulColorLabel'
import { useFullscreen } from './features/fullscreen/useFullscreen'
import { FullscreenButton } from './features/fullscreen/FullscreenButton'
import { useScreenshot } from './features/screenshot/useScreenshot'
import { ScreenshotButton } from './features/screenshot/ScreenshotButton'
import { useFavorites } from './features/favourites/useFavorites'
import { HeartButton } from './features/favourites/HeartButton'
import { FavoritesPanel } from './features/favourites/FavoritesPanel'

function App() {
  const [activeZone, setActiveZone] = useState(null)
  const [tick, setTick] = useState(0)
  const [frozenColor, setFrozenColor] = useState(null)
  const [activeFavoriteId, setActiveFavoriteId] = useState(null)
  const { is24h, toggle } = useTimeFormat()
  const { favorites, isFull, addFavorite, removeFavorite } = useFavorites()

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
  const displayColor = frozenColor || interpolatedColor
  const displayLightness = frozenColor ? getLightness(frozenColor) : lightness
  const textColor = displayLightness > 0.5 ? '#000' : '#fff'

  function handleScreenshot() {
    takeScreenshot({ time: rawTime, hex: color, textColor })
  }

  function handleSelectZone(zone) {
    setActiveZone((prev) => (prev === zone ? null : zone))
  }

  function handleSaveFavorite() {
    addFavorite({ time: rawTime, hex: color, timezone: activeZone || 'local' })
  }

  const handleSelectFavorite = useCallback((id) => {
    if (activeFavoriteId === id) {
      setFrozenColor(null)
      setActiveFavoriteId(null)
    } else {
      const fav = favorites.find((f) => f.id === id)
      if (fav) {
        setFrozenColor(fav.hex)
        setActiveFavoriteId(id)
      }
    }
  }, [activeFavoriteId, favorites])

  const handleDeleteFavorite = useCallback((id) => {
    if (activeFavoriteId === id) {
      setFrozenColor(null)
      setActiveFavoriteId(null)
    }
    removeFavorite(id)
  }, [activeFavoriteId, removeFavorite])

  useEffect(() => {
    if (!frozenColor) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setFrozenColor(null)
        setActiveFavoriteId(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [frozenColor])

  return (
    <div
      className="h-screen flex flex-col font-mono relative overflow-hidden transition-colors duration-1000"
      style={{
        backgroundColor: displayColor,
        color: textColor,
        cursor: cursorHidden ? 'none' : 'default',
      }}
    >
      {!isFullscreen ? (
        <div className="flex items-start p-4 gap-3">
          <div className="flex-1 flex gap-3 justify-center flex-wrap overflow-hidden">
            <WorldClocksBar activeZone={activeZone} onSelectZone={handleSelectZone} is24h={is24h} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <HeartButton onSave={handleSaveFavorite} isFull={isFull} />
            <FavoritesPanel
              favorites={favorites}
              activeFavoriteId={activeFavoriteId}
              onSelect={handleSelectFavorite}
              onDelete={handleDeleteFavorite}
            />
            <ScreenshotButton onCapture={handleScreenshot} />
            <TimeFormatToggle is24h={is24h} onToggle={toggle} />
            {!cursorHidden && <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />}
          </div>
        </div>
      ) : (
        !cursorHidden && (
          <div className="flex items-center gap-2 shrink-0">
            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
          </div>
        )
      )}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div data-testid="main-clock" className="text-[clamp(3rem,10vw,8rem)]">
          {time}
        </div>
        {!isFullscreen && <CountdownTimer />}
        {frozenColor && <div data-testid="frozen-badge" className="text-xs opacity-60 px-2.5 py-0.5 border border-current rounded mt-2">frozen</div>}
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

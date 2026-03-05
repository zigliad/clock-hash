import { useState, useEffect } from 'react'

function App() {
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(interval)
  }, [])

  const color = `#${time.replace(/:/g, '')}`
  const lightness = getLightness(color)

  return (
    <div style={{
      backgroundColor: color,
      color: lightness > 0.5 ? '#000' : '#fff',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 1s, color 1s',
      fontFamily: 'monospace',
      fontSize: 'clamp(3rem, 10vw, 8rem)',
    }}>
      {time}
    </div>
  )
}

function getTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function getLightness(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b
}

export default App

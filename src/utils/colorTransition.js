export function lerpColor(from, to, t) {
  const clamped = Math.max(0, Math.min(1, t))

  const r1 = parseInt(from.slice(1, 3), 16)
  const g1 = parseInt(from.slice(3, 5), 16)
  const b1 = parseInt(from.slice(5, 7), 16)

  const r2 = parseInt(to.slice(1, 3), 16)
  const g2 = parseInt(to.slice(3, 5), 16)
  const b2 = parseInt(to.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * clamped)
  const g = Math.round(g1 + (g2 - g1) * clamped)
  const b = Math.round(b1 + (b2 - b1) * clamped)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function incrementTime(hhmmss) {
  const [h, m, s] = hhmmss.split(':').map(Number)
  let totalSeconds = h * 3600 + m * 60 + s + 1
  totalSeconds = totalSeconds % 86400

  const newH = Math.floor(totalSeconds / 3600)
  const newM = Math.floor((totalSeconds % 3600) / 60)
  const newS = totalSeconds % 60

  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}`
}

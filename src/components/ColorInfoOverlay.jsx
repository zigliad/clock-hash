import { useMemo } from 'react'
import { formatColorInfo } from '../utils/colorInfo'

export function ColorInfoOverlay({ hex, textColor }) {
  const info = useMemo(() => formatColorInfo(hex), [hex])

  return (
    <div
      data-testid="color-info-overlay"
      style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        color: textColor,
        opacity: 0.7,
        pointerEvents: 'none',
      }}
    >
      {info.hex} &middot; {info.rgb} &middot; {info.cssName}
    </div>
  )
}

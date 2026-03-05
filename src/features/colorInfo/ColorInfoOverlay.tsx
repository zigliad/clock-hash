import { useMemo } from 'react'
import { formatColorInfo } from '../../utils/colorInfo'

export function ColorInfoOverlay({ hex, textColor }) {
  const info = useMemo(() => formatColorInfo(hex), [hex])

  return (
    <div
      data-testid="color-info-overlay"
      className="absolute bottom-10 right-4 text-xs font-mono pointer-events-none opacity-70"
      style={{ color: textColor }}
    >
      {info.hex} &middot; {info.rgb} &middot; {info.cssName}
    </div>
  )
}

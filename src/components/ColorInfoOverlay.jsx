import { useMemo } from 'react'
import { formatColorInfo } from '../utils/colorInfo'
import styles from './ColorInfoOverlay.module.css'

export function ColorInfoOverlay({ hex, textColor }) {
  const info = useMemo(() => formatColorInfo(hex), [hex])

  return (
    <div
      data-testid="color-info-overlay"
      className={styles.overlay}
      style={{ color: textColor, opacity: 0.7 }}
    >
      {info.hex} &middot; {info.rgb} &middot; {info.cssName}
    </div>
  )
}

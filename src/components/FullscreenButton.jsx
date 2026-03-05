const buttonStyle = {
  position: 'absolute',
  top: 10,
  right: 10,
  background: 'none',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '1.5rem',
  padding: 8,
  opacity: 0.5,
}

export function FullscreenButton({ isFullscreen, onToggle }) {
  return (
    <button
      data-testid="fullscreen-button"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      onClick={onToggle}
      style={buttonStyle}
    >
      {isFullscreen ? '\u2716' : '\u26F6'}
    </button>
  )
}

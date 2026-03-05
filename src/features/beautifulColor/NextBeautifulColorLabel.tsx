interface NextBeautifulColorLabelProps {
  label: string | null
  display: string | null
  textColor: string
}

export function NextBeautifulColorLabel({ label, display, textColor }: NextBeautifulColorLabelProps) {
  if (!label || !display) return null

  return (
    <div
      data-testid="next-beautiful-label"
      className="absolute bottom-[30px] left-1/2 -translate-x-1/2 font-mono text-sm whitespace-nowrap opacity-70"
      style={{ color: textColor }}
    >
      Next: {label} in {display}
    </div>
  )
}

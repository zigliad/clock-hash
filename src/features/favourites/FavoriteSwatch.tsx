import { cn } from '@/utils/cn'

interface FavoriteItem {
  id: string
  hex: string
  time: string
}

interface FavoriteSwatchProps {
  favorite: FavoriteItem
  isActive: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function FavoriteSwatch({ favorite, isActive, onSelect, onDelete }: FavoriteSwatchProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(favorite.id)
    }
  }

  return (
    <div
      data-testid={`swatch-${favorite.id}`}
      data-active={isActive || undefined}
      className={cn(
        'flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer w-full opacity-80 hover:opacity-100',
        isActive && 'opacity-100 outline-2 outline-current'
      )}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(favorite.id)}
      onKeyDown={handleKeyDown}
    >
      <div
        data-testid={`swatch-color-${favorite.id}`}
        className="w-6 h-6 rounded shrink-0 border border-white/30"
        style={{ backgroundColor: favorite.hex }}
      />
      <span className="font-mono text-xs">{favorite.hex}</span>
      <span className="font-mono text-[0.75rem] opacity-70">{favorite.time}</span>
      <button
        aria-label="Delete favorite"
        className="ml-auto bg-transparent border-none text-inherit cursor-pointer text-base px-1.5 py-0.5 opacity-50 hover:opacity-100 shrink-0"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(favorite.id)
        }}
      >
        &times;
      </button>
    </div>
  )
}

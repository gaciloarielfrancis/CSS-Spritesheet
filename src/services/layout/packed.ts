import type { SpriteItem } from '../../types/sprite'
import type { LayoutResult } from './horizontal'

function effectiveSize(s: SpriteItem, trim: boolean): { w: number; h: number } {
  return trim ? { w: s.trimmedWidth, h: s.trimmedHeight } : { w: s.width, h: s.height }
}

interface Shelf {
  y: number
  height: number
  x: number
}

/**
 * Shelf-based rectangle packing (sort by height desc, then first-fit shelf).
 * Simple, fast for 100+ images and far tighter than plain grid for mixed sizes.
 */
export function layoutPacked(
  items: SpriteItem[],
  padding: number,
  gap: number,
  trim: boolean,
  maxRowWidth = 2048,
): LayoutResult {
  const positions = new Map<string, { x: number; y: number }>()
  if (items.length === 0) {
    return { positions, size: { width: padding * 2 || 1, height: padding * 2 || 1 } }
  }
  const sorted = [...items].sort((a, b) => {
    const ah = effectiveSize(a, trim).h
    const bh = effectiveSize(b, trim).h
    if (bh !== ah) return bh - ah
    return effectiveSize(b, trim).w - effectiveSize(a, trim).w
  })

  const limit = Math.max(256, maxRowWidth)
  const shelves: Shelf[] = []
  let sheetW = 0
  let sheetH = padding

  for (const item of sorted) {
    const { w, h } = effectiveSize(item, trim)
    let placed = false
    for (const shelf of shelves) {
      const shelfRight = limit - padding
      if (shelf.x + w <= shelfRight && h <= shelf.height) {
        positions.set(item.id, { x: shelf.x, y: shelf.y })
        shelf.x += w + gap
        if (shelf.x - gap > sheetW) sheetW = shelf.x - gap
        placed = true
        break
      }
    }
    if (!placed) {
      const y = sheetH
      const x = padding
      positions.set(item.id, { x, y })
      shelves.push({ y, height: h, x: x + w + gap })
      sheetH = y + h + gap
      if (x + w > sheetW) sheetW = x + w
    }
  }

  const totalW = Math.min(Math.max(sheetW + padding, 1), limit)
  const totalH = Math.max(sheetH - gap + padding, 1)
  return { positions, size: { width: totalW, height: totalH } }
}

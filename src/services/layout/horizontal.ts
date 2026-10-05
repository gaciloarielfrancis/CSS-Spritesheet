import type { SpriteItem, SheetSize } from '../../types/sprite'

export interface LayoutBox {
  id: string
  w: number
  h: number
}

export interface LayoutResult {
  positions: Map<string, { x: number; y: number }>
  size: SheetSize
}

function effectiveSize(s: SpriteItem, trim: boolean): { w: number; h: number } {
  return trim ? { w: s.trimmedWidth, h: s.trimmedHeight } : { w: s.width, h: s.height }
}

export function layoutHorizontal(items: SpriteItem[], padding: number, gap: number, trim: boolean): LayoutResult {
  const positions = new Map<string, { x: number; y: number }>()
  let x = padding
  let maxH = 0
  for (const item of items) {
    const { w, h } = effectiveSize(item, trim)
    positions.set(item.id, { x, y: padding })
    x += w + gap
    if (h > maxH) maxH = h
  }
  if (items.length > 0) x = x - gap + padding
  else x = padding * 2
  return { positions, size: { width: Math.max(x, 1), height: maxH + padding * 2 } }
}

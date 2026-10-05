import type { SpriteItem } from '../../types/sprite'
import type { LayoutResult } from './horizontal'

function effectiveSize(s: SpriteItem, trim: boolean): { w: number; h: number } {
  return trim ? { w: s.trimmedWidth, h: s.trimmedHeight } : { w: s.width, h: s.height }
}

export function layoutVertical(items: SpriteItem[], padding: number, gap: number, trim: boolean): LayoutResult {
  const positions = new Map<string, { x: number; y: number }>()
  let y = padding
  let maxW = 0
  for (const item of items) {
    const { w, h } = effectiveSize(item, trim)
    positions.set(item.id, { x: padding, y })
    y += h + gap
    if (w > maxW) maxW = w
  }
  if (items.length > 0) y = y - gap + padding
  else y = padding * 2
  return { positions, size: { width: maxW + padding * 2, height: Math.max(y, 1) } }
}

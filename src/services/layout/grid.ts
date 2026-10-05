import type { SpriteItem } from '../../types/sprite'
import type { LayoutResult } from './horizontal'

function effectiveSize(s: SpriteItem, trim: boolean): { w: number; h: number } {
  return trim ? { w: s.trimmedWidth, h: s.trimmedHeight } : { w: s.width, h: s.height }
}

/** Fixed-column grid: fills rows left→right. Column count is user configurable. */
export function layoutGrid(
  items: SpriteItem[],
  padding: number,
  gap: number,
  trim: boolean,
  columns: number,
): LayoutResult {
  const positions = new Map<string, { x: number; y: number }>()
  const cols = Math.max(1, Math.floor(columns) || 1)
  if (items.length === 0) {
    return { positions, size: { width: padding * 2 || 1, height: padding * 2 || 1 } }
  }
  const rows: SpriteItem[][] = []
  for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols))

  const colWidths = new Array<number>(cols).fill(0)
  const rowHeights: number[] = []
  rows.forEach((row, r) => {
    let rh = 0
    row.forEach((item, c) => {
      const { w, h } = effectiveSize(item, trim)
      if (w > (colWidths[c] ?? 0)) colWidths[c] = w
      if (h > rh) rh = h
    })
    rowHeights[r] = rh
  })

  const colX: number[] = []
  let acc = padding
  for (let c = 0; c < cols; c++) {
    colX[c] = acc
    acc += (colWidths[c] ?? 0) + gap
  }
  const totalW = acc - gap + padding

  let y = padding
  rows.forEach((row, r) => {
    row.forEach((item, c) => {
      positions.set(item.id, { x: colX[c] ?? padding, y })
    })
    y += (rowHeights[r] ?? 0) + gap
  })
  const totalH = y - gap + padding

  return { positions, size: { width: Math.max(totalW, 1), height: Math.max(totalH, 1) } }
}

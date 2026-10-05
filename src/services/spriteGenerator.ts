import type { SpriteItem, SpriteSettings, SheetSize } from '../types/sprite'
import { layoutHorizontal } from './layout/horizontal'
import { layoutVertical } from './layout/vertical'
import { layoutGrid } from './layout/grid'
import { layoutPacked } from './layout/packed'

export interface GeneratedSheet {
  canvas: HTMLCanvasElement
  size: SheetSize
  /** positions keyed by sprite id */
  positions: Map<string, { x: number; y: number }>
}

function backgroundFill(settings: SpriteSettings): string | null {
  if (settings.background === 'white') return '#ffffff'
  if (settings.background === 'black') return '#000000'
  if (settings.background === 'custom') return settings.backgroundColor || '#ffffff'
  return null
}

/**
 * Render the spritesheet to canvas.
 * - Only enabled sprites are packed (in current order).
 * - pixelRatio scales both canvas pixels and drawing so output is retina-ready.
 * - trim uses the precomputed trim box; CSS still reports full logical size.
 */
export function generateSpritesheet(
  allItems: SpriteItem[],
  settings: SpriteSettings,
): GeneratedSheet | null {
  const items = allItems.filter((s) => s.enabled)
  if (items.length === 0) return null

  const pad = Math.max(0, Math.floor(settings.padding))
  const gap = Math.max(0, Math.floor(settings.gap))
  const trim = settings.trimTransparent
  const ratio = settings.pixelRatio

  let layout
  switch (settings.layout) {
    case 'horizontal':
      layout = layoutHorizontal(items, pad, gap, trim)
      break
    case 'vertical':
      layout = layoutVertical(items, pad, gap, trim)
      break
    case 'grid':
      layout = layoutGrid(items, pad, gap, trim, settings.columns || 4)
      break
    case 'packed':
    default:
      layout = layoutPacked(items, pad, gap, trim, 2048)
      break
  }

  const scale = ratio
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(layout.size.width * scale))
  canvas.height = Math.max(1, Math.round(layout.size.height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D is not supported in this browser.')

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  const fill = backgroundFill(settings)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  for (const item of items) {
    const pos = layout.positions.get(item.id)
    if (!pos) continue
    const sx = trim ? item.trimOffsetX : 0
    const sy = trim ? item.trimOffsetY : 0
    const sw = trim ? item.trimmedWidth : item.width
    const sh = trim ? item.trimmedHeight : item.height
    if (sw <= 0 || sh <= 0) continue
    ctx.drawImage(
      item.image,
      sx, sy, sw, sh,
      Math.round(pos.x * scale), Math.round(pos.y * scale),
      Math.round(sw * scale), Math.round(sh * scale),
    )
  }

  const scaledPositions = new Map<string, { x: number; y: number }>()
  for (const [id, p] of layout.positions) {
    scaledPositions.set(id, { x: Math.round(p.x * scale), y: Math.round(p.y * scale) })
  }

  return {
    canvas,
    size: { width: canvas.width, height: canvas.height },
    positions: scaledPositions,
  }
}

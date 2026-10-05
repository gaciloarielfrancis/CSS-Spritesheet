import type { SpriteItem, SpriteSettings } from '../types/sprite'
import { sanitizePrefix } from '../utils/filenameUtils'

export interface CssSpriteEntry {
  id: string
  name: string
  cssClass: string
  x: number
  y: number
  width: number
  height: number
}

function fullClass(item: SpriteItem, prefix: string): string {
  const p = sanitizePrefix(prefix)
  return `${p}-${item.name}`
}

/** Logical (CSS px) coordinates: sheet pixels divided by pixelRatio. */
export function buildEntries(
  items: SpriteItem[],
  positions: Map<string, { x: number; y: number }>,
  settings: SpriteSettings,
): CssSpriteEntry[] {
  const ratio = settings.pixelRatio
  return items
    .filter((s) => s.enabled)
    .map((s) => {
      const p = positions.get(s.id) ?? { x: 0, y: 0 }
      return {
        id: s.id,
        name: s.name,
        cssClass: fullClass(s, settings.classPrefix),
        x: Math.round(p.x / ratio),
        y: Math.round(p.y / ratio),
        width: s.width,
        height: s.height,
      }
    })
}

function pos(x: number, y: number): string {
  // background-position uses negative offsets; keep 0 unitless-clean as "0 0".
  const px = x === 0 ? '0' : `-${x}px`
  const py = y === 0 ? '0' : `-${y}px`
  return `${px} ${py}`
}

export function generateCSS(
  entries: CssSpriteEntry[],
  settings: SpriteSettings,
  sheetW: number,
  sheetH: number,
): string {
  const prefix = sanitizePrefix(settings.classPrefix)
  const img = `${settings.fileBaseName}.${settings.outputFormat === 'jpeg' ? 'jpg' : settings.outputFormat}`
  const w = Math.round(sheetW / settings.pixelRatio)
  const h = Math.round(sheetH / settings.pixelRatio)
  const lines: string[] = []
  lines.push(`/* CSS Spritesheet — ${entries.length} sprites, ${w}×${h}px */`)
  lines.push(`/* Your images never leave your browser. Generated locally. */`)
  lines.push(`.${prefix} {`)
  lines.push(`  background-image: url("./${img}");`)
  lines.push(`  background-repeat: no-repeat;`)
  lines.push(`  display: inline-block;`)
  lines.push(`}`)
  lines.push(``)
  for (const e of entries) {
    lines.push(`.${e.cssClass} {`)
    lines.push(`  width: ${e.width}px;`)
    lines.push(`  height: ${e.height}px;`)
    lines.push(`  background-position: ${pos(e.x, e.y)};`)
    lines.push(`}`)
  }
  return lines.join('\n') + '\n'
}

export function generateSCSS(
  entries: CssSpriteEntry[],
  settings: SpriteSettings,
  sheetW: number,
  sheetH: number,
): string {
  const prefix = sanitizePrefix(settings.classPrefix)
  const img = `${settings.fileBaseName}.${settings.outputFormat === 'jpeg' ? 'jpg' : settings.outputFormat}`
  const w = Math.round(sheetW / settings.pixelRatio)
  const h = Math.round(sheetH / settings.pixelRatio)
  const lines: string[] = []
  lines.push(`// CSS Spritesheet — ${entries.length} sprites, ${w}×${h}px`)
  lines.push(`$spritesheet: "./${img}";`)
  lines.push(``)
  lines.push(`.${prefix} {`)
  lines.push(`  background-image: url($spritesheet);`)
  lines.push(`  background-repeat: no-repeat;`)
  lines.push(`  display: inline-block;`)
  lines.push(`}`)
  lines.push(``)
  for (const e of entries) {
    lines.push(`.${e.cssClass} {`)
    lines.push(`  width: ${e.width}px;`)
    lines.push(`  height: ${e.height}px;`)
    lines.push(`  background-position: ${pos(e.x, e.y)};`)
    lines.push(`}`)
  }
  return lines.join('\n') + '\n'
}

export function generateLESS(
  entries: CssSpriteEntry[],
  settings: SpriteSettings,
  sheetW: number,
  sheetH: number,
): string {
  const prefix = sanitizePrefix(settings.classPrefix)
  const img = `${settings.fileBaseName}.${settings.outputFormat === 'jpeg' ? 'jpg' : settings.outputFormat}`
  const w = Math.round(sheetW / settings.pixelRatio)
  const h = Math.round(sheetH / settings.pixelRatio)
  const lines: string[] = []
  lines.push(`// CSS Spritesheet — ${entries.length} sprites, ${w}×${h}px`)
  lines.push(`@spritesheet: "./${img}";`)
  lines.push(``)
  lines.push(`.${prefix} {`)
  lines.push(`  background-image: url(@spritesheet);`)
  lines.push(`  background-repeat: no-repeat;`)
  lines.push(`  display: inline-block;`)
  lines.push(`}`)
  lines.push(``)
  for (const e of entries) {
    lines.push(`.${e.cssClass} {`)
    lines.push(`  width: ${e.width}px;`)
    lines.push(`  height: ${e.height}px;`)
    lines.push(`  background-position: ${pos(e.x, e.y)};`)
    lines.push(`}`)
  }
  return lines.join('\n') + '\n'
}

export function generateJSON(
  entries: CssSpriteEntry[],
  settings: SpriteSettings,
  sheetW: number,
  sheetH: number,
): string {
  const img = `${settings.fileBaseName}.${settings.outputFormat === 'jpeg' ? 'jpg' : settings.outputFormat}`
  const sprites: Record<string, { x: number; y: number; width: number; height: number }> = {}
  for (const e of entries) {
    sprites[e.name] = { x: e.x, y: e.y, width: e.width, height: e.height }
  }
  return (
    JSON.stringify(
      {
        image: img,
        width: Math.round(sheetW / settings.pixelRatio),
        height: Math.round(sheetH / settings.pixelRatio),
        pixelRatio: settings.pixelRatio,
        sprites,
      },
      null,
      2,
    ) + '\n'
  )
}

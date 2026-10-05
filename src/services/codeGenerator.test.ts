import { describe, expect, it } from 'vitest'
import type { SpriteSettings } from '../types/sprite'
import { buildEntries, generateCSS, generateJSON } from './codeGenerator'
import type { SpriteItem } from '../types/sprite'

const baseSettings: SpriteSettings = {
  layout: 'packed',
  padding: 0,
  gap: 0,
  columns: 4,
  pixelRatio: 1,
  background: 'transparent',
  backgroundColor: '#ffffff',
  trimTransparent: false,
  outputFormat: 'png',
  quality: 90,
  classPrefix: 'sprite',
  fileBaseName: 'spritesheet',
}

function item(id: string, name: string): SpriteItem {
  return {
    id,
    name,
    className: `sprite-${name}`,
    fileName: `${name}.png`,
    file: new File([], `${name}.png`),
    objectUrl: '',
    image: new Image(),
    width: 32,
    height: 32,
    trimmedWidth: 32,
    trimmedHeight: 32,
    trimOffsetX: 0,
    trimOffsetY: 0,
    x: 0,
    y: 0,
    enabled: true,
    fileSize: 10,
  }
}

describe('CSS generation', () => {
  it('uses negative background-position coordinates', () => {
    const items = [item('1', 'home'), item('2', 'order')]
    const positions = new Map([
      ['1', { x: 0, y: 0 }],
      ['2', { x: 40, y: 20 }],
    ])
    const entries = buildEntries(items, positions, baseSettings)
    expect(entries[1]).toMatchObject({ x: 40, y: 20, width: 32, height: 32 })
    const css = generateCSS(entries, baseSettings, 72, 52)
    expect(css).toContain('.sprite-home {')
    expect(css).toContain('background-position: 0 0;')
    expect(css).toContain('background-position: -40px -20px;')
    expect(css).not.toMatch(/background-position: 40px 20px/)
  })

  it('divides sheet pixels by pixelRatio for retina output', () => {
    const settings = { ...baseSettings, pixelRatio: 2 as const }
    const items = [item('1', 'home')]
    const positions = new Map([['1', { x: 80, y: 40 }]])
    const entries = buildEntries(items, positions, settings)
    expect(entries[0]).toMatchObject({ x: 40, y: 20 })
    const css = generateCSS(entries, settings, 144, 104)
    expect(css).toContain('-40px -20px')
  })

  it('applies custom prefix and filename', () => {
    const settings = { ...baseSettings, classPrefix: 'icon', fileBaseName: 'game-icons' }
    const entries = buildEntries([item('1', 'shop')], new Map([['1', { x: 0, y: 0 }]]), settings)
    expect(entries[0]?.cssClass).toBe('icon-shop')
    const css = generateCSS(entries, settings, 32, 32)
    expect(css).toContain('.icon-shop')
    expect(css).toContain('url("./game-icons.png")')
  })

  it('generates JSON metadata with x/y/width/height', () => {
    const entries = buildEntries([item('1', 'home')], new Map([['1', { x: 0, y: 0 }]]), baseSettings)
    const json = JSON.parse(generateJSON(entries, baseSettings, 128, 64))
    expect(json.image).toBe('spritesheet.png')
    expect(json.width).toBe(128)
    expect(json.sprites.home).toEqual({ x: 0, y: 0, width: 32, height: 32 })
  })
})

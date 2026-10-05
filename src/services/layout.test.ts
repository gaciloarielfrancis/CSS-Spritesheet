import { describe, expect, it } from 'vitest'
import type { SpriteItem } from '../types/sprite'
import { layoutHorizontal } from './layout/horizontal'
import { layoutVertical } from './layout/vertical'
import { layoutGrid } from './layout/grid'
import { layoutPacked } from './layout/packed'

function fakeItem(id: string, w: number, h: number): SpriteItem {
  return {
    id,
    name: id,
    className: `sprite-${id}`,
    fileName: `${id}.png`,
    file: new File([], `${id}.png`),
    objectUrl: '',
    image: new Image(),
    width: w,
    height: h,
    trimmedWidth: w,
    trimmedHeight: h,
    trimOffsetX: 0,
    trimOffsetY: 0,
    x: 0,
    y: 0,
    enabled: true,
    fileSize: 100,
  }
}

describe('layout algorithms', () => {
  it('horizontal places items left→right with padding and gap', () => {
    const items = [fakeItem('a', 32, 32), fakeItem('b', 32, 32), fakeItem('c', 64, 16)]
    const { positions, size } = layoutHorizontal(items, 2, 4, false)
    expect(positions.get('a')).toEqual({ x: 2, y: 2 })
    expect(positions.get('b')).toEqual({ x: 38, y: 2 })
    expect(positions.get('c')).toEqual({ x: 74, y: 2 })
    expect(size).toEqual({ width: 140, height: 36 })
  })

  it('vertical stacks items top→bottom', () => {
    const items = [fakeItem('a', 32, 32), fakeItem('b', 64, 16)]
    const { positions, size } = layoutVertical(items, 0, 8, false)
    expect(positions.get('a')).toEqual({ x: 0, y: 0 })
    expect(positions.get('b')).toEqual({ x: 0, y: 40 })
    expect(size).toEqual({ width: 64, height: 56 })
  })

  it('grid fills fixed columns', () => {
    const items = [fakeItem('a', 32, 32), fakeItem('b', 32, 32), fakeItem('c', 32, 32)]
    const { positions, size } = layoutGrid(items, 0, 0, false, 2)
    expect(positions.get('a')).toEqual({ x: 0, y: 0 })
    expect(positions.get('b')).toEqual({ x: 32, y: 0 })
    expect(positions.get('c')).toEqual({ x: 0, y: 32 })
    expect(size).toEqual({ width: 64, height: 64 })
  })

  it('packed keeps every rect inside the sheet without overlap', () => {
    const items = [
      fakeItem('a', 100, 60),
      fakeItem('b', 32, 32),
      fakeItem('c', 50, 90),
      fakeItem('d', 20, 20),
    ]
    const { positions, size } = layoutPacked(items, 2, 2, false, 256)
    expect(size.width).toBeGreaterThan(0)
    expect(size.height).toBeGreaterThan(0)
    const rects = items.map((it) => {
      const p = positions.get(it.id) ?? { x: 0, y: 0 }
      return { ...p, w: it.width, h: it.height, id: it.id }
    })
    for (const r of rects) {
      expect(r.x).toBeGreaterThanOrEqual(2)
      expect(r.y).toBeGreaterThanOrEqual(2)
      expect(r.x + r.w + 2).toBeLessThanOrEqual(size.width + 0.001)
      expect(r.y + r.h + 2).toBeLessThanOrEqual(size.height + 0.001)
    }
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i]!
        const b = rects[j]!
        const overlap =
          a.x < b.x + b.w + 2 && a.x + a.w + 2 > b.x && a.y < b.y + b.h + 2 && a.y + a.h + 2 > b.y
        expect(overlap, `${a.id} overlaps ${b.id}`).toBe(false)
      }
    }
  })

  it('empty input yields a minimal sheet', () => {
    expect(layoutHorizontal([], 0, 0, false).size.width).toBeGreaterThan(0)
    expect(layoutPacked([], 0, 0, false).size.height).toBeGreaterThan(0)
  })
})

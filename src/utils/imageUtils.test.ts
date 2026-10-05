import { describe, expect, it, vi, afterEach } from 'vitest'
import { getTrimBox } from './imageUtils'

afterEach(() => {
  vi.restoreAllMocks()
})

/** Build a fake canvas whose getImageData returns the given alpha map. */
function mockTrimEnvironment(alpha: number[][], w: number, h: number): void {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = alpha[y]?.[x] ?? 0
      const i = (y * w + x) * 4
      data[i] = 255
      data[i + 1] = 0
      data[i + 2] = 0
      data[i + 3] = a
    }
  }
  const fakeCtx = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data, width: w, height: h })),
  }
  vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
    if (tag === 'canvas') {
      return {
        width: 0,
        height: 0,
        getContext: () => fakeCtx,
      } as unknown as HTMLCanvasElement
    }
    throw new Error(`unexpected createElement(${tag})`)
  }) as typeof document.createElement)
}

function fakeImg(w: number, h: number): HTMLImageElement {
  return { naturalWidth: w, naturalHeight: h } as HTMLImageElement
}

function opaque(w: number, h: number): number[][] {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => 255))
}

describe('transparent trimming', () => {
  it('keeps fully opaque images unchanged', () => {
    mockTrimEnvironment(opaque(32, 32), 32, 32)
    expect(getTrimBox(fakeImg(32, 32))).toEqual({ x: 0, y: 0, width: 32, height: 32 })
  })

  it('trims transparent borders', () => {
    const alpha = Array.from({ length: 32 }, () => Array.from({ length: 32 }, () => 0))
    for (let y = 6; y < 18; y++) for (let x = 10; x < 18; x++) alpha[y]![x] = 255
    mockTrimEnvironment(alpha, 32, 32)
    expect(getTrimBox(fakeImg(32, 32))).toEqual({ x: 10, y: 6, width: 8, height: 12 })
  })

  it('keeps fully transparent images at original size', () => {
    mockTrimEnvironment(
      Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => 0)),
      16,
      16,
    )
    expect(getTrimBox(fakeImg(16, 16))).toEqual({ x: 0, y: 0, width: 16, height: 16 })
  })
})

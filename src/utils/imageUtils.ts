export const ACCEPTED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
export const ACCEPTED_EXT = ['png', 'jpg', 'jpeg', 'webp', 'svg']
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB per file
export const MAX_DIMENSION = 4096
export const MAX_CANVAS_AREA = 16384 * 16384

export function isSupportedFile(file: File): boolean {
  if (ACCEPTED_MIME.includes(file.type)) return true
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return ACCEPTED_EXT.includes(ext)
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const v = bytes / Math.pow(1024, i)
  return `${v >= 100 ? Math.round(v) : v.toFixed(1)} ${units[i]}`
}

/** Decode a File into an HTMLImageElement without uploading anywhere. */
export function decodeImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    // SVG without explicit size may fail; decoding via blob URL still works in modern browsers.
    img.onload = () => {
      URL.revokeObjectURL(url)
      if (!img.naturalWidth || !img.naturalHeight) {
        reject(new Error('Image has zero dimensions.'))
        return
      }
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to decode image.'))
    }
    img.src = url
  })
}

export interface TrimBox {
  x: number
  y: number
  width: number
  height: number
}

/** Find the smallest bounding box containing non-transparent pixels. */
export function getTrimBox(img: HTMLImageElement): TrimBox {
  const w = img.naturalWidth
  const h = img.naturalHeight
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { x: 0, y: 0, width: w, height: h }
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0)
  let data: ImageData
  try {
    data = ctx.getImageData(0, 0, w, h)
  } catch {
    return { x: 0, y: 0, width: w, height: h }
  }
  const px = data.data
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = px[(y * w + x) * 4 + 3]
      if (a > 0) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX === -1) return { x: 0, y: 0, width: w, height: h } // fully transparent: keep original
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

export function validateImage(img: HTMLImageElement, fileName: string): string | null {
  if (img.naturalWidth > MAX_DIMENSION || img.naturalHeight > MAX_DIMENSION) {
    return `"${fileName}" is ${img.naturalWidth}×${img.naturalHeight}px — larger than the ${MAX_DIMENSION}px limit and was skipped.`
  }
  return null
}

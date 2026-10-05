export type SpriteLayout = 'horizontal' | 'vertical' | 'grid' | 'packed'

export type SpriteBackground = 'transparent' | 'white' | 'black' | 'custom'

export type OutputFormat = 'png' | 'webp' | 'jpeg'

export type CodeLanguage = 'css' | 'scss' | 'less' | 'json'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface SpriteItem {
  id: string
  /** sanitized base name, e.g. "shopping-cart" */
  name: string
  /** full css class without dot, e.g. "sprite-shopping-cart" (prefix applied at generation) */
  className: string
  fileName: string
  file: File
  /** object URL for thumbnails */
  objectUrl: string
  image: HTMLImageElement
  /** decoded natural size */
  width: number
  height: number
  /** trimmed size (content box after removing transparent borders) */
  trimmedWidth: number
  trimmedHeight: number
  /** offset of trimmed content inside the original image */
  trimOffsetX: number
  trimOffsetY: number
  /** layout position inside the sheet (top-left, includes padding) */
  x: number
  y: number
  enabled: boolean
  fileSize: number
}

export interface SpriteSettings {
  layout: SpriteLayout
  padding: number
  gap: number
  columns: number
  pixelRatio: 1 | 2 | 3
  background: SpriteBackground
  backgroundColor: string
  trimTransparent: boolean
  outputFormat: OutputFormat
  quality: number
  classPrefix: string
  fileBaseName: string
}

export interface PlacedSprite extends SpriteItem {
  x: number
  y: number
}

export interface SheetSize {
  width: number
  height: number
}

export interface SpriteMeta {
  x: number
  y: number
  width: number
  height: number
  cssClass: string
}

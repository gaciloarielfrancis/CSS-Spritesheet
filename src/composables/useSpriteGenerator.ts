import { computed, ref, watch } from 'vue'
import type { SpriteItem, SpriteSettings } from '../types/sprite'
import { generateSpritesheet, type GeneratedSheet } from '../services/spriteGenerator'
import { useDebounceFn } from '@vueuse/core'

const SETTINGS_KEY = 'css-spritesheet:settings:v2'
const THEME_KEY = 'css-spritesheet:theme'

export const DEFAULT_SETTINGS: SpriteSettings = {
  layout: 'packed',
  padding: 2,
  gap: 2,
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

export function loadSettings(): SpriteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<SpriteSettings>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      pixelRatio: parsed.pixelRatio === 2 || parsed.pixelRatio === 3 ? parsed.pixelRatio : 1,
      padding: Math.min(64, Math.max(0, Number(parsed.padding) || 0)),
      gap: Math.min(64, Math.max(0, Number(parsed.gap) || 0)),
      columns: Math.min(12, Math.max(1, Math.floor(Number(parsed.columns) || 4))),
      quality: Math.min(100, Math.max(1, Math.floor(Number(parsed.quality) || 90))),
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function useSpriteGenerator(getItems: () => SpriteItem[], settings: SpriteSettings) {
  const sheet = ref<GeneratedSheet | null>(null)
  const error = ref<string | null>(null)
  const previewUrl = ref<string | null>(null)

  const regenerate = (): void => {
    error.value = null
    try {
      const result = generateSpritesheet(getItems(), settings)
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
      sheet.value = result
      if (result) {
        // Fast preview: PNG data URL (even when export format is webp/jpeg).
        previewUrl.value = result.canvas.toDataURL('image/png')
        const ratio = settings.pixelRatio
        for (const item of getItems()) {
          const p = result.positions.get(item.id)
          if (p) {
            item.x = Math.round(p.x / ratio)
            item.y = Math.round(p.y / ratio)
          }
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to generate spritesheet.'
      sheet.value = null
    }
  }

  const debouncedRegenerate = useDebounceFn(regenerate, 150)

  // Auto-regenerate on any relevant change (prompt §30).
  watch(
    [
      () => getItems().map((i) => [i.id, i.enabled, i.width, i.height, i.name].join(':')).join('|'),
      () => [settings.layout, settings.padding, settings.gap, settings.columns].join('|'),
      () => [settings.pixelRatio, settings.background, settings.backgroundColor, settings.trimTransparent].join('|'),
    ],
    () => debouncedRegenerate(),
  )

  const enabledCount = computed(() => getItems().filter((i) => i.enabled).length)
  const sheetWidth = computed(() => (sheet.value ? Math.round(sheet.value.size.width / settings.pixelRatio) : 0))
  const sheetHeight = computed(() => (sheet.value ? Math.round(sheet.value.size.height / settings.pixelRatio) : 0))

  return { sheet, error, previewUrl, regenerate, debouncedRegenerate, enabledCount, sheetWidth, sheetHeight }
}

export function persistSettings(settings: SpriteSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    /* storage may be unavailable — ignore */
  }
}

export function loadTheme(): 'light' | 'dark' | 'system' {
  try {
    const t = localStorage.getItem(THEME_KEY)
    return t === 'light' || t === 'dark' ? t : 'system'
  } catch {
    return 'system'
  }
}

export function saveTheme(t: 'light' | 'dark' | 'system'): void {
  try {
    localStorage.setItem(THEME_KEY, t)
  } catch {
    /* ignore */
  }
}

export function applyTheme(t: 'light' | 'dark' | 'system'): void {
  const dark =
    t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

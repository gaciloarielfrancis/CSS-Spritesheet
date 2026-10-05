import { ref } from 'vue'
import type { SpriteItem } from '../types/sprite'
import {
  decodeImageFile,
  getTrimBox,
  isSupportedFile,
  validateImage,
  MAX_FILE_SIZE,
} from '../utils/imageUtils'
import { sanitizeBaseName, uniquifyClassNames } from '../utils/filenameUtils'

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export interface UploadError {
  fileName: string
  message: string
}

export function useSprites() {
  const items = ref<SpriteItem[]>([])
  const errors = ref<UploadError[]>([])
  const isLoading = ref(false)
  const selectedId = ref<string | null>(null)

  function nextUniqueName(base: string, prefix: string): string {
    const existing = new Set(items.value.map((i) => i.className))
    const names = uniquifyClassNames([...items.value.map((i) => i.className), `${prefix}-${base}`])
    let candidate = names[names.length - 1] as string
    let n = 2
    while (existing.has(candidate)) {
      candidate = `${prefix}-${base}-${n++}`
    }
    return candidate
  }

  function resolveDuplicateFileName(fileName: string): string {
    const existing = new Set(items.value.map((i) => i.fileName))
    if (!existing.has(fileName)) return fileName
    const dot = fileName.lastIndexOf('.')
    const stem = dot >= 0 ? fileName.slice(0, dot) : fileName
    const ext = dot >= 0 ? fileName.slice(dot) : ''
    let n = 2
    while (existing.has(`${stem} (${n})${ext}`)) n++
    return `${stem} (${n})${ext}`
  }

  async function addFiles(files: FileList | File[]): Promise<void> {
    const list = Array.from(files)
    if (list.length === 0) return
    isLoading.value = true
    try {
      for (const file of list) {
        if (!isSupportedFile(file)) {
          errors.value.unshift({
            fileName: file.name,
            message: `"${file.name}" is not supported. Use PNG, JPG, WEBP or SVG.`,
          })
          continue
        }
        if (file.size === 0) {
          errors.value.unshift({ fileName: file.name, message: `"${file.name}" is empty and was skipped.` })
          continue
        }
        if (file.size > MAX_FILE_SIZE) {
          errors.value.unshift({
            fileName: file.name,
            message: `"${file.name}" exceeds 10 MB and was skipped.`,
          })
          continue
        }
        try {
          const img = await decodeImageFile(file)
          const tooBig = validateImage(img, file.name)
          if (tooBig) {
            errors.value.unshift({ fileName: file.name, message: tooBig })
            continue
          }
          const trim = getTrimBox(img)
          const fileName = resolveDuplicateFileName(file.name)
          const base = sanitizeBaseName(fileName)
          const prefix = currentPrefix()
          const objectUrl = URL.createObjectURL(file)
          items.value.push({
            id: uid(),
            name: base,
            className: nextUniqueName(base, prefix),
            fileName,
            file,
            objectUrl,
            image: img,
            width: img.naturalWidth,
            height: img.naturalHeight,
            trimmedWidth: trim.width,
            trimmedHeight: trim.height,
            trimOffsetX: trim.x,
            trimOffsetY: trim.y,
            x: 0,
            y: 0,
            enabled: true,
            fileSize: file.size,
          })
        } catch {
          errors.value.unshift({
            fileName: file.name,
            message: `Unable to load "${file.name}". The image appears to be corrupted or unsupported.`,
          })
        }
      }
      errors.value = errors.value.slice(0, 5)
    } finally {
      isLoading.value = false
    }
  }

  // Prefix lives in settings; composable reads it lazily via callback to avoid cycles.
  let prefixGetter: () => string = () => 'sprite'
  function currentPrefix(): string {
    return sanitizeBaseName(prefixGetter()) || 'sprite'
  }
  function bindPrefix(getter: () => string): void {
    prefixGetter = getter
  }

  function removeItem(id: string): void {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx >= 0) {
      URL.revokeObjectURL(items.value[idx].objectUrl)
      items.value.splice(idx, 1)
    }
    if (selectedId.value === id) selectedId.value = null
  }

  function clearAll(): void {
    for (const it of items.value) URL.revokeObjectURL(it.objectUrl)
    items.value = []
    selectedId.value = null
  }

  function toggleEnabled(id: string): void {
    const it = items.value.find((i) => i.id === id)
    if (it) it.enabled = !it.enabled
  }

  function renameItem(id: string, newBase: string): void {
    const it = items.value.find((i) => i.id === id)
    if (!it) return
    const clean = sanitizeBaseName(newBase) || it.name
    const prefix = currentPrefix()
    const others = items.value.filter((i) => i.id !== id).map((i) => i.className)
    const merged = uniquifyClassNames([...others, `${prefix}-${clean}`])
    it.name = clean
    it.className = merged[merged.length - 1] as string
  }

  function rebasePrefix(newPrefix: string): void {
    const p = sanitizeBaseName(newPrefix) || 'sprite'
    const merged = uniquifyClassNames(items.value.map((i) => `${p}-${i.name}`))
    items.value.forEach((it, idx) => {
      it.className = merged[idx] as string
    })
  }

  function moveItem(fromIndex: number, toIndex: number): void {
    const arr = items.value
    if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) return
    const [moved] = arr.splice(fromIndex, 1)
    if (moved) arr.splice(toIndex, 0, moved)
  }

  function dismissError(index: number): void {
    errors.value.splice(index, 1)
  }

  return {
    items,
    errors,
    isLoading,
    selectedId,
    addFiles,
    removeItem,
    clearAll,
    toggleEnabled,
    renameItem,
    rebasePrefix,
    moveItem,
    dismissError,
    bindPrefix,
  }
}

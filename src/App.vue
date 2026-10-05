<template>
  <AppHeader :theme="theme" @theme-change="setTheme" />

  <main class="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
    <!-- Hero -->
    <div class="pb-6 pt-8 text-center sm:pt-10">
      <img src="/logo.webp" alt="CSS Spritesheet logo" class="mx-auto mb-4 h-28 w-28 rounded-2xl bg-white object-cover p-2 sm:h-32 sm:w-32" />
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        CSS Spritesheet <span class="text-blue-600 dark:text-blue-400">Generator</span>
      </h1>
      <p class="mx-auto mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
        Combine PNG, JPG, WEBP and SVG images into one optimized spritesheet with production-ready
        CSS, SCSS and JSON — generated entirely in your browser.
      </p>
    </div>

    <!-- Upload -->
    <UploadZone :is-loading="isLoading" @files="onFiles" />
    <input
      ref="addInput"
      type="file"
      accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
      multiple
      class="sr-only"
      aria-label="Add more image files"
      @change="onAddInput"
    />

    <!-- Errors from sheet generation -->
    <div v-if="sheetError" class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300" role="alert">
      {{ sheetError }}
    </div>

    <div v-if="items.length === 0" class="mt-6">
      <EmptyState />
    </div>

    <!-- Main workspace -->
    <div v-else class="mt-6 grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div class="min-w-0 space-y-4">
        <SettingsPanel :settings="settings" @prefix-change="onPrefixChange" />
        <DownloadButtons
          :disabled="enabledCount === 0"
          :image-label="`${fileBase}.${imageExt.toUpperCase()}`"
          :code-label="`${fileBase}.${codeExt}`"
          :sheet-size="sheetSizeLabel"
          @download-image="downloadImage"
          @download-code="downloadCode"
          @download-zip="downloadPackage"
        />
      </div>

      <div class="min-w-0 space-y-4">
        <ImageList
          :items="items"
          :errors="errors"
          :selected-id="selectedId"
          :prefix="settings.classPrefix"
          @remove="removeItem"
          @toggle="onToggle"
          @rename="renameItem"
          @reorder="onReorder"
          @select="selectedId = $event"
          @browse="addInput?.click()"
          @clear="clearAll"
          @dismiss-error="dismissError"
        />
        <SpritePreview
          :sheet="sheet"
          :preview-url="previewUrl"
          :items="items"
          :selected-id="selectedId"
          :pixel-ratio="settings.pixelRatio"
          :prefix="settings.classPrefix"
          @select="selectedId = $event"
        />
        <CodePreview
          v-model="codeLang"
          :code="activeCode"
          :ext="codeExt"
          :copied="copied"
          :selected-css="selectedCss"
          :usage-html="usageHtml"
          @copy="copyActiveCode"
          @download="downloadCode"
        />
      </div>
    </div>

    <!-- Landing / SEO -->
    <section class="mt-12 grid gap-4 md:grid-cols-3" aria-label="About CSS spritesheets">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <Zap class="mb-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 class="text-sm font-bold text-slate-900 dark:text-white">What is a CSS spritesheet?</h2>
        <p class="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Multiple images are merged into one file and shown with
          <code class="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">background-position</code>.
          One request instead of dozens — ideal for icons, game UI and legacy sites.
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <Gauge class="mb-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 class="text-sm font-bold text-slate-900 dark:text-white">Why use it?</h2>
        <ul class="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-500 dark:text-slate-400">
          <li>Fewer HTTP requests, faster first paint</li>
          <li>Retina-ready output with 1x / 2x / 3x scaling</li>
          <li>Packed layout minimizes wasted pixels</li>
          <li>Copy-paste CSS, SCSS, LESS or JSON metadata</li>
        </ul>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <ShieldCheck class="mb-2 h-5 w-5 text-emerald-500" />
        <h2 class="text-sm font-bold text-slate-900 dark:text-white">Private by design</h2>
        <p class="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Decoding, packing, canvas rendering and ZIP export all run locally with the Canvas and File
          APIs. No uploads, no tracking — your assets never leave this tab.
        </p>
      </div>
    </section>

    <section class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" aria-label="Example">
      <h2 class="text-sm font-bold text-slate-900 dark:text-white">Example</h2>
      <div class="mt-2 grid gap-3 md:grid-cols-2">
        <pre class="overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-slate-100"><code>home.png · order.png · shop.png
        ↓  packed + trimmed
spritesheet.png (1 request)</code></pre>
        <pre class="overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-slate-100"><code>.sprite-home {
  width: 32px; height: 32px;
  background-position: 0 0;
}
.sprite-order {
  width: 32px; height: 32px;
  background-position: -34px 0;
}</code></pre>
      </div>
    </section>
  </main>

  <footer class="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
    CSS Spritesheet · local-first developer utility · PNG / JPG / WEBP / SVG → spritesheet + CSS
  </footer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import UploadZone from './components/UploadZone.vue'
import ImageList from './components/ImageList.vue'
import SpritePreview from './components/SpritePreview.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import CodePreview from './components/CodePreview.vue'
import DownloadButtons from './components/DownloadButtons.vue'
import EmptyState from './components/EmptyState.vue'
import { Gauge, ShieldCheck, Zap } from 'lucide-vue-next'
import type { CodeLanguage, ThemeMode } from './types/sprite'
import { useSprites } from './composables/useSprites'
import {
  applyTheme,
  loadSettings,
  loadTheme,
  persistSettings,
  saveTheme,
  useSpriteGenerator,
  DEFAULT_SETTINGS,
} from './composables/useSpriteGenerator'
import { useClipboard } from './composables/useClipboard'
import { buildEntries, generateCSS, generateJSON, generateLESS, generateSCSS } from './services/codeGenerator'
import { sanitizeFileBaseName } from './utils/filenameUtils'
import { canvasToBlob, downloadBlob, downloadText, downloadZip } from './utils/downloadUtils'

const {
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
} = useSprites()

const settings = reactive(loadSettings())
bindPrefix(() => settings.classPrefix)

const { sheet, error: sheetError, previewUrl, regenerate, enabledCount, sheetWidth, sheetHeight } =
  useSpriteGenerator(() => items.value, settings)

const theme = ref<ThemeMode>(loadTheme())
const codeLang = ref<CodeLanguage>('css')
const addInput = ref<HTMLInputElement | null>(null)
const { copied, copy } = useClipboard()

function setTheme(t: ThemeMode): void {
  theme.value = t
  saveTheme(t)
  applyTheme(t)
}

onMounted(() => {
  applyTheme(theme.value)
  regenerate()
})

// Persist settings (debounced by watcher flush).
watch(
  settings,
  () => persistSettings({ ...settings }),
  { deep: true },
)

async function onFiles(files: File[]): Promise<void> {
  await addFiles(files)
  regenerate()
}

async function onAddInput(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  if (files.length > 0) await onFiles(files)
}

function onToggle(id: string): void {
  toggleEnabled(id)
  regenerate()
}

function onReorder(from: number, to: number): void {
  moveItem(from, to)
  regenerate()
}

function onPrefixChange(): void {
  rebasePrefix(settings.classPrefix)
  regenerate()
}

// Ensure class names follow prefix edits typed directly (v-model mutates settings).
watch(
  () => settings.classPrefix,
  () => rebasePrefix(settings.classPrefix),
)

const fileBase = computed(() => sanitizeFileBaseName(settings.fileBaseName) || DEFAULT_SETTINGS.fileBaseName)
const imageExt = computed(() => (settings.outputFormat === 'jpeg' ? 'jpg' : settings.outputFormat))
const codeExt = computed(() => (codeLang.value === 'json' ? 'json' : codeLang.value === 'scss' ? 'scss' : codeLang.value === 'less' ? 'less' : 'css'))

const entries = computed(() => {
  if (!sheet.value) return []
  return buildEntries(items.value, sheet.value.positions, settings)
})

const cssCode = computed(() =>
  entries.value.length && sheet.value
    ? generateCSS(entries.value, settings, sheet.value.size.width, sheet.value.size.height)
    : '',
)
const scssCode = computed(() =>
  entries.value.length && sheet.value
    ? generateSCSS(entries.value, settings, sheet.value.size.width, sheet.value.size.height)
    : '',
)
const lessCode = computed(() =>
  entries.value.length && sheet.value
    ? generateLESS(entries.value, settings, sheet.value.size.width, sheet.value.size.height)
    : '',
)
const jsonCode = computed(() =>
  entries.value.length && sheet.value
    ? generateJSON(entries.value, settings, sheet.value.size.width, sheet.value.size.height)
    : '',
)

const activeCode = computed(() => {
  switch (codeLang.value) {
    case 'scss': return scssCode.value
    case 'less': return lessCode.value
    case 'json': return jsonCode.value
    default: return cssCode.value
  }
})

const selectedEntry = computed(() => entries.value.find((e) => e.id === selectedId.value) ?? null)
const selectedCss = computed(() => {
  const e = selectedEntry.value
  if (!e) return null
  const px = e.x === 0 ? '0' : `-${e.x}px`
  const py = e.y === 0 ? '0' : `-${e.y}px`
  return `.${e.cssClass} { width: ${e.width}px; height: ${e.height}px; background-position: ${px} ${py}; }`
})
const usageHtml = computed(() => {
  const e = selectedEntry.value
  if (!e) return null
  return `<span class="sprite ${e.cssClass}"></span>`
})

const sheetSizeLabel = computed(() =>
  sheet.value ? `${sheetWidth.value}×${sheetHeight.value}px` : null,
)

async function copyActiveCode(): Promise<void> {
  if (activeCode.value) await copy(activeCode.value)
}

function downloadCode(): void {
  if (!activeCode.value) return
  const mime = codeLang.value === 'json' ? 'application/json' : 'text/css'
  downloadText(activeCode.value, `${fileBase.value}.${codeExt.value}`, mime)
}

/** Export canvas in the configured format; JPEG gets flattened onto opaque bg. */
async function exportImageBlob(): Promise<{ blob: Blob; ext: string } | null> {
  if (!sheet.value) return null
  const canvas = sheet.value.canvas
  if (settings.outputFormat === 'png') {
    return { blob: await canvasToBlob(canvas, 'image/png'), ext: 'png' }
  }
  if (settings.outputFormat === 'webp') {
    return { blob: await canvasToBlob(canvas, 'image/webp', settings.quality / 100), ext: 'webp' }
  }
  // jpeg: composite over white/black/custom or white when transparent
  const flat = document.createElement('canvas')
  flat.width = canvas.width
  flat.height = canvas.height
  const ctx = flat.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle =
    settings.background === 'black' ? '#000000' : settings.background === 'custom' ? settings.backgroundColor : '#ffffff'
  ctx.fillRect(0, 0, flat.width, flat.height)
  ctx.drawImage(canvas, 0, 0)
  return { blob: await canvasToBlob(flat, 'image/jpeg', settings.quality / 100), ext: 'jpg' }
}

async function downloadImage(): Promise<void> {
  const out = await exportImageBlob()
  if (out) downloadBlob(out.blob, `${fileBase.value}.${out.ext}`)
}

async function downloadPackage(): Promise<void> {
  if (!sheet.value || !activeCode.value) return
  const out = await exportImageBlob()
  if (!out) return
  const css = cssCode.value || generateCSS(entries.value, settings, sheet.value.size.width, sheet.value.size.height)
  const json = jsonCode.value || generateJSON(entries.value, settings, sheet.value.size.width, sheet.value.size.height)
  await downloadZip(
    {
      [`${fileBase.value}.${out.ext}`]: out.blob,
      [`${fileBase.value}.css`]: css,
      [`${fileBase.value}.json`]: json,
    },
    `${fileBase.value}.zip`,
  )
}
</script>

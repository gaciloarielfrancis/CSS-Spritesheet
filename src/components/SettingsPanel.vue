<template>
  <section aria-label="Spritesheet settings" class="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
      <Settings2 class="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <h2 class="text-sm font-bold text-slate-900 dark:text-white">Settings</h2>
    </div>

    <div class="space-y-5 p-4 text-sm">
      <!-- Layout -->
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Layout</p>
        <div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Spritesheet layout">
          <button
            v-for="opt in layoutOptions"
            :key="opt.value"
            type="button"
            role="radio"
            :aria-checked="settings.layout === opt.value"
            class="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-semibold transition"
            :class="settings.layout === opt.value
              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200'
              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="settings.layout = opt.value"
          >
            <component :is="opt.icon" class="h-4 w-4 shrink-0" />
            {{ opt.label }}
          </button>
        </div>
        <label v-if="settings.layout === 'grid'" class="mt-2.5 block">
          <span class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Columns: {{ settings.columns }}</span>
          <input
            v-model.number="settings.columns"
            type="range" min="1" max="12" step="1"
            class="w-full accent-blue-600"
            aria-label="Grid columns"
          />
        </label>
      </div>

      <!-- Spacing -->
      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Padding (px)</span>
          <input
            v-model.number="settings.padding"
            type="number" min="0" max="64" step="1"
            class="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm tabular-nums outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Gap (px)</span>
          <input
            v-model.number="settings.gap"
            type="number" min="0" max="64" step="1"
            class="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm tabular-nums outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>
      </div>
      <div class="flex flex-wrap gap-1.5" aria-label="Quick padding presets">
        <button
          v-for="p in [0, 1, 2, 4, 8, 16, 32]"
          :key="p"
          type="button"
          class="rounded-md px-2 py-1 font-mono text-[11px] transition"
          :class="settings.padding === p
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
          @click="settings.padding = p"
        >{{ p }}</button>
      </div>

      <!-- Background -->
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Background</p>
        <div class="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Sheet background">
          <button
            v-for="opt in bgOptions"
            :key="opt.value"
            type="button"
            role="radio"
            :aria-checked="settings.background === opt.value"
            class="rounded-lg border px-2 py-1.5 text-xs font-semibold transition"
            :class="settings.background === opt.value
              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="settings.background = opt.value"
          >{{ opt.label }}</button>
        </div>
        <label v-if="settings.background === 'custom'" class="mt-2 flex items-center gap-2">
          <input v-model="settings.backgroundColor" type="color" class="h-8 w-10 cursor-pointer rounded border border-slate-200 dark:border-slate-700" aria-label="Custom background color" />
          <input
            v-model="settings.backgroundColor"
            type="text"
            spellcheck="false"
            class="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            aria-label="Custom background hex"
          />
        </label>
      </div>

      <!-- Pixel ratio -->
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pixel ratio</p>
        <div class="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Pixel ratio">
          <button
            v-for="r in [1, 2, 3]"
            :key="r"
            type="button"
            role="radio"
            :aria-checked="settings.pixelRatio === r"
            class="rounded-lg border px-2 py-1.5 text-xs font-semibold tabular-nums transition"
            :class="settings.pixelRatio === r
              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="settings.pixelRatio = r as 1 | 2 | 3"
          >{{ r }}x{{ r === 2 ? ' retina' : '' }}</button>
        </div>
      </div>

      <!-- Trim -->
      <label class="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 p-2.5 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60">
        <input v-model="settings.trimTransparent" type="checkbox" class="mt-0.5 h-4 w-4 accent-blue-600" />
        <span>
          <span class="block text-xs font-bold text-slate-800 dark:text-slate-100">Trim transparent pixels</span>
          <span class="block text-[11px] leading-snug text-slate-500 dark:text-slate-400">Remove empty borders to shrink the sheet. CSS keeps full logical size.</span>
        </span>
      </label>

      <!-- Naming -->
      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Class prefix</span>
          <input
            v-model="prefixModel"
            type="text"
            spellcheck="false"
            placeholder="sprite"
            class="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">File name</span>
          <input
            v-model="fileModel"
            type="text"
            spellcheck="false"
            placeholder="spritesheet"
            class="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>
      </div>

      <!-- Export -->
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Export format</p>
        <div class="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Export format">
          <button
            v-for="opt in formatOptions"
            :key="opt.value"
            type="button"
            role="radio"
            :aria-checked="settings.outputFormat === opt.value"
            class="rounded-lg border px-2 py-1.5 text-xs font-bold uppercase transition"
            :class="settings.outputFormat === opt.value
              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="settings.outputFormat = opt.value"
          >{{ opt.label }}</button>
        </div>
        <label v-if="settings.outputFormat !== 'png'" class="mt-2.5 block">
          <span class="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Quality: {{ settings.quality }}%</span>
          <input v-model.number="settings.quality" type="range" min="1" max="100" step="1" class="w-full accent-blue-600" aria-label="Export quality" />
        </label>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown, ArrowRight, Grid3x3, Package, Settings2 } from 'lucide-vue-next'
import type { OutputFormat, SpriteBackground, SpriteLayout, SpriteSettings } from '../types/sprite'
import { sanitizeFileBaseName, sanitizePrefix } from '../utils/filenameUtils'

const props = defineProps<{ settings: SpriteSettings }>()
const emit = defineEmits<{ (e: 'prefix-change', v: string): void }>()

const layoutOptions: { value: SpriteLayout; label: string; icon: unknown }[] = [
  { value: 'horizontal', label: 'Horizontal', icon: ArrowRight },
  { value: 'vertical', label: 'Vertical', icon: ArrowDown },
  { value: 'grid', label: 'Grid', icon: Grid3x3 },
  { value: 'packed', label: 'Packed', icon: Package },
]
const bgOptions: { value: SpriteBackground; label: string }[] = [
  { value: 'transparent', label: 'Alpha' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'custom', label: 'Custom' },
]
const formatOptions: { value: OutputFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'jpeg', label: 'JPEG' },
]

const prefixModel = computed({
  get: () => props.settings.classPrefix,
  set: (v: string) => {
    props.settings.classPrefix = sanitizePrefix(v)
    emit('prefix-change', props.settings.classPrefix)
  },
})
const fileModel = computed({
  get: () => props.settings.fileBaseName,
  set: (v: string) => {
    props.settings.fileBaseName = sanitizeFileBaseName(v)
  },
})
</script>

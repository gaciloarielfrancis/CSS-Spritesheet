<template>
  <section aria-label="Sprite preview" class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
      <ScanEye class="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <h2 class="text-sm font-bold text-slate-900 dark:text-white">Sprite Preview</h2>
      <span v-if="sheet" class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {{ logicalW }} × {{ logicalH }}px{{ pixelRatio > 1 ? ` @${pixelRatio}x` : '' }}
      </span>
      <div class="ml-auto flex items-center gap-1">
        <button
          type="button" aria-label="Zoom out" title="Zoom out"
          class="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          @click="zoomOut"
        ><ZoomOut class="h-4 w-4" /></button>
        <button
          type="button"
          :aria-label="`Zoom ${Math.round(zoom * 100)} percent. Click to reset.`"
          class="min-w-14 rounded-lg px-2 py-1 font-mono text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="zoom = 1"
        >{{ Math.round(zoom * 100) }}%</button>
        <button
          type="button" aria-label="Zoom in" title="Zoom in"
          class="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          @click="zoomIn"
        ><ZoomIn class="h-4 w-4" /></button>
        <button
          type="button" aria-label="Fit preview to panel" title="Fit"
          class="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          @click="fitToPanel"
        ><Maximize class="h-4 w-4" /></button>
        <label class="ml-1 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <input v-model="showGrid" type="checkbox" class="h-3.5 w-3.5 accent-blue-600" /> Grid
        </label>
      </div>
    </div>

    <div v-if="!sheet || !previewUrl" class="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
      Add and enable at least one image to see the spritesheet.
    </div>

    <div v-else>
      <div ref="scrollBox" class="nice-scroll checkerboard max-h-[520px] overflow-auto p-4">
        <div class="inline-block" :style="{ width: displayW + 'px', height: displayH + 'px' }">
          <div class="relative" :style="{ width: displayW + 'px', height: displayH + 'px' }">
            <img
              :src="previewUrl"
              alt="Generated spritesheet"
              class="absolute left-0 top-0 max-w-none"
              :style="{ width: displayW + 'px', height: displayH + 'px' }"
              draggable="false"
            />
            <template v-for="sp in enabledSprites" :key="sp.id">
              <button
                type="button"
                :aria-label="`Select sprite ${sp.name} at ${sp.x}, ${sp.y}, ${sp.width} by ${sp.height}`"
                class="group absolute border transition-colors"
                :class="selectedId === sp.id
                  ? 'z-10 border-blue-500 bg-blue-500/15'
                  : 'border-cyan-400/70 hover:border-yellow-400 hover:bg-yellow-300/15'"
                :style="boxStyle(sp)"
                @click="$emit('select', sp.id)"
                @mouseenter="hoverId = sp.id"
                @mouseleave="hoverId = null"
                @focus="hoverId = sp.id"
                @blur="hoverId = null"
              >
                <span
                  v-if="showGrid"
                  class="pointer-events-none absolute left-0.5 top-0.5 max-w-full truncate rounded bg-black/65 px-1 font-mono text-[10px] leading-4 text-white"
                >{{ sp.name }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 px-4 py-2.5 text-xs dark:border-slate-800" aria-live="polite">
        <p v-if="activeSprite" class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-slate-600 dark:text-slate-300">
          <span class="font-bold text-slate-900 dark:text-white">.{{ activeClass }}</span>
          <span>x: {{ activeSprite.x }}</span>
          <span>y: {{ activeSprite.y }}</span>
          <span>{{ activeSprite.width }} × {{ activeSprite.height }}</span>
          <span class="text-slate-400">pos: {{ activePos }}</span>
        </p>
        <p v-else-if="hoverSprite" class="font-mono text-slate-600 dark:text-slate-300">
          {{ hoverSprite.name }} — x: {{ hoverSprite.x }} y: {{ hoverSprite.y }} · {{ hoverSprite.width }}×{{ hoverSprite.height }}
        </p>
        <p v-else class="text-slate-400 dark:text-slate-500">Hover or click a sprite to inspect coordinates. Click again in the list to rename.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Maximize, ScanEye, ZoomIn, ZoomOut } from 'lucide-vue-next'
import type { GeneratedSheet } from '../services/spriteGenerator'
import type { SpriteItem } from '../types/sprite'
import { sanitizePrefix } from '../utils/filenameUtils'

const props = defineProps<{
  sheet: GeneratedSheet | null
  previewUrl: string | null
  items: SpriteItem[]
  selectedId: string | null
  pixelRatio: number
  prefix: string
}>()
defineEmits<{ (e: 'select', id: string): void }>()

const zoom = ref(1)
const showGrid = ref(true)
const hoverId = ref<string | null>(null)
const scrollBox = ref<HTMLDivElement | null>(null)

const logicalW = computed(() => (props.sheet ? Math.round(props.sheet.size.width / props.pixelRatio) : 0))
const logicalH = computed(() => (props.sheet ? Math.round(props.sheet.size.height / props.pixelRatio) : 0))
const displayW = computed(() => Math.max(1, Math.round(logicalW.value * zoom.value)))
const displayH = computed(() => Math.max(1, Math.round(logicalH.value * zoom.value)))

const enabledSprites = computed(() => props.items.filter((i) => i.enabled))
const activeSprite = computed(() => enabledSprites.value.find((s) => s.id === props.selectedId) ?? null)
const hoverSprite = computed(() => enabledSprites.value.find((s) => s.id === hoverId.value) ?? null)
const activeClass = computed(() =>
  activeSprite.value ? `${sanitizePrefix(props.prefix)}-${activeSprite.value.name}` : '',
)
const activePos = computed(() =>
  activeSprite.value
    ? `${activeSprite.value.x === 0 ? '0' : `-${activeSprite.value.x}px`} ${activeSprite.value.y === 0 ? '0' : `-${activeSprite.value.y}px`}`
    : '',
)

function boxStyle(sp: SpriteItem): Record<string, string> {
  const sx = displayW.value / Math.max(1, logicalW.value)
  return {
    left: `${sp.x * sx}px`,
    top: `${sp.y * sx}px`,
    width: `${Math.max(2, sp.width * sx)}px`,
    height: `${Math.max(2, sp.height * sx)}px`,
  }
}

function zoomIn(): void {
  zoom.value = Math.min(4, +(zoom.value + 0.25).toFixed(2))
}
function zoomOut(): void {
  zoom.value = Math.max(0.1, +(zoom.value - 0.25).toFixed(2))
}
function fitToPanel(): void {
  const box = scrollBox.value
  if (!box || logicalW.value === 0) return
  const avail = box.clientWidth - 32
  zoom.value = Math.min(4, Math.max(0.1, +(avail / logicalW.value).toFixed(2)))
}
</script>

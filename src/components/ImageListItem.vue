<template>
  <li
    :draggable="true"
    :aria-label="`Sprite ${item.fileName}`"
    class="group flex items-center gap-3 rounded-xl border p-2.5 transition"
    :class="[
      isSelected
        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600',
      !item.enabled && 'opacity-55',
    ]"
    @dragstart="onDragStart"
    @dragover.prevent
    @drop="onDrop"
    @dragend="onDragEnd"
  >
    <span
      class="cursor-grab touch-none text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-300"
      title="Drag to reorder"
      aria-hidden="true"
    >
      <GripVertical class="h-4 w-4" />
    </span>

    <img
      :src="item.objectUrl"
      :alt="item.fileName"
      class="checkerboard h-11 w-11 shrink-0 rounded-lg object-contain ring-1 ring-slate-200 dark:ring-slate-700"
      draggable="false"
    />

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100" :title="item.fileName">
        {{ item.fileName }}
      </p>
      <p class="text-xs tabular-nums text-slate-500 dark:text-slate-400">
        {{ item.width }} × {{ item.height }} • {{ formatBytes(item.fileSize) }}
      </p>
      <div class="mt-1 flex min-w-0 items-center gap-1.5">
        <span class="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          .{{ fullClass }}
        </span>
        <input
          :value="item.name"
          aria-label="Edit sprite name"
          spellcheck="false"
          class="min-w-0 flex-1 truncate rounded border border-transparent bg-transparent px-1 font-mono text-[11px] text-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:text-slate-700 dark:focus:bg-slate-800 dark:focus:text-slate-200"
          @change="onRename(($event.target as HTMLInputElement).value)"
          @click.stop
        />
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <button
        type="button"
        :aria-label="item.enabled ? `Disable ${item.fileName}` : `Enable ${item.fileName}`"
        :title="item.enabled ? 'Exclude from sheet' : 'Include in sheet'"
        class="rounded-lg p-1.5 transition"
        :class="item.enabled
          ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'"
        @click="$emit('toggle', item.id)"
      >
        <component :is="item.enabled ? Eye : EyeOff" class="h-4 w-4" />
      </button>
      <button
        type="button"
        :aria-label="`Remove ${item.fileName}`"
        title="Remove"
        class="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
        @click="$emit('remove', item.id)"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Eye, EyeOff, GripVertical, X } from 'lucide-vue-next'
import type { SpriteItem } from '../types/sprite'
import { formatBytes } from '../utils/imageUtils'
import { sanitizePrefix } from '../utils/filenameUtils'

const props = defineProps<{
  item: SpriteItem
  index: number
  isSelected: boolean
  prefix: string
}>()
const emit = defineEmits<{
  (e: 'remove', id: string): void
  (e: 'toggle', id: string): void
  (e: 'rename', id: string, name: string): void
  (e: 'reorder', from: number, to: number): void
  (e: 'select', id: string): void
}>()

const fullClass = computed(() => `${sanitizePrefix(props.prefix)}-${props.item.name}`)

function onRename(v: string): void {
  emit('rename', props.item.id, v)
}

function onDragStart(e: DragEvent): void {
  e.dataTransfer?.setData('text/sprite-index', String(props.index))
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
  emit('select', props.item.id)
}

function onDrop(e: DragEvent): void {
  e.preventDefault()
  const raw = e.dataTransfer?.getData('text/sprite-index')
  if (raw === undefined || raw === '') return
  const from = Number(raw)
  if (Number.isFinite(from) && from !== props.index) emit('reorder', from, props.index)
}

function onDragEnd(): void {
  // noop — kept for future drag ghost cleanup
}
</script>

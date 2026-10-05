<template>
  <section aria-label="Uploaded images" class="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
      <Images class="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <h2 class="text-sm font-bold text-slate-900 dark:text-white">
        Uploaded Images
        <span class="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ enabledCount }}/{{ items.length }}
        </span>
      </h2>
      <div class="ml-auto flex gap-1.5">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="$emit('browse')"
        >
          <Plus class="h-3.5 w-3.5" /> Add
        </button>
        <button
          v-if="items.length > 0"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
          @click="$emit('clear')"
        >
          <Trash2 class="h-3.5 w-3.5" /> Clear
        </button>
      </div>
    </div>

    <div v-if="errors.length > 0" class="space-y-2 px-4 pt-3" role="alert">
      <div
        v-for="(err, i) in errors"
        :key="`${err.fileName}-${i}`"
        class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
      >
        <TriangleAlert class="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p class="flex-1">{{ err.message }}</p>
        <button type="button" :aria-label="`Dismiss error for ${err.fileName}`" class="hover:opacity-70" @click="$emit('dismiss-error', i)">
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <ul v-if="items.length > 0" class="nice-scroll grid max-h-[420px] gap-2 overflow-y-auto p-4 sm:grid-cols-2">
      <ImageListItem
        v-for="(item, idx) in items"
        :key="item.id"
        :item="item"
        :index="idx"
        :prefix="prefix"
        :is-selected="selectedId === item.id"
        @remove="$emit('remove', $event)"
        @toggle="$emit('toggle', $event)"
        @rename="(id, name) => $emit('rename', id, name)"
        @reorder="(from, to) => $emit('reorder', from, to)"
        @select="$emit('select', $event)"
      />
    </ul>
    <p v-else class="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
      No images yet — add some above to start building your sheet.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Images, Plus, Trash2, TriangleAlert, X } from 'lucide-vue-next'
import type { SpriteItem } from '../types/sprite'
import type { UploadError } from '../composables/useSprites'
import ImageListItem from './ImageListItem.vue'

const props = defineProps<{
  items: SpriteItem[]
  errors: UploadError[]
  selectedId: string | null
  prefix: string
}>()
defineEmits<{
  (e: 'remove', id: string): void
  (e: 'toggle', id: string): void
  (e: 'rename', id: string, name: string): void
  (e: 'reorder', from: number, to: number): void
  (e: 'select', id: string): void
  (e: 'browse'): void
  (e: 'clear'): void
  (e: 'dismiss-error', index: number): void
}>()

const enabledCount = computed(() => props.items.filter((i) => i.enabled).length)
</script>

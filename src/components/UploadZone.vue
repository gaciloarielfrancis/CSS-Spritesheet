<template>
  <div
    role="button"
    tabindex="0"
    :aria-label="'Upload images. Drag and drop or press Enter to browse.'"
    class="group relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 sm:p-12"
    :class="isDragging
      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40 scale-[1.01]'
      : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-blue-950/20'"
    @drop="handleDrop"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @click="triggerBrowse"
    @keydown.enter="triggerBrowse"
    @keydown.space.prevent="triggerBrowse"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
      multiple
      class="sr-only"
      aria-label="Choose image files"
      @change="handleInput"
    />
    <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
      <ImagePlus class="h-7 w-7" />
    </div>
    <p class="text-lg font-semibold text-slate-900 dark:text-white">
      {{ isDragging ? 'Drop images to add them' : 'Drag & drop images here' }}
    </p>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Drop PNG, JPG, WEBP, SVG files — or browse your device</p>
    <span
      class="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <Upload class="h-4 w-4" /> Browse Files
    </span>
    <p class="mt-4 text-[11px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
      PNG • JPG • WEBP • SVG — stays in your browser
    </p>
    <p v-if="isLoading" class="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">Decoding images…</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ImagePlus, Upload } from 'lucide-vue-next'
import { useFileUpload } from '../composables/useFileUpload'

const props = defineProps<{ isLoading: boolean }>()
const emit = defineEmits<{ (e: 'files', files: File[]): void }>()

const fileInput = ref<HTMLInputElement | null>(null)
const { isDragging, handleDrop, handleDragEnter, handleDragLeave, handleDragOver, handleInput } =
  useFileUpload((files) => emit('files', files))

function triggerBrowse(): void {
  fileInput.value?.click()
}
void props
</script>

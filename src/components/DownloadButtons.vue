<template>
  <section aria-label="Downloads" class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <div class="mb-3 flex items-center gap-2">
      <Package class="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <h2 class="text-sm font-bold text-slate-900 dark:text-white">Export</h2>
      <span v-if="sheetSize" class="text-xs tabular-nums text-slate-400">{{ sheetSize }}</span>
    </div>
    <div class="grid gap-2 sm:grid-cols-3">
      <button
        type="button"
        :disabled="disabled"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        @click="$emit('download-image')"
      >
        <ImageDown class="h-4 w-4" /> {{ imageLabel }}
      </button>
      <button
        type="button"
        :disabled="disabled"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        @click="$emit('download-code')"
      >
        <FileDown class="h-4 w-4" /> {{ codeLabel }}
      </button>
      <button
        type="button"
        :disabled="disabled"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
        @click="$emit('download-zip')"
      >
        <Archive class="h-4 w-4" /> .zip Package
      </button>
    </div>
    <p class="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
      <ShieldCheck class="h-3.5 w-3.5 text-emerald-500" />
      Your images never leave your browser. All generation happens locally.
    </p>
  </section>
</template>

<script setup lang="ts">
import { Archive, FileDown, ImageDown, Package, ShieldCheck } from 'lucide-vue-next'

defineProps<{
  disabled: boolean
  imageLabel: string
  codeLabel: string
  sheetSize: string | null
}>()
defineEmits<{
  (e: 'download-image'): void
  (e: 'download-code'): void
  (e: 'download-zip'): void
}>()
</script>

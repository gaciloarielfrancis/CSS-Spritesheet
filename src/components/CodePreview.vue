<template>
  <section aria-label="Generated code" class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
      <FileCode2 class="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <h2 class="text-sm font-bold text-slate-900 dark:text-white">Generated Code</h2>
      <div class="ml-2 flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800" role="tablist" aria-label="Code language">
        <button
          v-for="lang in languages"
          :key="lang"
          type="button"
          role="tab"
          :aria-selected="modelValue === lang"
          class="rounded-md px-2.5 py-1 font-mono text-xs font-bold uppercase transition"
          :class="modelValue === lang
            ? 'bg-white text-blue-700 shadow dark:bg-slate-700 dark:text-blue-200'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
          @click="$emit('update:modelValue', lang)"
        >{{ lang }}</button>
      </div>
      <div class="ml-auto flex gap-1.5">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          :disabled="!code"
          @click="$emit('copy')"
        >
          <component :is="copied ? Check : Copy" class="h-3.5 w-3.5" />
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
          :disabled="!code"
          @click="$emit('download')"
        >
          <Download class="h-3.5 w-3.5" /> .{{ ext }}
        </button>
      </div>
    </div>

    <div v-if="selectedCss" class="border-b border-blue-100 bg-blue-50/60 px-4 py-2.5 dark:border-blue-900/40 dark:bg-blue-950/30">
      <p class="font-mono text-[11px] leading-relaxed text-blue-900 dark:text-blue-200">{{ selectedCss }}</p>
    </div>

    <pre
      v-if="code"
      class="nice-scroll max-h-[380px] overflow-auto bg-slate-950 p-4 font-mono text-[12px] leading-relaxed text-slate-100 dark:bg-black/60"
      tabindex="0"
      :aria-label="`Generated ${modelValue} code`"
    ><code>{{ code }}</code></pre>
    <p v-else class="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
      Code will appear here once sprites are added.
    </p>

    <div v-if="usageHtml" class="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
      <p class="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Usage</p>
      <code class="block overflow-x-auto rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ usageHtml }}</code>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check, Copy, Download, FileCode2 } from 'lucide-vue-next'
import type { CodeLanguage } from '../types/sprite'

defineProps<{
  modelValue: CodeLanguage
  code: string
  ext: string
  copied: boolean
  selectedCss: string | null
  usageHtml: string | null
}>()
defineEmits<{
  (e: 'update:modelValue', v: CodeLanguage): void
  (e: 'copy'): void
  (e: 'download'): void
}>()

const languages: CodeLanguage[] = ['css', 'scss', 'less', 'json']
</script>

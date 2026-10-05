<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
      <div class="leading-tight">
        <p class="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
          CSS <span class="text-blue-600 dark:text-blue-400">Spritesheet</span>
        </p>
        <p class="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">Combine images into one optimized sprite</p>
      </div>

      <div class="ml-auto flex items-center gap-1.5">
        <div
          class="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-900"
          role="group"
          aria-label="Theme"
        >
          <button
            v-for="opt in themeOptions"
            :key="opt.value"
            type="button"
            :title="opt.label"
            :aria-label="`Switch to ${opt.label} theme`"
            :aria-pressed="theme === opt.value"
            class="rounded-md p-1.5 transition"
            :class="theme === opt.value
              ? 'bg-white text-blue-600 shadow dark:bg-slate-700 dark:text-blue-300'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
            @click="$emit('theme-change', opt.value)"
          >
            <component :is="opt.icon" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import type { ThemeMode } from '../types/sprite'

defineProps<{ theme: ThemeMode }>()
defineEmits<{ (e: 'theme-change', v: ThemeMode): void }>()

const themeOptions = [
  { value: 'light' as ThemeMode, label: 'Light', icon: Sun },
  { value: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
  { value: 'system' as ThemeMode, label: 'System', icon: Monitor },
]
</script>

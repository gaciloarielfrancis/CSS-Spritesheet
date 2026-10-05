import { ref } from 'vue'

export function useClipboard(timeout = 1600) {
  const copied = ref(false)
  let timer: number | undefined

  async function copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      copied.value = true
      window.clearTimeout(timer)
      timer = window.setTimeout(() => (copied.value = false), timeout)
      return true
    } catch {
      return false
    }
  }

  return { copied, copy }
}

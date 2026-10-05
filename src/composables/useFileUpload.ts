import { ref } from 'vue'

export function useFileUpload(onFiles: (files: File[]) => void) {
  const isDragging = ref(false)
  let dragDepth = 0

  function handleDrop(e: DragEvent): void {
    e.preventDefault()
    dragDepth = 0
    isDragging.value = false
    const files = Array.from(e.dataTransfer?.files ?? [])
    if (files.length > 0) onFiles(files)
  }

  function handleDragEnter(e: DragEvent): void {
    e.preventDefault()
    dragDepth++
    isDragging.value = true
  }

  function handleDragLeave(e: DragEvent): void {
    e.preventDefault()
    dragDepth = Math.max(0, dragDepth - 1)
    if (dragDepth === 0) isDragging.value = false
  }

  function handleDragOver(e: DragEvent): void {
    e.preventDefault()
  }

  function handleInput(e: Event): void {
    const input = e.target as HTMLInputElement
    const files = Array.from(input.files ?? [])
    if (files.length > 0) onFiles(files)
    input.value = ''
  }

  return { isDragging, handleDrop, handleDragEnter, handleDragLeave, handleDragOver, handleInput }
}

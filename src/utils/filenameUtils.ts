/** Convert an arbitrary filename into a valid CSS class fragment. */
export function sanitizeBaseName(raw: string): string {
  const withoutExt = raw.replace(/\.[^.]+$/, '')
  const normalized = withoutExt
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
  const cleaned = normalized || 'sprite'
  // CSS identifiers may not start with a digit (unless escaped); prefix it.
  return /^[0-9]/.test(cleaned) ? `s-${cleaned}` : cleaned
}

export function fileNameToClassName(fileName: string, prefix = 'sprite'): string {
  const base = sanitizeBaseName(fileName)
  const safePrefix = sanitizeBaseName(prefix) || 'sprite'
  return `${safePrefix}-${base}`
}

export function sanitizePrefix(raw: string): string {
  const cleaned = sanitizeBaseName(raw || 'sprite')
  return cleaned || 'sprite'
}

export function sanitizeFileBaseName(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned || 'spritesheet'
}

/** Ensure class names are unique by appending -2, -3, ... */
export function uniquifyClassNames(names: string[]): string[] {
  const seen = new Map<string, number>()
  return names.map((n) => {
    const count = seen.get(n) ?? 0
    seen.set(n, count + 1)
    if (count === 0) return n
    return `${n}-${count + 1}`
  })
}

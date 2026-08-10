export function readingTime(content?: string): string {
  if (!content) return ''
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min de lectura`
}

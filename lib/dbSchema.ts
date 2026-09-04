import { supabaseAdmin } from './supabase'

let hasVisibleColumnCache: boolean | null = null

// Detecta (una sola vez, con caché) si la tabla sections tiene la columna
// is_visible. Si no existe, las escrituras la omiten para no fallar.
export async function supabaseHasVisibleColumn(): Promise<boolean> {
  if (hasVisibleColumnCache !== null) return hasVisibleColumnCache
  if (!supabaseAdmin) return false

  const { error } = await supabaseAdmin.from('sections').select('is_visible').limit(1)
  if (!error) {
    hasVisibleColumnCache = true
    return true
  }
  const msg = (error.message || '').toLowerCase()
  const missing =
    error.code === '42703' || // PostgreSQL undefined_column
    msg.includes('does not exist') ||
    msg.includes('could not find')
  hasVisibleColumnCache = !missing
  return !missing
}
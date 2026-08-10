'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  Settings,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import {
  defaultSection,
  defaultSections,
  newId,
  type Section,
  type SectionIcon,
  type SectionItem,
  type SectionType,
} from '@/lib/sections'
import SectionCarouselCard from '@/components/SectionCarouselCard'
import SectionBookCard from '@/components/SectionBookCard'
import ItemEditor from '@/components/ItemEditor'

type Status = 'loading' | 'login' | 'ready'
type Toast = { type: 'ok' | 'error'; text: string } | null

const ICON_OPTIONS: { value: SectionIcon; label: string }[] = [
  { value: 'briefcase', label: 'Maletín (consultorías)' },
  { value: 'search', label: 'Lupa (búsqueda)' },
  { value: 'book-open', label: 'Libro abierto' },
  { value: 'pen-tool', label: 'Pluma' },
]

export default function AdminPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<Toast>(null)

  const notify = useCallback((type: 'ok' | 'error', text: string) => {
    setToast({ type, text })
    window.setTimeout(() => setToast(null), 4000)
  }, [])

  const loadSections = useCallback(async () => {
    try {
      const res = await fetch('/api/sections')
      const data = await res.json()
      if (Array.isArray(data.sections)) {
        setSections(data.sections)
        setDirtyIds(new Set())
      } else {
        notify('error', data.error || 'No se pudieron cargar las secciones')
      }
    } catch {
      notify('error', 'Error de conexión al cargar las secciones')
    }
  }, [notify])

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.authenticated) {
          setStatus('ready')
          await loadSections()
        } else {
          setStatus('login')
        }
      } catch {
        setStatus('login')
      }
    }
    check()
  }, [loadSections])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setPassword('')
        setStatus('ready')
        await loadSections()
      } else {
        const data = await res.json().catch(() => ({}))
        notify('error', data.error || 'Contraseña incorrecta')
      }
    } catch {
      notify('error', 'Error de conexión al iniciar sesión')
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setStatus('login')
    setSections([])
  }

  const markDirty = (id: string) => {
    setDirtyIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const patchSection = (id: string, patch: Partial<Section>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
    markDirty(id)
  }

  const patchItem = (sectionId: string, itemId: string, patch: Partial<SectionItem>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
            }
          : s
      )
    )
    markDirty(sectionId)
  }

  const addItem = (sectionId: string) => {
    const item: SectionItem = { id: newId(), title: '', meta: '', image: '' }
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, item] } : s))
    )
    markDirty(sectionId)
  }

  const removeItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s
      )
    )
    markDirty(sectionId)
  }

  const addSection = () => {
    const section = defaultSection(sections.length + 1)
    setSections((prev) => [...prev, section])
    markDirty(section.id)
    setExpandedIds((prev) => new Set(prev).add(section.id))
    notify('ok', 'Sección añadida. Rellena los campos y pulsa Guardar.')
  }

  const moveSection = (id: string, dir: -1 | 1) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      const target = idx + dir
      if (idx < 0 || target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.splice(target, 0, item)
      return next
    })
    setDirtyIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const saveSection = async (section: Section) => {
    setBusy(true)
    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...section,
          items: section.items.map((it) => ({
            id: it.id || newId(),
            title: it.title,
            meta: it.meta,
            description: it.description,
            image: it.image,
            link: it.link,
          })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        notify('error', data.error || 'No se pudo guardar la sección')
        return
      }
      setDirtyIds((prev) => {
        const next = new Set(prev)
        next.delete(section.id)
        return next
      })
      notify('ok', 'Sección guardada correctamente')
    } catch {
      notify('error', 'Error de conexión al guardar')
    } finally {
      setBusy(false)
    }
  }

  const deleteSection = async (section: Section) => {
    if (!window.confirm(`¿Eliminar la sección "${section.title}"?`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/sections/${section.id}`, { method: 'DELETE' })
      if (!res.ok) {
        notify('error', 'No se pudo eliminar la sección')
        return
      }
      setSections((prev) => prev.filter((s) => s.id !== section.id))
      setDirtyIds((prev) => {
        const next = new Set(prev)
        next.delete(section.id)
        return next
      })
      notify('ok', 'Sección eliminada')
    } catch {
      notify('error', 'Error de conexión al eliminar')
    } finally {
      setBusy(false)
    }
  }

  const restoreDefaults = async () => {
    if (
      !window.confirm(
        'Esto reemplazará tus secciones actuales con las de ejemplo (CONSULTORÍAS, INVESTIGACIONES y ARTÍCULOS). ¿Continuar?'
      )
    )
      return
    setBusy(true)
    try {
      for (const section of defaultSections) {
        await fetch(`/api/sections/${section.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(section),
        })
      }
      await loadSections()
      notify('ok', 'Secciones restauradas a las de ejemplo')
    } catch {
      notify('error', 'Error al restaurar las secciones')
    } finally {
      setBusy(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Cargando...</div>
      </div>
    )
  }

  if (status === 'login') {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-cream flex items-center justify-center mb-4">
              <Settings size={22} className="text-brand-gold" />
            </div>
            <h1 className="font-serif font-bold text-xl text-brand-navy">Editor de Secciones</h1>
            <p className="text-xs text-gray-500 mt-1">
              Ingresa la contraseña para administrar las publicaciones.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full py-3 rounded-lg bg-brand-navy text-white font-bold text-xs tracking-widest uppercase hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
          >
            {busy ? 'Ingresando...' : 'Entrar'}
          </button>
          {toast && (
            <p className={`text-xs text-center ${toast.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
              {toast.text}
            </p>
          )}
          <Link href="/" className="block text-center text-xs text-gray-400 hover:text-brand-gold transition-colors">
            ← Volver al inicio
          </Link>
        </form>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-brand-navy text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center">
              <Settings size={16} className="text-brand-gold" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wider">EDITOR DE SECCIONES</p>
              <p className="text-[10px] text-gray-400 hidden sm:block">
                PUBLICACIONES
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={14} /> Inicio
            </Link>
            <Link
              href="/publicaciones"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-brand-gold text-brand-navy hover:bg-brand-gold/90 transition-colors"
            >
              <Eye size={14} /> Ver página
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">Secciones</h1>
            <p className="text-sm text-gray-500 mt-1">
              Añade cuantas secciones quieras. Cada una se muestra como una tarjeta en el inicio y
              en la página de publicaciones.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={restoreDefaults}
              disabled={busy}
              className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-brand-navy hover:border-brand-gold transition-colors disabled:opacity-50"
            >
              Restaurar ejemplos
            </button>
            <button
              onClick={addSection}
              disabled={busy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
            >
              <Plus size={15} /> Añadir sección
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`px-4 py-3 rounded-lg text-sm font-semibold ${
              toast.type === 'ok'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {toast.text}
          </div>
        )}

        {/* Sections */}
        {sections.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-400 mb-4">
              No hay secciones. Crea una nueva o restaura las de ejemplo.
            </p>
            <button
              onClick={addSection}
              className="px-5 py-3 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 transition-colors"
            >
              <Plus size={14} className="inline mr-1" /> Añadir primera sección
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {sections.map((section, index) => {
              const expanded = expandedIds.has(section.id)
              const dirty = dirtyIds.has(section.id)

              return (
                <div
                  key={section.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Collapsed header */}
                  <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
                    <button
                      onClick={() => toggleExpanded(section.id)}
                      className="flex items-center gap-3 flex-grow text-left group"
                    >
                      <span className="w-7 h-7 rounded-md bg-brand-navy/5 text-[10px] font-bold text-brand-gold flex items-center justify-center">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-grow min-w-0">
                        <span className="block text-sm font-bold text-brand-navy truncate group-hover:text-brand-gold transition-colors">
                          {section.title || 'Sin título'}
                        </span>
                        <span className="block text-[11px] text-gray-400">
                          {section.type === 'book' ? 'Publicación destacada' : 'Carrusel'} ·{' '}
                          {section.items.length} ítem(s)
                        </span>
                      </span>
                      {dirty && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
                          Sin guardar
                        </span>
                      )}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveSection(section.id, -1)}
                        disabled={index === 0}
                        aria-label="Subir sección"
                        className="p-2 rounded-md text-gray-400 hover:text-brand-navy hover:bg-gray-50 disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveSection(section.id, 1)}
                        disabled={index === sections.length - 1}
                        aria-label="Bajar sección"
                        className="p-2 rounded-md text-gray-400 hover:text-brand-navy hover:bg-gray-50 disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => toggleExpanded(section.id)}
                        aria-label={expanded ? 'Contraer' : 'Expandir'}
                        className="p-2 rounded-md text-gray-400 hover:text-brand-navy hover:bg-gray-50"
                      >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded editor */}
                  {expanded && (
                    <div className="border-t border-gray-100 px-4 py-5 sm:px-5 space-y-5">
                      {/* Basic fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                            Título de la sección
                          </label>
                          <input
                            value={section.title}
                            onChange={(e) => patchSection(section.id, { title: e.target.value })}
                            placeholder="Ej: INVESTIGACIONES"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                            Tipo de tarjeta
                          </label>
                          <select
                            value={section.type}
                            onChange={(e) =>
                              patchSection(section.id, { type: e.target.value as SectionType })
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                          >
                            <option value="carousel">Carrusel (varios ítems)</option>
                            <option value="book">Publicación destacada (libro)</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                            Ícono
                          </label>
                          <select
                            value={section.icon}
                            onChange={(e) =>
                              patchSection(section.id, { icon: e.target.value as SectionIcon })
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                          >
                            {ICON_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                            Enlace del botón "Ver todas" (opcional)
                          </label>
                          <input
                            value={section.link || ''}
                            onChange={(e) => patchSection(section.id, { link: e.target.value })}
                            placeholder="/publicaciones o una URL externa"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                            Ítems / Artículos
                          </p>
                          <button
                            onClick={() => addItem(section.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-gold text-brand-gold text-xs font-bold hover:bg-cream transition-colors"
                          >
                            <Plus size={13} /> Añadir artículo / ítem
                          </button>
                        </div>

                        {section.items.length === 0 && (
                          <p className="text-xs text-gray-400">
                            Sin ítems. Añade al menos uno.
                          </p>
                        )}

                        {section.items.map((item, itemIndex) => (
                          <ItemEditor
                            key={item.id}
                            item={item}
                            index={itemIndex}
                            sectionType={section.type}
                            onChange={(patch) => patchItem(section.id, item.id, patch)}
                            onRemove={() => removeItem(section.id, item.id)}
                          />
                        ))}
                      </div>

                      {/* Preview */}
                      <div className="border-t border-gray-100 pt-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <EyeOff size={14} className="text-gray-400" />
                          <span className="font-bold">Vista previa (así se verá en el sitio)</span>
                        </div>
                        <div className="max-w-md mx-auto">
                          {section.type === 'book' ? (
                            <SectionBookCard section={section} isVisible delay="0s" />
                          ) : (
                            <SectionCarouselCard section={section} isVisible delay="0s" />
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-100 pt-5">
                        <button
                          onClick={() => saveSection(section)}
                          disabled={busy}
                          className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
                        >
                          <Save size={14} className="text-brand-gold" /> Guardar sección
                        </button>
                        <button
                          onClick={() => deleteSection(section)}
                          disabled={busy}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-500 text-xs font-bold tracking-wider uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

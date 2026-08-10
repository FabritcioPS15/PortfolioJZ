'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import {
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  Settings,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronDown,
  Layers,
  FilePlus2,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react'
import {
  defaultSection,
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

const ICON_OPTIONS: { value: SectionIcon; label: string }[] = [
  { value: 'briefcase', label: 'Maletín (servicios)' },
  { value: 'search', label: 'Lupa (búsqueda)' },
  { value: 'book-open', label: 'Libro abierto' },
  { value: 'pen-tool', label: 'Pluma' },
]

export default function AdminPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  const notify = useCallback((type: 'ok' | 'error', text: string) => {
    if (type === 'ok') toast.success(text)
    else toast.error(text)
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

  // Mantener una sección seleccionada (primera si no hay selección válida)
  useEffect(() => {
    setSelectedId((prev) => {
      if (!prev || !sections.some((s) => s.id === prev)) {
        return sections[0]?.id ?? null
      }
      return prev
    })
  }, [sections])

  // Al cambiar de sección, cerrar el editor de ítems abierto
  useEffect(() => {
    setExpandedItemId(null)
  }, [selectedId])

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
    setSelectedId(null)
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
    setExpandedItemId(item.id)
  }

  const removeItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s
      )
    )
    if (expandedItemId === itemId) setExpandedItemId(null)
    markDirty(sectionId)
  }

  const addSection = () => {
    const section = defaultSection(sections.length + 1)
    setSections((prev) => [...prev, section])
    markDirty(section.id)
    setSelectedId(section.id)
    notify('ok', 'Sección añadida. Rellena los campos y pulsa Guardar.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    markDirty(id)
  }

  const saveSection = async (section: Section) => {
    setBusy(true)
    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section),
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
    if (!window.confirm(`¿Eliminar la sección "${section.title}"? Esta acción no se puede deshacer.`))
      return
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full py-3 rounded-lg bg-brand-navy text-white font-bold text-xs tracking-widest uppercase hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
          >
            {busy ? 'Ingresando...' : 'Entrar'}
          </button>
          <Link href="/" className="block text-center text-xs text-gray-400 hover:text-brand-gold transition-colors">
            ← Volver al inicio
          </Link>
        </form>
        <Toaster position="top-center" toastOptions={{ style: { fontSize: '13px' } }} />
      </div>
    )
  }

  const selectedIndex = sections.findIndex((s) => s.id === selectedId)
  const selectedSection = selectedIndex >= 0 ? sections[selectedIndex] : null

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-brand-navy via-[#142b52] to-brand-navy text-white shadow-xl border-b border-brand-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 rounded-xl bg-cream flex items-center justify-center ring-2 ring-brand-gold/50 flex-shrink-0">
              <BookOpen size={17} className="text-brand-gold" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-gold border-2 border-brand-navy"></span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-[0.15em] uppercase flex items-center gap-2 truncate">
                Editor de Publicaciones
                <span className="hidden md:inline-flex px-1.5 py-0.5 rounded-full bg-brand-gold text-brand-navy text-[9px] font-black tracking-wider flex-shrink-0">
                  ADMIN
                </span>
              </p>
              <p className="text-[10px] text-brand-gold/80 hidden sm:block tracking-wide truncate">
                INVESTIGACIONES · ARTÍCULOS · PUBLICACIONES
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dirtyIds.size > 0 && (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                {dirtyIds.size} {dirtyIds.size === 1 ? 'sección' : 'secciones'} sin guardar
              </span>
            )}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={14} /> Inicio
            </Link>
            <Link
              href={selectedSection?.link || '/publicaciones'}
              target="_blank"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontSize: '13px', fontWeight: 600 },
            success: {
              iconTheme: { primary: '#B08D2E', secondary: '#fff' },
              style: { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
            },
            error: {
              iconTheme: { primary: '#DC2626', secondary: '#fff' },
              style: { background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' },
            },
          }}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ===== Sidebar: listado de secciones ===== */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-20">
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-cream/70 to-transparent flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-navy flex items-center justify-center">
                  <Layers size={16} className="text-brand-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-navy tracking-wider uppercase">
                    Secciones
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {sections.length} {sections.length === 1 ? 'sección' : 'secciones'}
                  </p>
                </div>
              </div>

              {/* Listado */}
              <div className="max-h-[50vh] lg:max-h-[calc(100vh-20rem)] overflow-y-auto p-2 space-y-1">
                {sections.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <FilePlus2 size={28} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">Aún no hay secciones</p>
                  </div>
                ) : (
                  sections.map((section, index) => {
                    const active = section.id === selectedId
                    const dirty = dirtyIds.has(section.id)
                    return (
                      <button
                        key={section.id}
                        onClick={() => setSelectedId(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 border ${
                          active
                            ? 'bg-cream border-brand-gold/40 shadow-sm'
                            : 'border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            active ? 'bg-brand-gold text-white' : 'bg-brand-navy/5 text-brand-gold'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`block text-sm font-bold truncate ${
                              active ? 'text-brand-navy' : 'text-gray-700'
                            }`}
                          >
                            {section.title || 'Sin título'}
                          </span>
                        <span className="block text-[11px] text-gray-400">
                          {section.type === 'book' ? 'Publicación (libro)' : 'Carrusel'} ·{' '}
                          {section.items.length} ítem(s)
                        </span>
                      </span>
                      <span className="flex items-center gap-1 flex-shrink-0">
                        {section.isVisible === false && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[9px] font-bold uppercase">
                            <EyeOff size={9} /> Oculta
                          </span>
                        )}
                        {dirty && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase">
                            Sin guardar
                          </span>
                        )}
                          <ChevronRight
                            size={14}
                            className={active ? 'text-brand-gold' : 'text-gray-300'}
                          />
                        </span>
                      </button>
                    )
                  })
                )}
              </div>

              {/* Acciones */}
              <div className="p-3 border-t border-gray-100 space-y-2">
                <button
                  onClick={addSection}
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
                >
                  <Plus size={14} className="text-brand-gold" /> Añadir sección
                </button>
              </div>
            </div>
          </aside>

          {/* ===== Editor de la sección seleccionada ===== */}
          <div className="flex-1 min-w-0">
            {!selectedSection ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 text-center py-24 px-6">
                <FilePlus2 size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-bold text-gray-600">Aún no hay secciones</p>
                <p className="text-xs text-gray-400 mt-1 mb-5">
                  Crea la primera sección para empezar a publicar.
                </p>
                <button
                  onClick={addSection}
                  className="px-5 py-3 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 transition-colors"
                >
                  <Plus size={14} className="inline mr-1 text-brand-gold" /> Añadir primera sección
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Encabezado del editor */}
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-xl font-serif font-bold text-brand-navy truncate">
                      {selectedSection.title || 'Nueva sección'}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Editando la sección {selectedIndex + 1} de {sections.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveSection(selectedSection.id, -1)}
                      disabled={selectedIndex === 0}
                      aria-label="Subir sección"
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-brand-navy hover:border-brand-gold transition-colors disabled:opacity-30"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      onClick={() => moveSection(selectedSection.id, 1)}
                      disabled={selectedIndex === sections.length - 1}
                      aria-label="Bajar sección"
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-brand-navy hover:border-brand-gold transition-colors disabled:opacity-30"
                    >
                      <ArrowDown size={15} />
                    </button>
                    {selectedSection.link && selectedSection.link.startsWith('/') ? (
                      <Link
                        href={selectedSection.link}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-brand-gold hover:text-brand-navy transition-colors"
                      >
                        <Eye size={13} /> Ver página
                      </Link>
                    ) : null}
                    <button
                      onClick={() => saveSection(selectedSection)}
                      disabled={busy}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
                    >
                      <Save size={14} className="text-brand-gold" /> Guardar
                    </button>
                  </div>
                </div>

                <div className="px-5 py-5 space-y-6">
                  {/* Datos básicos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Visibilidad */}
                    <div className="sm:col-span-2 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedSection.isVisible === false
                              ? 'bg-gray-200 text-gray-500'
                              : 'bg-brand-gold/15 text-brand-gold'
                          }`}
                        >
                          {selectedSection.isVisible === false ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                            Visible en el sitio
                          </p>
                          <p className="text-[11px] text-gray-400 leading-snug">
                            {selectedSection.isVisible === false
                              ? 'Oculta: no aparecerá en el sitio público.'
                              : 'Activa: se muestra en la página de inicio y en su sección.'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          patchSection(selectedSection.id, {
                            isVisible: selectedSection.isVisible === false,
                          })
                        }
                        aria-label="Alternar visibilidad de la sección"
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                          selectedSection.isVisible === false ? 'bg-gray-300' : 'bg-brand-gold'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                            selectedSection.isVisible === false ? 'left-0.5' : 'left-[26px]'
                          }`}
                        ></span>
                      </button>
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                        Título de la sección
                      </label>
                      <input
                        value={selectedSection.title}
                        onChange={(e) =>
                          patchSection(selectedSection.id, { title: e.target.value })
                        }
                        placeholder="Ej: INVESTIGACIONES"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                        Tipo de tarjeta
                      </label>
                      <select
                        value={selectedSection.type}
                        onChange={(e) =>
                          patchSection(selectedSection.id, { type: e.target.value as SectionType })
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
                        value={selectedSection.icon}
                        onChange={(e) =>
                          patchSection(selectedSection.id, { icon: e.target.value as SectionIcon })
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
                        value={selectedSection.link || ''}
                        onChange={(e) =>
                          patchSection(selectedSection.id, { link: e.target.value })
                        }
                        placeholder="/publicaciones o una URL externa"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                      />
                    </div>
                  </div>

                  {/* Ítems */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                          Ítems / Artículos
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {selectedSection.items.length}{' '}
                          {selectedSection.items.length === 1 ? 'publicación' : 'publicaciones'} en
                          esta sección
                        </p>
                      </div>
                      <button
                        onClick={() => addItem(selectedSection.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-gold text-brand-gold text-xs font-bold hover:bg-cream transition-colors"
                      >
                        <Plus size={13} /> Añadir artículo / ítem
                      </button>
                    </div>

                    {selectedSection.items.length === 0 && (
                      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3 border border-dashed border-gray-200">
                        Sin ítems todavía. Pulsa "Añadir artículo / ítem" para crear el primero.
                      </p>
                    )}

                    {selectedSection.items.map((item, itemIndex) => {
                      const isExpanded = expandedItemId === item.id
                      return (
                        <div
                          key={item.id}
                          className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                            isExpanded
                              ? 'border-brand-gold/50 shadow-sm'
                              : 'border-gray-200 hover:border-brand-gold/30'
                          }`}
                        >
                          {/* Fila compacta: imagen principal + nombre */}
                          <div
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer bg-white hover:bg-cream/40 transition-colors"
                          >
                            <span className="w-14 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border border-gray-100">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image}
                                  alt={item.title || 'Imagen principal'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon size={16} className="text-gray-300" />
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-bold text-brand-navy truncate">
                                {item.title || `Publicación ${itemIndex + 1} (sin título)`}
                              </span>
                              <span className="block text-[11px] text-gray-400 truncate">
                                {item.category || 'Sin categoría'}
                                {item.meta ? ` · ${item.meta}` : ''}
                              </span>
                            </span>
                            <span className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeItem(selectedSection.id, item.id)
                                }}
                                aria-label="Eliminar ítem"
                                className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                              <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-brand-gold' : ''
                                }`}
                              />
                            </span>
                          </div>

                          {/* Editor completo: solo si está seleccionado */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-white">
                              <ItemEditor
                                item={item}
                                index={itemIndex}
                                sectionType={selectedSection.type}
                                onChange={(patch) => patchItem(selectedSection.id, item.id, patch)}
                                onRemove={() => removeItem(selectedSection.id, item.id)}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Vista previa */}
                  <div className="border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Eye size={14} className="text-brand-gold" />
                      <span className="font-bold">Vista previa (así se verá en el sitio)</span>
                    </div>
                    <div className="max-w-md mx-auto">
                      {selectedSection.type === 'book' ? (
                        <SectionBookCard section={selectedSection} isVisible delay="0s" />
                      ) : (
                        <SectionCarouselCard section={selectedSection} isVisible delay="0s" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones finales */}
                <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                  <button
                    onClick={() => deleteSection(selectedSection)}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-500 text-xs font-bold tracking-wider uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} /> Eliminar sección
                  </button>
                  <button
                    onClick={() => saveSection(selectedSection)}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-wider uppercase hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
                  >
                    <Save size={14} className="text-brand-gold" /> {busy ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

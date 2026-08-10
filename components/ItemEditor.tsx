'use client'

import { useRef, useState } from 'react'
import { Trash2, ImagePlus, Loader2, Star, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SectionItem, SectionType } from '@/lib/sections'

export default function ItemEditor({
  item,
  index,
  sectionType,
  onChange,
  onRemove,
}: {
  item: SectionItem
  index: number
  sectionType: SectionType
  onChange: (patch: Partial<SectionItem>) => void
  onRemove: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const tagsString = (item.tags ?? []).join(', ')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        setUploadError(data.error || 'No se pudo subir la imagen')
        toast.error(data.error || 'No se pudo subir la imagen')
        return
      }
      onChange({ image: data.url })
      toast.success('Imagen subida correctamente')
    } catch {
      setUploadError('Error de conexión al subir la imagen')
      toast.error('Error de conexión al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border border-gray-100 rounded-lg p-4 space-y-4 bg-gray-50/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-gray-500">
            {sectionType === 'book' ? 'Publicación' : 'Artículo / Ítem'} {index + 1}
          </p>
          {item.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase">
              <Star size={10} /> Destacado
            </span>
          )}
        </div>
        <button
          onClick={onRemove}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold"
        >
          <Trash2 size={13} /> Quitar
        </button>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Título *
          </label>
          <input
            value={item.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Título del artículo / publicación"
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Categoría
          </label>
          <input
            value={item.category || ''}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="Ej: Investigación, Artículo, Liderazgo..."
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Autor
          </label>
          <input
            value={item.author || ''}
            onChange={(e) => onChange({ author: e.target.value })}
            placeholder="Ej: José Luis Zelada"
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Fecha visible en tarjeta
          </label>
          <input
            value={item.meta}
            onChange={(e) => onChange({ meta: e.target.value })}
            placeholder="Ej: 2024 o Mayo 2024"
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Fecha de publicación
          </label>
          <input
            type="date"
            value={(item.date || '').slice(0, 10)}
            onChange={(e) => onChange({ date: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
      </div>

      {/* Imagen */}
      {sectionType === 'carousel' && (
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Imagen de portada
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin text-brand-gold" />
              ) : (
                <ImagePlus size={14} className="text-brand-gold" />
              )}
              {uploading ? 'Subiendo...' : 'Subir imagen'}
            </button>
            <div className="flex-1 w-full space-y-1">
              <input
                value={item.image || ''}
                onChange={(e) => onChange({ image: e.target.value })}
                placeholder="...o pega la URL de la imagen"
                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
              {uploadError && <p className="text-[11px] text-red-500">{uploadError}</p>}
            </div>
          </div>
          {item.image && (
            <div className="flex items-center gap-3">
              <div className="relative w-24 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => onChange({ image: '' })}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={12} /> Quitar imagen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Extracto / Resumen
        </label>
        <textarea
          value={item.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={2}
          placeholder="Resumen breve que se muestra en la tarjeta"
          className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Contenido completo (cuerpo del artículo)
        </label>
        <textarea
          value={item.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
          rows={8}
          placeholder="Escribe aquí el artículo completo. Separa los párrafos con una línea en blanco."
          className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-y leading-relaxed"
        />
        <p className="text-[10px] text-gray-400">
          Si incluyes contenido, se habilitará una página propia para el artículo
          (/publicaciones/...). El enlace de redirección tiene prioridad si lo indicas.
        </p>
      </div>

      {/* Etiquetas y enlace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Etiquetas (separadas por coma)
          </label>
          <input
            value={tagsString}
            onChange={(e) => onChange({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            placeholder="liderazgo, talento humano, cultura"
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Enlace de redirección (opcional)
          </label>
          <input
            value={item.link || ''}
            onChange={(e) => onChange({ link: e.target.value })}
            placeholder="URL del PDF, publicación externa, etc."
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
      </div>

      {/* Destacado */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={!!item.featured}
          onChange={(e) => onChange({ featured: e.target.checked })}
          className="w-4 h-4 accent-brand-gold"
        />
        <span className="text-xs font-semibold text-gray-600">Marcar como destacado</span>
      </label>
    </div>
  )
}

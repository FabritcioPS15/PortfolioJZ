'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight, User } from 'lucide-react'
import type { Section, SectionItem } from '@/lib/sections'
import { itemHref } from '@/lib/sections'
import { readingTime } from '@/lib/readingTime'

export default function PublicacionCard({
  item,
  section,
  href,
  compact = false,
  entranceStyle,
}: {
  item: SectionItem
  section: Section
  /** Enrutar a la página de detalle de la publicación (true en /publicaciones).
   *  Si es falsy (preview del admin) no hay enlace. */
  href?: string
  /** Modo compacto: menos padding para caber en el admin. */
  compact?: boolean
  /** Estilo de entrada (fade-up del scroll reveal), opcional. */
  entranceStyle?: React.CSSProperties
}) {
  const inner = (
    <>
      {/* Accent superior dorado */}
      <span className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></span>

      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            width={500}
            height={300}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-navy/10 to-brand-gold/10 flex items-center justify-center">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">
              {section.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {item.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-brand-navy text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {item.category}
          </span>
        )}
        {item.meta && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-navy/85 text-white text-[10px] font-semibold tracking-wide">
            {item.meta}
          </span>
        )}
      </div>

      <div className={`p-5 flex flex-col gap-2 flex-grow ${compact ? '!py-4' : ''}`}>
        <h3 className="font-serif font-bold text-base text-brand-navy leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors duration-300">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-auto pt-3">
          <div className="flex items-center gap-3 text-[11px] text-gray-600 min-w-0">
            {item.author && (
              <span className="inline-flex items-center gap-1 truncate">
                <User size={12} className="text-brand-gold flex-shrink-0" />
                <span className="truncate">{item.author}</span>
              </span>
            )}
            {item.content && (
              <span className="inline-flex items-center gap-1 flex-shrink-0">
                <Clock size={12} className="text-brand-gold" /> {readingTime(item.content)}
              </span>
            )}
          </div>
          {href && (
            <span className="text-xs font-bold text-brand-navy inline-flex items-center gap-1 flex-shrink-0 group-hover:text-brand-gold transition-colors">
              Leer más <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {item.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] text-gray-600"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )

  const classes = `group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm ${
    href ? 'hover:shadow-xl hover:-translate-y-1' : ''
  } transition-all duration-300 border border-gray-100 ${
    href ? 'hover:border-brand-gold/40' : ''
  }`

  const style = entranceStyle ?? undefined

  return href ? (
    <Link href={href} className={classes} style={style}>
      {inner}
    </Link>
  ) : (
    <div className={classes} style={style}>{inner}</div>
  )
}
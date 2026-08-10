'use client'

import Link from 'next/link'
import { itemHref, type Section } from '@/lib/sections'
import { SectionIcon } from './SectionCarouselCard'
import BookCover from './BookCover'

export default function SectionBookCard({
  section,
  isVisible,
  delay = '0.4s',
}: {
  section: Section
  isVisible: boolean
  delay?: string
}) {
  const item = section.items[0]
  const href = item ? itemHref(item, section) : section.link || '/publicaciones'

  return (
    <div
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      style={{
        animationName: isVisible ? 'fadeInUp' : 'none',
        animationDuration: '0.6s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
        animationDelay: delay,
        opacity: 0,
      }}
    >
      {/* Header bar */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <Link
          href={href}
          className="flex items-center gap-2 group/title min-w-0"
        >
          <SectionIcon icon={section.icon} />
          <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase truncate group-hover/title:text-brand-gold transition-colors duration-300">
            {section.title}
          </p>
        </Link>
        <Link href={href} className="text-[11px] font-bold text-brand-navy hover:text-brand-gold transition-colors duration-300 flex-shrink-0 ml-3">
          Ver más
        </Link>
      </div>

      {/* Content Body with 2 columns: Book Cover + Details */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="grid grid-cols-12 gap-4 items-center mb-4">
          {/* Left: Book Cover Mockup */}
          <div className="col-span-4 flex justify-center py-2">
            <div className="transform -rotate-3 transition-transform duration-300 group-hover:rotate-0">
              <BookCover title={item?.title} author={item?.meta} size="sm" />
            </div>
          </div>

          {/* Right: Details */}
          <div className="col-span-8 space-y-2">
            <h3 className="font-serif font-bold text-base text-brand-navy leading-snug">
              {item?.title || 'Título de la publicación'}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {item?.description || 'Descripción de la publicación destacada.'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={href}
            className="w-full py-2.5 rounded border border-brand-gold text-brand-gold hover:bg-[#FDF3E3] hover:text-brand-navy font-bold text-xs tracking-wider transition-colors duration-300 flex items-center justify-center"
          >
            CONOCE MÁS
          </Link>
        </div>
      </div>
    </div>
  )
}
